# Lair

This is a cool, retro-looking terminal dashboard that displays the latest earthquakes on a world map, reminiscent of a Bond villain's lair. The earthquakes are color-coded based on their magnitude. Why is it in TypeScript? No good reason.

![Earthquake Terminal Dashboard](./last-week-in-earthquakes.png)
*This is screenshot was taken in cool-retro-term; batteries not included.*

## Requirements

- Node.js
- TypeScript
- Blessed: A curses-like library for node.js
- Blessed-contrib: A high-level terminal interface library for node.js
- Axios: A promise-based HTTP client for the browser and node.js

## Installation



```bash
# 1. Clone this repository:
git clone https://github.com/gavmor/lair.git
cd earthquake-terminal-dashboard

# 2. Install dependencies:
yarn install

# 3. Compile TypeScript:
tsc earthquakes.ts

# 4. Run the dashboard:
node earthquakes.js
```

## Usage

The dashboard will automatically update every minute with the latest earthquake data from the USGS API. You can exit the dashboard by pressing `ESC`, `q`, or `Ctrl+C`.

## Customization

You can customize the appearance of the dashboard by modifying the `earthquakes.ts` script. For example, you can change the colors used for different magnitudes or the character used to represent earthquakes on the map.

## Event Visualizations
Perhaps:
| Category | ASCII Character |
|---|---|
| **Academic** |  ✏️ |
| **School Holidays** |  🏫 |p
| **Public Holidays** |  🏛️ |
| **Observances** |  🕯️ |
| **Politics** |  🏛️ |
| **Conferences** |  🎓 |
| **Expos** |  💡 |
| **Concerts** |  🎤 |
| **Festivals** |  🎊 |
| **Performing Arts** |  🎭 |
| **Sports** |  ⚽️ |
| **Community** |  👨‍👩‍👦‍👦 |
| **Daylight Savings** |  ☀️ |
| **Airport Delays** |  ✈️ |
| **Severe Weather** |  ⛈️ |
| **Disasters** |  💥 |
| **Terror** |  💣 |
| **Health Warnings** |  🩺 |
