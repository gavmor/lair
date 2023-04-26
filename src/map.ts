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

const ONE_MINUTE = 60 * 1000;

function main() {
  const screen = createScreen("Last Week on Earth"); // Terminal window title
  const map = createMap("Last Week on Earth"); // Displayed header
  screen.append(map);

  async function renderLoop() {
      addEvents(map).then(() => screen.render())
      addQuakes(map).then(() => screen.render())
      await new Promise((resolve) => setTimeout(resolve, ONE_MINUTE * 60));
    renderLoop()
  }
  
  screen.render();
  renderLoop();

  // Handle key events
  screen.key(["escape", "q", "C-c"], () => {
    return process.exit(0);
  });
}

main()
