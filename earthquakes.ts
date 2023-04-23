import * as blessed from "blessed";
import * as contrib from "blessed-contrib";
import axios from "axios";

// Helper function
function createScreen() {
  return blessed.screen({
    smartCSR: true,
    title: "blessed-contrib TypeScript World Map",
    autoPadding: true,
    dockBorders: true,
    fullUnicode: true,
  });
}

// Fetch earthquake data from the USGS API
async function fetchEarthquakeData() {
  const response = await axios.get(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
  );
  return response.data.features;
}

function randomColor() {
    return [Math.random() * 255,Math.random()*255, Math.random()*255]
  }
  

// Get color based on earthquake magnitude
function getColorByMagnitude(magnitude: number) {
  if (magnitude < 2) {
    return "blue";
  } else if (magnitude < 4) {
    return "yellow";
  } else if (magnitude < 6) {
    return "red";
  } else {
    return "red";
  }
}

// Add earthquake markers to the map
async function addEarthquakeMarkers(map: any) {
  const earthquakeData = await fetchEarthquakeData();

  for (const earthquake of earthquakeData) {
    const [longitude, latitude] = earthquake.geometry.coordinates;
    const magnitude = earthquake.properties.mag;
    const color = getColorByMagnitude(magnitude);
    map.addMarker({ lon: longitude, lat: latitude, color: color, char: "X" });
  }
}

// Create the screen
const screen = createScreen();

// Create the map element
const map = contrib.map({
  label: "Last Week in Earthquakes",
  startLon: 0,
  startLat: 0,
  width: "100%",
  height: "100%",
});

// Append the map to the screen
screen.append(map);

// Add a render loop function
async function renderLoop() {
  while (true) {
    // Add earthquake markers to the map
    await addEarthquakeMarkers(map);
    screen.render();
    await new Promise((resolve) => setTimeout(resolve, 60 * 1000)); // Update every minute
  }
}

// Start the render loop
renderLoop();

// Handle key events
screen.key(["escape", "q", "C-c"], () => {
  return process.exit(0);
});