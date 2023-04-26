export type PredictHQEventSet = {
    count: number
    overflow: boolean
    next: unknown
    previous: unknown
    results: Array<PredictHQEvent>
}

export type PredictHQEvent = {
    relevance: number;
    id: string;
    parent_event?: {
        parent_event_id: string;
    };
    title: string;
    description: string;
    category: string;
    labels: string[];
    rank: number;
    local_rank: number;
    aviation_rank: number;
    phq_attendance: number;
    entities: {
        entity_id: string;
        name: string;
        type: string;
        formatted_address: string;
    }[];
    duration: number;
    start: string;
    end: string;
    updated: string;
    first_seen: string;
    timezone: string;
    location: [number, number];
    geo: {
        geometry: {
            coordinates: [number, number];
            type: string;
        };
        placekey: string;
    };
    scope: string;
    country: string;
    place_hierarchies: [[number, number], [number, number]];
    state: string;
    private: boolean;
};
