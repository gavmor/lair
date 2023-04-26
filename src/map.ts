import * as blessed from "blessed";
import * as contrib from "blessed-contrib";
import { addMarkers as addQuakes } from "./quake";
import { addMarkers as addEvents, getEvents } from "./events";

const ONE_MINUTE = 60 * 1000;
const GOLDEN = (1 + Math.sqrt(5)) / 2
let log;

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
  width: "66%",
  height: "100%",
});

async function hydrateLoop(
  map: contrib.Widgets.MapElement,
  table: contrib.Widgets.TableElement,
  log: contrib.Widgets.LogElement,
  screen: blessed.Widgets.Screen
) {
  log.log("test")
  getEvents().then(({data: {results: events}}) => events.forEach(({category}) => log.log(category)))
  addEvents(map, log).then(() => screen.render())
  addQuakes(map).then(() => screen.render()).then(results => results.map(e => log.log(e.category)))
  await new Promise((resolve) => setTimeout(resolve, ONE_MINUTE * 60));

  hydrateLoop(map, table, log, screen)
}


function main() {
  const screen = createScreen("Last Week on Earth"); // Terminal window title
  var grid = new contrib.grid({ rows: 12, cols: 12, screen })
  var map = grid.set(0, 0, 10, 10, contrib.map, { label: screen.title })
  var log = grid.set(10, 0, 2, 12, contrib.log, { label: "Log" })
  const table = grid.set(0, 10, 10, 2, contrib.table, {
    keys: true
    , interactive: false
    , label: 'Events'
    , border: { type: "line" }
    , columnSpacing: 4 //in chars
    , columnWidth: [3, 3, 3] /*in chars*/
  })

  table.setData(
    {
      headers: ['col1', 'col2', 'col3']
      , data:
        [[1, 2, 3]
          , [4, 5, 6]]
    })

  // screen.append(map);
  // screen.append(log)
  screen.render();
  hydrateLoop(map, table, log, screen);


  // Handle key events
  screen.key(["escape", "q", "C-c"], () => {
    return process.exit(0);
  });
}

main()

