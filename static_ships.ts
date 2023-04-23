import * as blessed from "blessed";
import * as contrib from "blessed-contrib";

// Sample Open Ship Data API
const shipData = {
  reports: [
    // ... (copy the sample data provided above)
  ],
};

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

// Create the screen
const screen = createScreen();

// Create the map element
const map = contrib.map({
  label: "World Map",
  startLon: 0,
  startLat: 0,
  width: "100%",
  height: "100%",
});

// Append the map to the screen
screen.append(map);

// Add ship markers to the map
for (const report of shipData.reports) {
  const { latitude, longitude } = report.point;
  map.addMarker({lon: longitude, lat: latitude, color: "red", char: "X"});
}

// Render the screen
screen.render();

// Handle key events
screen.key(["escape", "q", "C-c"], () => {
  return process.exit(0);
});