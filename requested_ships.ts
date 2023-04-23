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

async function getShipData() {
    // Replace with your API key and desired parameters
    const apiKey = "";
    //   const area = "52.5,4.80180;52.61,4.92";
    const area = ""
    const maxage = 1800;
    const moving = 1;
    const source = "TEST";

    const response = await axios.get(
        `https://ais.marineplan.com/location/2/locations.json?version=2&area=${area}&maxage=${maxage}&moving=${moving}&source=${source}`
    );

    return response.data;
}

async function main() {
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

    // Fetch ship data
    const shipData = await getShipData();

    // Add ship markers to the map
    for (const report of shipData.reports) {
        const { latitude, longitude } = report.point;
        map.addMarker({ lon: longitude, lat: latitude, color: "red", char: "X" });
    }

    // Render the screen
    screen.render();

    // Handle key events
    screen.key(["escape", "q", "C-c"], () => {
        return process.exit(0);
    });
}

main();