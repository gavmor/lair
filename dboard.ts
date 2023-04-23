import * as blessed from "blessed";
import * as contrib from "blessed-contrib";

export function createScreen() {
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

// Render the screen
screen.render();

// Handle key events
screen.key(["escape", "q", "C-c"], () => {
  return process.exit(0);
});

