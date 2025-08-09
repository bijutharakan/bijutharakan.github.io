// Planet configuration data
export const planetData = [
  {
    name: "Mercury",
    size: 3.8, // 0.38x Earth
    distance: 200,
    speed: 0.004,
    texture: "./img/mercury.jpg",
    glow: "C07B41",
    moons: [],
  },
  {
    name: "Venus",
    size: 9.5, // 0.95x Earth
    distance: 245,
    speed: 0.003,
    texture: "./img/venus2.jpg",
    glow: "C07B41",
    moons: [],
  },
  {
    name: "Earth",
    size: 10, // Reference size
    distance: 290,
    speed: 0.002,
    texture: "./img/earth.jpg",
    glow: "718ff8",
    moons: [
      {
        name: "Moon",
        size: 2.7, // 0.27x Earth
        distance: 15,
        speed: 0.01,
        texture: "./img/moon.jpg",
      },
    ],
  },
  {
    name: "Mars",
    size: 5.3, // 0.53x Earth
    distance: 340,
    speed: 0.0015,
    texture: "./img/mars.jpg",
    glow: "C07B41",
    moons: [
      {
        name: "Phobos",
        size: 0.4,
        distance: 7,
        speed: 0.015,
        texture: "./img/phobos.png",
      },
      {
        name: "Deimos",
        size: 0.3,
        distance: 10,
        speed: 0.012,
        texture: "./img/deimos.png",
      },
    ],
  },
  {
    name: "Jupiter",
    size: 55, // 11x Earth (scaled down from 110 for visibility)
    distance: 510,
    speed: 0.0008,
    texture: "./img/jupiter.jpg",
    glow: "C07B41",
    rings: false,
    ringTexture: "./img/jupiter_ring2.png",
    innerRingSize: 10,
    outerRingSize: 10,
    ringTilt: 0.05,
    moons: [
      {
        name: "Io",
        size: 2.8,
        distance: 65,
        speed: 0.007,
        texture: "./img/io.png",
      },
      {
        name: "Europa",
        size: 2.4,
        distance: 72,
        speed: 0.006,
        texture: "./img/europa.png",
      },
      {
        name: "Ganymede",
        size: 4.1,
        distance: 80,
        speed: 0.005,
        texture: "./img/ganymede.png",
      },
      {
        name: "Callisto",
        size: 3.8,
        distance: 90,
        speed: 0.004,
        texture: "./img/callisto.png",
      },
    ],
  },
  {
    name: "Saturn",
    size: 45, // 9x Earth (scaled down from 90)
    distance: 640,
    speed: 0.0005,
    texture: "./img/saturn.jpg",
    glow: "C07B41",
    rings: true,
    ringTexture: "./img/saturn_ring.png",
    innerRingSize: 50,
    outerRingSize: 120,
    ringTilt: 0.46,
    moons: [
      {
        name: "Titan",
        size: 4.0,
        distance: 55,
        speed: 0.006,
        texture: "./img/titan.png",
      },
      {
        name: "Enceladus",
        size: 0.4,
        distance: 48,
        speed: 0.008,
        texture: "./img/enceladus.png",
      },
    ],
  },
  {
    name: "Uranus",
    size: 20, // 4x Earth
    distance: 850,
    speed: 0.0003,
    texture: "./img/uranus.jpg",
    glow: "C07B41",
    rings: true,
    ringTexture: "./img/uranus_ring.png",
    innerRingSize: 25,
    outerRingSize: 40,
    ringTilt: 1.71,
    moons: [],
  },
  {
    name: "Neptune",
    size: 19.5, // 3.9x Earth
    distance: 990,
    speed: 0.0002,
    texture: "./img/neptune.jpg",
    glow: "718ff8",
    rings: true,
    ringTexture: "./img/neptune_ring.png",
    innerRingSize: 24,
    outerRingSize: 38,
    ringTilt: 0.49,
    moons: [
      {
        name: "Triton",
        size: 2.1,
        distance: 25,
        speed: 0.007,
        texture: "./img/triton.png",
      },
    ],
  },
];

export const planetTilts = {
  Mercury: 0.0349, // 7 degrees
  Venus: 3.096, // 177 degrees (Retrograde)
  Earth: 0.4091, // 23.4 degrees
  Mars: 0.4396, // 25 degrees
  Jupiter: 0.0546, // 3 degrees
  Saturn: 0.4665, // 26.7 degrees
  Uranus: 1.706, // 98 degrees (Retrograde)
  Neptune: 0.4943, // 28.3 degrees
};

export const planetRotationSpeeds = {
  Mercury: 0.0005,
  Venus: -0.0008, // Venus rotates backwards (Retrograde)
  Earth: 0.008,
  Mars: 0.0025,
  Jupiter: 0.005,
  Saturn: 0.004,
  Uranus: -0.003, // Uranus rotates sideways (Retrograde)
  Neptune: 0.004,
};

// Constellation data
export const orionStarsData = [
  { name: "Betelgeuse", RA: 88.8, Dec: 7.4, size: 25 },
  { name: "Bellatrix", RA: 81.3, Dec: 6.3, size: 22 },
  { name: "Mintaka", RA: 78.6, Dec: -0.3, size: 20 },
  { name: "Alnilam", RA: 84.0, Dec: -1.2, size: 20 },
  { name: "Alnitak", RA: 86.1, Dec: -1.9, size: 20 },
  { name: "Saiph", RA: 86.9, Dec: -9.7, size: 22 },
  { name: "Rigel", RA: 78.6, Dec: -8.2, size: 24 },
];

export const bigDipperStarsData = [
  { name: "Dubhe", RA: 165.9, Dec: 61.7, size: 24 },
  { name: "Merak", RA: 165.5, Dec: 56.4, size: 22 },
  { name: "Phecda", RA: 174.3, Dec: 53.7, size: 10 },
  { name: "Megrez", RA: 178.4, Dec: 57.0, size: 10 },
  { name: "Alioth", RA: 193.5, Dec: 55.9, size: 12 },
  { name: "Mizar", RA: 200.9, Dec: 54.9, size: 12 },
  { name: "Alkaid", RA: 206.9, Dec: 49.3, size: 14 },
];

export const cassiopeiaStarsData = [
  { name: "Schedar", RA: 10.1, Dec: 56.5, size: 12 },
  { name: "Caph", RA: 2.3, Dec: 59.1, size: 10 },
  { name: "Gamma Cas", RA: 6.1, Dec: 60.7, size: 10 },
  { name: "Ruchbah", RA: 14.2, Dec: 59.2, size: 10 },
  { name: "Segin", RA: 18.4, Dec: 63.7, size: 10 },
];

export const pleiadesStarsData = [
  { name: "Alcyone", RA: 56.9, Dec: 24.1, size: 12 },
  { name: "Atlas", RA: 56.4, Dec: 23.8, size: 10 },
  { name: "Electra", RA: 56.2, Dec: 24.1, size: 10 },
  { name: "Maia", RA: 56.4, Dec: 24.2, size: 10 },
  { name: "Merope", RA: 56.1, Dec: 23.7, size: 10 },
  { name: "Taygeta", RA: 56.1, Dec: 24.4, size: 10 },
  { name: "Pleione", RA: 56.7, Dec: 24.1, size: 10 },
];