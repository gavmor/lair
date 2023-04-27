import * as blessed from "blessed";
import * as contrib from "blessed-contrib";
import { addMarkers as addQuakes } from "./quake";
import { getAndAddMarkers as addEvents, charByCategory, getEvents, markEventsOnMap } from "./events";
import { PredictHQEvent } from "./lib/PredictHQ";

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

function romanize(num) {
  var lookup = { M: 1000, CM: 900, D: 500, CD: 400, C: 100, XC: 90, L: 50, XL: 40, X: 10, IX: 9, V: 5, IV: 4, I: 1 }, roman = '', i;
  for (i in lookup) {
    while (num >= lookup[i]) {
      roman += i;
      num -= lookup[i];
    }
  }
  return roman;
}

async function hydrateLoop(
  map: contrib.Widgets.MapElement,
  table: contrib.Widgets.TableElement,
  log: contrib.Widgets.LogElement,
  screen: blessed.Widgets.Screen
) {
  getEvents()
    .then(({ data: { results: events } }) => {
      markEventsOnMap(events, map)
      table.setData(
        {
          headers: ['', 'Day', 'Loc', 'Title']
          , data: events.map((e: PredictHQEvent) => [
            charByCategory[e.category],
            new Date(e.start).toDateString().slice(0, 3),
            e.country,
            e.title,
          ])

        })
    })
    .finally(() => screen.render())
  // .then(({data: {results: events}}) => events.forEach(({location}) => log.log(location[0].toString())))

  // addEvents(map, log).then(() => screen.render())
  addQuakes(map).then(() => screen.render()).then(results => results.map(e => log.log(e.category)))
  await new Promise((resolve) => setTimeout(resolve, ONE_MINUTE * 60));

  hydrateLoop(map, table, log, screen)
}


function main() {
  const screen = createScreen("Last Week on Earth"); // Terminal window title
  var grid = new contrib.grid({ rows: 12, cols: 12, screen })
  var map = grid.set(0, 0, 10, 8, contrib.map, { label: screen.title })
  var log = grid.set(10, 0, 2, 12, contrib.log, { label: "Log" })
  const table = grid.set(0, 8, 10, 4, contrib.table, {
    keys: true
    , fg: "white"
    , interactive: false
    , label: 'Events'
    , border: { type: "line" }
    , columnSpacing: 2 //in chars
    , columnWidth: [1, 3, 3, 35] /*in chars*/
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

