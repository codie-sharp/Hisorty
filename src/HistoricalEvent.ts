export type EventDate = {
    event: string;
    date: string;
}

export type HistoricalEvent = {
    dates: EventDate[];
    title: string;
    summary: string;
    image: string;
    wikiUrl: string;
}