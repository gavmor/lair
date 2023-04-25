import axios from "axios";


async function fetchEarthquakeData() {
  // Fetch earthquake data from the USGS API
  const response = await axios.get(
    "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
  );
  return response.data.features;
}

function rgbByMagnitude(magnitude: number): [number, number, number] {
  // Convert the magnitude to a range of 0-1.
  const normalizedMagnitude = magnitude / 10;

  // Calculate the red, green, and blue components of the color.
  const red = normalizedMagnitude * 255;
  const green = 255 - (normalizedMagnitude * 255);
  const blue = green; // Green light is too strong;
  // as green rises, so should blue
  // to temper green.

  // Return the color as an array of three numbers.
  return [red, green, blue];
}

const filterEarthquakes = (earthquake) => earthquake.properties.mag >= 4.5;

const createMarker = (earthquake) => ({
  lon: earthquake.geometry.coordinates[0],
  lat: earthquake.geometry.coordinates[1],
  color: rgbByMagnitude(earthquake.properties.mag),
  char: "*",
});


export async function addMarkers(board: any) {
  const earthquakeData = await fetchEarthquakeData();
  earthquakeData
    .filter(filterEarthquakes)
    .map(createMarker)
    .forEach(async marker => board.addMarker(marker));
}