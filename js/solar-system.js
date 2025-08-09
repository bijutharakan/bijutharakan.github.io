// Main Solar System Module
import { planetData, planetTilts, planetRotationSpeeds, orionStarsData, bigDipperStarsData, cassiopeiaStarsData, pleiadesStarsData } from './planet-data.js';
import { UIControls } from './ui-controls.js';
import { CameraController } from './camera-controller.js';

export class SolarSystem {
  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      10000
    );
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.textureLoader = new THREE.TextureLoader();
    this.planets = [];
    
    this.init();
  }

  init() {
    // Setup renderer
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    // Setup controls
    this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(0, 0, 1000);
    this.controls.update();

    // Setup lighting
    this.setupLighting();
    
    // Create scene objects
    this.createGround();
    this.createStars();
    this.createSun();
    this.createPlanets();
    this.createConstellations();
    
    // Setup UI
    this.uiControls = new UIControls(this.scene, this.camera, this.controls, this.planets, this.sun);
    
    // Setup camera controller
    this.cameraController = new CameraController(this.camera, this.controls);
    
    // Start animation
    this.animate();
    
    // Handle window resize
    window.addEventListener('resize', () => this.onWindowResize());
  }

  setupLighting() {
    // Ambient Light
    let ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
    this.scene.add(ambientLight);

    // Sun Light
    this.sunLight = new THREE.PointLight(0xffffff, 2, 1300);
    this.sunLight.position.set(0, 0, 0);
    this.sunLight.shadow.mapSize.width = 4096;
    this.sunLight.shadow.mapSize.height = 4096;
    this.sunLight.shadow.camera.near = 1;
    this.sunLight.shadow.camera.far = 25000;
    this.sunLight.shadow.camera.left = -5000;
    this.sunLight.shadow.camera.right = 5000;
    this.sunLight.shadow.camera.top = 5000;
    this.sunLight.shadow.camera.bottom = -5000;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);
  }

  createGround() {
    let groundGeometry = new THREE.PlaneGeometry(20000, 20000);
    let groundMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
    let ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.position.y = -100;
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  createStars() {
    // Background Stars
    let starGeometry = new THREE.BufferGeometry();
    let starVertices = [];
    for (let i = 0; i < 5000; i++) {
      let x = (Math.random() - 0.5) * 10000;
      let y = (Math.random() - 0.5) * 10000;
      let z = (Math.random() - 0.5) * 10000;
      starVertices.push(x, y, z);
    }
    starGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(starVertices, 3)
    );
    let starMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.5,
    });
    let stars = new THREE.Points(starGeometry, starMaterial);
    this.scene.add(stars);
  }

  createSun() {
    this.sun = this.createLabeledObject("Sun", 180, "./img/sun.jpg", 0xff4500);
    this.scene.add(this.sun);
  }

  createLabeledObject(name, size, texturePath, emissiveColor) {
    let geometry = new THREE.SphereGeometry(size, 64, 64);
    let material = new THREE.MeshStandardMaterial({
      map: this.textureLoader.load(texturePath),
      roughness: 0.8,
      metalness: 0.0,
      emissive: emissiveColor,
      emissiveIntensity: name == "Sun" ? 2 : 0.3,
    });
    let planet = new THREE.Mesh(geometry, material);
    planet.name = name;
    
    if (planet.name === "Sun") {
      planet.castShadow = false;
      planet.receiveShadow = false;
    } else {
      planet.castShadow = true;
      planet.receiveShadow = true;
    }

    // Create label
    let labelDiv = document.createElement("div");
    labelDiv.style.position = "absolute";
    labelDiv.style.color = "white";
    labelDiv.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    labelDiv.style.padding = "4px";
    labelDiv.style.fontSize = "12px";
    labelDiv.innerHTML = name;
    document.body.appendChild(labelDiv);
    planet.label = labelDiv;

    return planet;
  }

  createRings(planet, innerRadius, outerRadius, texturePath, tiltAngle) {
    let segments = 64;
    let ringGeometry = new THREE.BufferGeometry();
    let positions = [];
    let uvs = [];
    let indices = [];

    for (let i = 0; i <= segments; i++) {
      let angle = (i / segments) * Math.PI * 2;
      let xInner = innerRadius * Math.cos(angle);
      let zInner = innerRadius * Math.sin(angle);
      let xOuter = outerRadius * Math.cos(angle);
      let zOuter = outerRadius * Math.sin(angle);

      positions.push(xInner, 0, zInner, xOuter, 0, zOuter);
      uvs.push(i / segments, 0, i / segments, 1);

      if (i < segments) {
        let base = i * 2;
        indices.push(
          base,
          base + 1,
          base + 2,
          base + 1,
          base + 3,
          base + 2
        );
      }
    }

    ringGeometry.setAttribute(
      "position",
      new THREE.Float32BufferAttribute(positions, 3)
    );
    ringGeometry.setAttribute(
      "uv",
      new THREE.Float32BufferAttribute(uvs, 2)
    );
    ringGeometry.setIndex(indices);

    let ringMaterial = new THREE.MeshBasicMaterial({
      map: this.textureLoader.load(texturePath),
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.5,
    });

    let ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.rotation.x = tiltAngle;
    planet.add(ring);
  }

  createMoon(parentPlanet, moonData) {
    let moonGeometry = new THREE.SphereGeometry(moonData.size, 32, 32);
    let moonMaterial = new THREE.MeshStandardMaterial({
      map: this.textureLoader.load(moonData.texture),
    });
    let moon = new THREE.Mesh(moonGeometry, moonMaterial);
    moon.name = moonData.name;
    moon.castShadow = true;
    moon.receiveShadow = true;

    // Set moon's initial position
    let moonInitialPosition = new THREE.Vector3(moonData.distance, 0, 0);
    moon.position.copy(moonInitialPosition);
    this.scene.add(moon);

    return {
      mesh: moon,
      speed: moonData.speed,
      distance: moonData.distance,
      angle: Math.random() * Math.PI * 2,
    };
  }

  createPlanets() {
    planetData.forEach((data) => {
      let planet = this.createLabeledObject(
        data.name,
        data.size,
        data.texture,
        data.glow
      );

      this.scene.add(planet);
      
      let planetObject = {
        name: data.name,
        mesh: planet,
        speed: data.speed,
        distance: data.distance,
        angle: Math.random() * Math.PI * 2,
        moons: [],
      };

      // Create moons
      if (data.moons) {
        data.moons.forEach((moonData) => {
          let moon = this.createMoon(planetObject, moonData);
          planetObject.moons.push(moon);
        });
      }

      this.planets.push(planetObject);

      // Create rings
      if (data.rings) {
        this.createRings(
          planet,
          data.size * 1.5,
          data.size * 2.5,
          data.ringTexture,
          data.ringTilt
        );
      }

      // Apply tilt
      if (planetTilts[data.name]) {
        planet.rotation.z = planetTilts[data.name];
      }
    });
  }

  createConstellation(starData, radius = 4000, color = 0xffffff) {
    let constellationStars = new THREE.Group();

    starData.forEach((star) => {
      let raRad = (star.RA / 24) * Math.PI * 2;
      let decRad = (star.Dec / 90) * (Math.PI / 2);

      let x = radius * Math.cos(decRad) * Math.cos(raRad);
      let y = radius * Math.sin(decRad);
      let z = radius * Math.cos(decRad) * Math.sin(raRad);

      let starGeometry = new THREE.SphereGeometry(star.size, 12, 12);
      let starMaterial = new THREE.MeshBasicMaterial({ color: color });
      let starMesh = new THREE.Mesh(starGeometry, starMaterial);
      starMesh.position.set(x, y, z);

      constellationStars.add(starMesh);
    });

    return constellationStars;
  }

  createConstellations() {
    let orionStars = this.createConstellation(orionStarsData, 9000, 0xffffff);
    let bigDipperStars = this.createConstellation(bigDipperStarsData, 9200, 0xffffff);
    let cassiopeiaStars = this.createConstellation(cassiopeiaStarsData, 8000, 0xffffff);
    let pleiadesStars = this.createConstellation(pleiadesStarsData, 8000, 0xffffff);

    let backgroundStars = new THREE.Group();
    backgroundStars.add(orionStars);
    backgroundStars.add(bigDipperStars);
    backgroundStars.add(cassiopeiaStars);
    backgroundStars.add(pleiadesStars);

    this.scene.add(backgroundStars);
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const uiState = this.uiControls.getState();

    if (!uiState.isPaused) {
      // Rotate sun
      this.sun.rotation.y += 0.002;

      // Update planets
      this.planets.forEach((planet) => {
        planet.angle += planet.speed;
        planet.mesh.position.x = planet.distance * Math.cos(planet.angle);
        planet.mesh.position.z = planet.distance * Math.sin(planet.angle);

        // Planet rotation
        if (planetRotationSpeeds[planet.name]) {
          planet.mesh.rotation.y += planetRotationSpeeds[planet.name];
        }

        // Update moons
        planet.moons.forEach((moon) => {
          moon.angle += moon.speed;
          let moonX = moon.distance * Math.cos(moon.angle);
          let moonZ = moon.distance * Math.sin(moon.angle);
          let planetPosition = planet.mesh.position;

          moon.mesh.position.set(
            planetPosition.x + moonX,
            planetPosition.y,
            planetPosition.z + moonZ
          );

          moon.mesh.rotation.y += 0.02; // Moon self-rotation
        });

        // Update planet labels position
        let vector = new THREE.Vector3();
        planet.mesh.getWorldPosition(vector);
        let coords = vector.project(this.camera);
        let x = (coords.x * 0.5 + 0.5) * window.innerWidth;
        let y = (coords.y * -0.5 + 0.5) * window.innerHeight;
        planet.mesh.label.style.transform = `translate(${x}px, ${y}px)`;
      });

      // Update camera following
      this.cameraController.updateFollowing(uiState, this.planets);
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}