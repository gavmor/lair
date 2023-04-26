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
                rank_level: "5,4,3",
                "active.gte": now.getDate() - 7,
                "active.lte": new Date(now.getTime() + 86400000), // add 1 day
             }
        }
    );
}

function hashCategory(category: string): string {
    // Convert the category to a lowercase string
    const lowerCaseCategory = category.toLowerCase();
  
    // Calculate the hash of the category
    const hash = crypto.createHash('md5').update(lowerCaseCategory).digest('hex');
  
    // Convert the hash to an ASCII character
    const asciiCharacter = hash.substring(0, 1);
  
    // Return the ASCII character
    return asciiCharacter;
  }
  

const createMarker = ({ location, category, geo: {geometry: {coordinates}} }: PredictHQEvent): MapMarker => ({
    lat: coordinates[1],
    lon: coordinates[0],
    color: [255, 0, 0],
    char: hashCategory(category),
})


export async function addMarkers(mapElement: Widgets.MapElement) {
    const {data: eventSet} = await getEvents();
    const markers = eventSet.results.map(createMarker);

    // @ts-expect-error
    await Promise.all(markers.map(async marker => mapElement.addMarker(marker)));
}
// getEvents()
//     .then(({data: eventSet}) => {
//         console.log(eventSet.results.map(e => e.title && e.location))
//     })
//     .catch(console.log)
// console.log("done.")