// UI Controls Module
export class UIControls {
  constructor(scene, camera, controls, planets, sun) {
    this.scene = scene;
    this.camera = camera;
    this.controls = controls;
    this.planets = planets;
    this.sun = sun;
    this.activeButton = null;
    this.isPaused = false;
    this.targetObject = null;
    this.isFollowing = false;
    this.defaultCameraPosition = new THREE.Vector3(0, 200, 1000);
    
    this.createUI();
  }

  createUI() {
    // Main container
    this.controlsContainer = document.createElement("div");
    this.controlsContainer.style.position = "absolute";
    this.controlsContainer.style.top = "10px";
    this.controlsContainer.style.left = "10px";
    this.controlsContainer.style.zIndex = "100";
    this.controlsContainer.style.background = "rgba(0, 0, 0, 0.8)";
    this.controlsContainer.style.padding = "15px";
    this.controlsContainer.style.borderRadius = "10px";
    this.controlsContainer.style.maxWidth = "250px";
    this.controlsContainer.style.maxHeight = "90vh";
    this.controlsContainer.style.overflowY = "auto";
    this.controlsContainer.style.backdropFilter = "blur(10px)";
    document.body.appendChild(this.controlsContainer);
    
    // Add title
    let title = document.createElement("h3");
    title.innerText = "Solar System Controls";
    title.style.color = "#fff";
    title.style.margin = "0 0 10px 0";
    title.style.fontSize = "16px";
    title.style.borderBottom = "1px solid rgba(255,255,255,0.3)";
    title.style.paddingBottom = "8px";
    this.controlsContainer.appendChild(title);

    // Add control section
    this.createControlSection();
    
    // Add celestial bodies section
    this.createCelestialBodiesSection();
    
    // Add toggle button
    this.createToggleButton();
  }

  createControlSection() {
    let controlSection = document.createElement("div");
    controlSection.style.marginBottom = "15px";
    controlSection.style.paddingBottom = "10px";
    controlSection.style.borderBottom = "1px solid rgba(255,255,255,0.2)";
    
    // Pause/Resume Button
    let pauseButton = document.createElement("button");
    pauseButton.innerText = "⏸ Pause";
    pauseButton.style.width = "48%";
    pauseButton.style.padding = "8px";
    pauseButton.style.marginRight = "4%";
    pauseButton.style.cursor = "pointer";
    pauseButton.style.border = "1px solid #007BFF";
    pauseButton.style.background = "rgba(0, 123, 255, 0.2)";
    pauseButton.style.color = "#4da6ff";
    pauseButton.style.borderRadius = "5px";
    pauseButton.style.fontSize = "13px";
    pauseButton.style.transition = "all 0.3s";
    
    pauseButton.addEventListener("click", () => {
      this.isPaused = !this.isPaused;
      pauseButton.innerText = this.isPaused ? "▶ Resume" : "⏸ Pause";
      pauseButton.style.background = this.isPaused ? "rgba(40, 167, 69, 0.2)" : "rgba(0, 123, 255, 0.2)";
      pauseButton.style.borderColor = this.isPaused ? "#28a745" : "#007BFF";
      pauseButton.style.color = this.isPaused ? "#5cb85c" : "#4da6ff";
    });
    controlSection.appendChild(pauseButton);

    // Reset Button
    let resetButton = document.createElement("button");
    resetButton.innerText = "🔄 Reset";
    resetButton.style.width = "48%";
    resetButton.style.padding = "8px";
    resetButton.style.cursor = "pointer";
    resetButton.style.border = "1px solid #dc3545";
    resetButton.style.background = "rgba(220, 53, 69, 0.2)";
    resetButton.style.color = "#ff6b7a";
    resetButton.style.borderRadius = "5px";
    resetButton.style.fontSize = "13px";
    resetButton.style.transition = "all 0.3s";
    resetButton.addEventListener("click", () => this.resetCameraPosition());
    controlSection.appendChild(resetButton);
    
    this.controlsContainer.appendChild(controlSection);
  }

  createCelestialBodiesSection() {
    // Add label
    let bodiesLabel = document.createElement("div");
    bodiesLabel.innerText = "Celestial Bodies";
    bodiesLabel.style.color = "#aaa";
    bodiesLabel.style.fontSize = "12px";
    bodiesLabel.style.marginBottom = "8px";
    bodiesLabel.style.textTransform = "uppercase";
    bodiesLabel.style.letterSpacing = "1px";
    this.controlsContainer.appendChild(bodiesLabel);

    // Sun button
    let sunButton = document.createElement("button");
    sunButton.innerText = "☀ Sun";
    sunButton.style.width = "100%";
    sunButton.style.padding = "10px";
    sunButton.style.marginBottom = "10px";
    sunButton.style.cursor = "pointer";
    sunButton.style.border = "1px solid #ff6600";
    sunButton.style.background = "rgba(255, 102, 0, 0.3)";
    sunButton.style.color = "#ffaa44";
    sunButton.style.borderRadius = "5px";
    sunButton.style.fontSize = "14px";
    sunButton.style.fontWeight = "bold";
    sunButton.style.transition = "all 0.3s";
    
    sunButton.addEventListener("mouseenter", () => {
      sunButton.style.background = "rgba(255, 102, 0, 0.5)";
    });
    sunButton.addEventListener("mouseleave", () => {
      sunButton.style.background = "rgba(255, 102, 0, 0.3)";
    });
    sunButton.addEventListener("click", () => this.moveCameraTo(this.sun));
    this.controlsContainer.appendChild(sunButton);

    // Planet buttons
    this.planets.forEach((planet, index) => {
      this.createPlanetButton(planet, index);
    });
  }

  createPlanetButton(planet, index) {
    // Create planet container
    let planetContainer = document.createElement("div");
    planetContainer.style.marginBottom = "8px";
    
    let button = document.createElement("button");
    button.innerText = planet.name;
    button.dataset.name = planet.name;
    button.style.width = "100%";
    button.style.padding = "8px";
    button.style.cursor = "pointer";
    button.style.border = "1px solid rgba(255,255,255,0.3)";
    button.style.background = "rgba(255,255,255,0.1)";
    button.style.color = "#fff";
    button.style.borderRadius = "5px";
    button.style.fontSize = "14px";
    button.style.transition = "all 0.3s";
    
    button.addEventListener("mouseenter", () => {
      if (button !== this.activeButton) {
        button.style.background = "rgba(255,255,255,0.2)";
      }
    });
    
    button.addEventListener("mouseleave", () => {
      if (button !== this.activeButton) {
        button.style.background = "rgba(255,255,255,0.1)";
      }
    });

    button.addEventListener("click", () =>
      this.toggleFollowObject(planet.mesh, button)
    );
    planetContainer.appendChild(button);

    // Create moon buttons container
    if (planet.moons && planet.moons.length > 0) {
      let moonContainer = document.createElement("div");
      moonContainer.style.marginLeft = "20px";
      moonContainer.style.marginTop = "4px";
      
      planet.moons.forEach((moon) => {
        if (moon && moon.mesh) {
          let moonButton = document.createElement("button");
          moonButton.innerText = moon.mesh.name || moon.name;
          moonButton.dataset.name = `${planet.name} - ${moon.mesh.name || moon.name}`;
          moonButton.style.width = "calc(100% - 10px)";
          moonButton.style.padding = "6px";
          moonButton.style.marginBottom = "3px";
          moonButton.style.cursor = "pointer";
          moonButton.style.border = "1px solid rgba(255,255,255,0.2)";
          moonButton.style.background = "rgba(255,255,255,0.05)";
          moonButton.style.color = "#ccc";
          moonButton.style.borderRadius = "3px";
          moonButton.style.fontSize = "12px";
          moonButton.style.transition = "all 0.3s";
          
          moonButton.addEventListener("mouseenter", () => {
            if (moonButton !== this.activeButton) {
              moonButton.style.background = "rgba(255,255,255,0.15)";
            }
          });
          
          moonButton.addEventListener("mouseleave", () => {
            if (moonButton !== this.activeButton) {
              moonButton.style.background = "rgba(255,255,255,0.05)";
            }
          });

          moonButton.addEventListener("click", () =>
            this.toggleFollowObject(moon.mesh, moonButton)
          );
          moonContainer.appendChild(moonButton);
        }
      });
      planetContainer.appendChild(moonContainer);
    }
    
    this.controlsContainer.appendChild(planetContainer);
  }

  createToggleButton() {
    let toggleControlsButton = document.createElement("button");
    toggleControlsButton.innerText = "◀ Hide";
    toggleControlsButton.style.padding = "8px 12px";
    toggleControlsButton.style.cursor = "pointer";
    toggleControlsButton.style.border = "1px solid rgba(255,255,255,0.3)";
    toggleControlsButton.style.background = "rgba(0, 0, 0, 0.8)";
    toggleControlsButton.style.color = "#fff";
    toggleControlsButton.style.borderRadius = "5px";
    toggleControlsButton.style.position = "absolute";
    toggleControlsButton.style.top = "10px";
    toggleControlsButton.style.right = "10px";
    toggleControlsButton.style.zIndex = "101";
    toggleControlsButton.style.fontSize = "13px";
    toggleControlsButton.style.backdropFilter = "blur(10px)";
    toggleControlsButton.style.transition = "all 0.3s";
    document.body.appendChild(toggleControlsButton);

    toggleControlsButton.addEventListener("mouseenter", () => {
      toggleControlsButton.style.background = "rgba(0, 0, 0, 0.9)";
      toggleControlsButton.style.borderColor = "rgba(255,255,255,0.5)";
    });
    
    toggleControlsButton.addEventListener("mouseleave", () => {
      toggleControlsButton.style.background = "rgba(0, 0, 0, 0.8)";
      toggleControlsButton.style.borderColor = "rgba(255,255,255,0.3)";
    });

    toggleControlsButton.addEventListener("click", () => {
      if (this.controlsContainer.style.display === "none") {
        this.controlsContainer.style.display = "block";
        toggleControlsButton.innerText = "◀ Hide";
      } else {
        this.controlsContainer.style.display = "none";
        toggleControlsButton.innerText = "▶ Show";
      }
    });
  }

  toggleFollowObject(objectMesh, button) {
    if (this.targetObject === objectMesh && this.isFollowing) {
      this.resetCameraPosition();
      return;
    }

    this.targetObject = objectMesh;
    this.isFollowing = true;

    let targetPosition = new THREE.Vector3();
    objectMesh.getWorldPosition(targetPosition);

    let isMoon = objectMesh.name.toLowerCase().includes("moon");
    let offset = isMoon
      ? new THREE.Vector3(-10, 3, -15)
      : new THREE.Vector3(-30, 10, -50);

    this.camera.position.copy(targetPosition.clone().add(offset));
    this.controls.target.copy(targetPosition);

    this.controls.minDistance = isMoon ? 0.5 : 2;
    this.controls.maxDistance = isMoon ? 50 : 200;
    this.controls.enableZoom = true;
    this.controls.update();

    // Update button UI
    if (this.activeButton) {
      this.activeButton.style.background = this.activeButton.dataset.originalBg || "rgba(255,255,255,0.1)";
      this.activeButton.style.color = this.activeButton.dataset.originalColor || "#fff";
      this.activeButton.style.borderColor = this.activeButton.dataset.originalBorder || "rgba(255,255,255,0.3)";
      this.activeButton.innerText = this.activeButton.dataset.name;
    }

    this.activeButton = button;
    button.dataset.originalBg = button.style.background;
    button.dataset.originalColor = button.style.color;
    button.dataset.originalBorder = button.style.borderColor;
    button.style.background = "rgba(76, 175, 80, 0.4)";
    button.style.borderColor = "#4CAF50";
    button.style.color = "#90ee90";
    button.innerText = `▶ ${objectMesh.name}`;
  }

  resetCameraPosition() {
    this.targetObject = null;
    this.isFollowing = false;
    this.camera.position.copy(this.defaultCameraPosition);
    this.controls.target.set(0, 0, 0);

    this.controls.minDistance = 50;
    this.controls.maxDistance = 10000;
    this.controls.enableZoom = true;
    this.controls.update();

    // Reset active button UI
    if (this.activeButton) {
      this.activeButton.style.background = this.activeButton.dataset.originalBg || "rgba(255,255,255,0.1)";
      this.activeButton.style.color = this.activeButton.dataset.originalColor || "#fff";
      this.activeButton.style.borderColor = this.activeButton.dataset.originalBorder || "rgba(255,255,255,0.3)";
      this.activeButton.innerText = this.activeButton.dataset.name;
      this.activeButton = null;
    }
  }

  moveCameraTo(target) {
    let targetPosition = new THREE.Vector3();
    target.getWorldPosition(targetPosition);

    if (target.name === "Sun") {
      this.camera.position.set(
        targetPosition.x + 160,
        targetPosition.y + 140,
        targetPosition.z + 160
      );
      this.controls.target.copy(targetPosition);
      this.targetObject = null;
      this.isFollowing = false;
    } else {
      let offset = target.name.toLowerCase().includes("moon")
        ? new THREE.Vector3(-15, 5, -25)
        : new THREE.Vector3(-50, 20, -100);

      this.camera.position.copy(targetPosition.clone().add(offset));
      this.controls.target.copy(targetPosition);
      this.targetObject = target;
      this.isFollowing = true;
    }

    this.controls.update();
  }

  getState() {
    return {
      isPaused: this.isPaused,
      targetObject: this.targetObject,
      isFollowing: this.isFollowing
    };
  }
}