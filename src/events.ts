import type { Widgets } from "blessed-contrib";
import type { MapMarker } from "./lib/BlessedContrib";
import type { PredictHQEvent } from "./lib/PredictHQ";
import axios, { AxiosResponse } from 'axios';

const env = process.env;
const phqToken = env.PHQ_TOKEN;

export async function getEvents(): Promise<AxiosResponse> {
    return await axios.get(
        'https://api.predicthq.com/v1/events/',
        {
            headers: {
                Authorization: `Bearer ${phqToken}`,
                Accept: 'application/json'
            },
            params: {
                category: Object.keys(charByCategory).join(","),
                rank_level: "5",
                limit: 30,
                // "active.gte": new Date().getDate() - 7,
                // "active.lte": new Date().getDate(),
            }
        }
    )
}


const createMarker = ({ location, category }: PredictHQEvent): MapMarker => ({
    lat: location[1],
    lon: location[0],
    color: category == "disasters" || category == "terror" ? [255, 0, 0] : [255, 255, 0],
    char: charByCategory[category] || console.log(category) || "?"
})


export async function getAndAddMarkers(
    mapElement: Widgets.MapElement,
    log
): Promise<Array<PredictHQEvent>> {
    const { data: {results: events}} = await getEvents();
    markEventsOnMap(events, mapElement);
}
export const charByCategory = {
    // concerts: "&",
    // "performing-arts": "%",
    // disasters: "!",
    terror: "!",
    // sports: "@",
    community: "#",
    // conferences: "#",
    // expos: "#",
}
export function markEventsOnMap(events: Array<PredictHQEvent>, mapElement: Widgets.MapElement) {
    events.map(createMarker).forEach((marker) => mapElement.addMarker(marker));
}

