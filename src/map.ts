import * as blessed from "blessed";
import * as contrib from "blessed-contrib";
import { addMarkers as addQuakes } from "./quake";
import { getEvents, markEventsOnMap, putEventsInTable } from "./events";

// One day?
const REFRESH_INTERVAL = 24 * 60 * 60 * 1000;

const createScreen = (title: string) => blessed.screen({
  smartCSR: true,
  title,
  autoPadding: true,
  dockBorders: true,
  fullUnicode: true,
});


function installTable(grid: contrib.grid) {
  return grid.set(0, 8, 10, 4, contrib.table, {
    keys: true,
    fg: "white",
    interactive: false,
    label: '',
    border: { type: "line" },
    columnSpacing: 2 //in chars
    ,
    columnWidth: [1, 3, 3, 35]
  });
}

function installGauge(grid: contrib.grid, screen: blessed.Widgets.Screen) {
  let n = Math.random();
  
  const gauge = grid.set(10, 0, 2, 12, contrib.gauge, {
    label: 'Refresh',
    stroke: "blue",
    fill: 'black'
  });

  gauge.setPercent(n);
  screen.render();
  setInterval(() => {
    gauge.setPercent((n += 0.01) % 1);
    screen.render();
  }, REFRESH_INTERVAL / 100)
}


async function hydrateLoop(
  map: contrib.Widgets.MapElement,
  table: contrib.Widgets.TableElement,
  log: contrib.Widgets.LogElement,
  screen: blessed.Widgets.Screen
) {
  log.log(`Updated: ${new Date().toUTCString()}`)
  getEvents()
    .then(({ data: { results: events } }) => {
      markEventsOnMap(events, map)
      putEventsInTable(table, events);
    })
    .finally(() => screen.render())

  addQuakes(map).then(() => screen.render())
  await new Promise((resolve) => setTimeout(resolve, REFRESH_INTERVAL));

  hydrateLoop(map, table, log, screen)
}

function main() {
  const screen = createScreen("Last Week on Earth"); // Terminal window title
  const grid = new contrib.grid({ rows: 12, cols: 12, screen })
  const map = grid.set(0, 0, 10, 8, contrib.map, { label: screen.title })
  const log = grid.set(10, 1, 2, 11, contrib.log, { label: "" })
  const table = installTable(grid)
  installGauge(grid, screen);

  screen.render();
  hydrateLoop(map, table, log, screen);
}

main()
