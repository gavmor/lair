import * as blessed from "blessed";
import * as contrib from "blessed-contrib";
import { addMarkers as addQuakes } from "./quake";
import { getAndAddMarkers as addEvents, charByCategory, getEvents, markEventsOnMap, putEventsInTable } from "./events";

const ONE_MINUTE = 60 * 1000;

const createScreen = (title: string) => blessed.screen({
  smartCSR: true,
  title,
  autoPadding: true,
  dockBorders: true,
  fullUnicode: true,
});

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

  addQuakes(map).then(() => screen.render()).then(results => results.map(e => log.log(e.category)))
  
  await new Promise((resolve) => setTimeout(resolve, ONE_MINUTE));

  hydrateLoop(map, table, log, screen)
}

function main() {
  const screen = createScreen("Last Week on Earth"); // Terminal window title
  const grid = new contrib.grid({ rows: 12, cols: 12, screen })
  const map = grid.set(0, 0, 10, 8, contrib.map, { label: screen.title })
  const log = grid.set(10, 0, 2, 12, contrib.log, { label: "Log" })
  const table = grid.set(0, 8, 10, 4, contrib.table, {
    keys: true
    , fg: "white"
    , interactive: false
    , label: 'Events'
    , border: { type: "line" }
    , columnSpacing: 2 //in chars
    , columnWidth: [1, 3, 3, 35] /*in chars*/
  })

  screen.render();
  hydrateLoop(map, table, log, screen);
}

main()

