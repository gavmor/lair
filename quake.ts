import axios from "axios";

// Fetch earthquake data from the USGS API

async function fetchEarthquakeData() {
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

function charByDepth(depth: number, maxDepth: number): string {
  const normalizedDepth = Math.min(1, depth / maxDepth);
  return `${' .,-_+*'[normalizedDepth * 5]}`;
}



// Add earthquake markers to the map
export async function addMarkers(map: any) {
  const earthquakeData = await fetchEarthquakeData();

  for (const earthquake of earthquakeData) {
    const [longitude, latitude, depth] = earthquake.geometry.coordinates;
    const time = earthquake.properties.time
    const magnitude = earthquake.properties.mag;
    const color = rgbByMagnitude(magnitude);
    // charByDepth(depth)
    map.addMarker({ lon: longitude, lat: latitude, color: color, char: charByDepth(depth) });
  }
}
