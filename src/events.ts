import { Widgets } from "blessed-contrib";
import type { MapMarker } from "./lib/BlessedContrib";
import axios, { AxiosResponse } from 'axios';
import * as crypto from "crypto";

const env = process.env;
const phqToken = env.PHQ_TOKEN;

async function getEvents(): Promise<AxiosResponse> {
    const now = new Date();
    return await axios.get(
        'https://api.predicthq.com/v1/events/',
        {
            headers: {
                Authorization: `Bearer ${phqToken}`,
                Accept: 'application/json'
            },
            params: { 
                category: Object.keys(charByCategory).join(","),
                rank_level: "5,4,3",
                "active.gte": now.getDate() - 7,
                "active.lte": new Date().getDate(),
             }
        }
    )
}


const createMarker = ({ location, category, geo: {geometry: {coordinates}} }: PredictHQEvent): MapMarker => ({
    lat: coordinates[1],
    lon: coordinates[0],
    color: category == "disasters" ? [255,0,0] : [255, 255, 0],
    char: charByCategory[category] || console.log(category) || "?"
})


export async function addMarkers(mapElement: Widgets.MapElement) {
    const {data: eventSet, request} = await getEvents();
    const markers = eventSet.results.map(createMarker);

    // @ts-expect-error
    await Promise.all(markers.map(async marker => mapElement.addMarker(marker)));
}
const charByCategory = {
    concerts: "&",
    "performing-arts": "%",
    disasters: "!",
    sports: "@",
    community: "#",
    conferences: "#",
    expos: "#"
}
