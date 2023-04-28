# Lair

This is a cool, retro-looking terminal dashboard that displays the latest earthquakes on a world map, reminiscent of a Bond villain's lair. The earthquakes are color-coded based on their magnitude.

![Earthquake Terminal Dashboard](./last-week-in-earthquakes.png)

*This is screenshot was taken in cool-retro-term; batteries not included.*

## Usage

```bash
yarn install; yarn start
```

## Dependencies
Currently, this pulls from:
- [PredictHQ](https://docs.predicthq.com/resources/events#search-events) (for which you'll need a `$PHQ_TOKEN`) and 
- [USGS](https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php) (for which you won't).
