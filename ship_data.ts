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

async function fetchShipLocations() {
  const version = "1.0";
  const parameters = "";
  const url = `https://ais.marineplan.com/location/${version}/locations.json?${parameters}`;

  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error("Error fetching ship locations:", error);
    return [];
  }
}

async function updateShipLocations(map: any) {
  const shipLocations = await fetchShipLocations();

  for (const ship of shipLocations) {
    map.addMarker({
      lon: ship.longitude,
      lat: ship.latitude,
      color: "red",
      char: "X",
    });
  }

  screen.render();
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

// Update ship locations
updateShipLocations(map);

// Handle key events
screen.key(["escape", "q", "C-c"], () => {
  return process.exit(0);
});


// In this modified version, we have added an `axios` import to make HTTP requests to the Open Ship Data API. We have also created two new functions: `fetchShipLocations` and `updateShipLocations`.

// `fetchShipLocations` is an asynchronous function that fetches ship locations from the API using the provided version and parameters. It returns an array of ship location objects.

// `updateShipLocations` is another asynchronous function that takes a `map` parameter. It fetches the ship locations using the `fetchShipLocations` function and adds markers for each ship location on the map.

// Finally, we call the `updateShipLocations` function after rendering the screen to display the ship locations on the world map.
