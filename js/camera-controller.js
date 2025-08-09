// Camera Controller Module
export class CameraController {
  constructor(camera, controls) {
    this.camera = camera;
    this.controls = controls;
  }

  chaseCameraBehind(targetObject, planets) {
    if (!targetObject || !targetObject.mesh) return;
    
    // Get the current world position of the target
    let targetPosition = new THREE.Vector3();
    targetObject.mesh.getWorldPosition(targetPosition);
    
    // Calculate velocity direction for planets
    let velocityDir = new THREE.Vector3(0, 0, 1);
    
    if (targetObject.distance && targetObject.angle !== undefined) {
      // For planets: calculate orbital velocity direction
      let dx = -targetObject.distance * Math.sin(targetObject.angle);
      let dz = targetObject.distance * Math.cos(targetObject.angle);
      velocityDir = new THREE.Vector3(dx, 0, dz).normalize();
    } else {
      // For moons or other objects: use a default following position
      let parentPlanet = planets.find(p => 
        p.moons.some(m => m.mesh === targetObject.mesh)
      );
      if (parentPlanet) {
        // For moons, calculate relative to parent planet
        let moon = parentPlanet.moons.find(m => m.mesh === targetObject.mesh);
        if (moon) {
          let dx = -moon.distance * Math.sin(moon.angle);
          let dz = moon.distance * Math.cos(moon.angle);
          velocityDir = new THREE.Vector3(dx, 0, dz).normalize();
        }
      }
    }
    
    // Adjust follow distance based on object size
    let objectSize = targetObject.mesh.geometry.parameters.radius || 10;
    const FOLLOW_DISTANCE = Math.max(objectSize * 3, 30);
    const FOLLOW_HEIGHT = Math.max(objectSize * 1.5, 10);
    
    // Calculate camera position behind the object
    let behindVector = velocityDir.clone().multiplyScalar(-FOLLOW_DISTANCE);
    behindVector.y = FOLLOW_HEIGHT;
    
    let desiredCamPos = targetPosition.clone().add(behindVector);
    
    // Smoothly interpolate camera position and target
    this.camera.position.lerp(desiredCamPos, 0.1);
    this.controls.target.lerp(targetPosition, 0.1);
    
    // Keep controls enabled for user interaction
    this.controls.enableRotate = true;
    this.controls.enablePan = true;
    this.controls.enableZoom = true;
  }

  updateFollowing(uiState, planets) {
    if (uiState.isFollowing && uiState.targetObject) {
      // Find if it's a planet
      let targetPlanet = planets.find(p => p.mesh === uiState.targetObject);
      
      if (targetPlanet) {
        this.chaseCameraBehind(targetPlanet, planets);
      } else {
        // Check if it's a moon
        for (let planet of planets) {
          let targetMoon = planet.moons.find(m => m.mesh === uiState.targetObject);
          if (targetMoon) {
            this.chaseCameraBehind(targetMoon, planets);
            break;
          }
        }
      }
    }
  }
}