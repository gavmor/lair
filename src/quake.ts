import axios from "axios";
import type { Widgets } from "blessed-contrib";
import { MapMarker } from "./lib/BlessedContrib";
import { oneHourAgo } from "./lib/time";

const USGS_URL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

async function fetchEarthquakeData() {
  const response = await axios.get(USGS_URL,
    {
      headers: {
        "If-Modified-Since": oneHourAgo().toUTCString()
      }
    }
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

const significant = (earthquake) => earthquake.properties.mag >= 4.5;

const createMarker = (quake): MapMarker => ({
  lon: quake.geometry.coordinates[0],
  lat: quake.geometry.coordinates[1],
  color: rgbByMagnitude(quake.properties.mag),
  char: "~",
});


export async function addMarkers(mapElement: Widgets.MapElement) {
  const earthquakeData = await fetchEarthquakeData();
  earthquakeData
    .filter(significant)
    .map(createMarker) // @ts-expect-error
    .forEach(async marker => mapElement.addMarker(marker));
}