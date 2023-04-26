import * as blessed from "blessed";
import * as contrib from "blessed-contrib";
import { addMarkers as addQuakes } from "./quake";
import { addMarkers as addEvents } from "./events";


const createScreen = (title: string) => blessed.screen({
  smartCSR: true,
  title,
  autoPadding: true,
  dockBorders: true,
  fullUnicode: true,
});

const createMap = (label: string) => contrib.map({
  label,
  startLon: 0,
  startLat: 0,
  width: "100%",
  height: "100%",
});

const MINUTE_IN_MILLISECONDS = 60 * 1000;

function main() {
  const screen = createScreen("Last Week on Earth"); // Terminal window title
  const map = createMap("Last Week on Earth"); // Displayed header
  screen.append(map);

  async function renderLoop() {
    while (true) {
      screen.render();
      await addEvents(map)
      // await addQuakes(map);
      screen.render();
      await new Promise((resolve) => setTimeout(resolve, MINUTE_IN_MILLISECONDS)); // Update every minute
    }
  }

  renderLoop();

  // Handle key events
  screen.key(["escape", "q", "C-c"], () => {
    return process.exit(0);
  });
}

main()
