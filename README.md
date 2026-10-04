# Pokemon-Web-App

A simple, responsive Pokemon browser built with plain HTML, CSS, and JavaScript. The project uses the [PokéAPI](https://pokeapi.co/) to load Pokemon data and displays it in a searchable, paginated grid.

## Features

- Loads Pokémon data from PokéAPI with JavaScript `fetch`
- Displays 60 Pokémon from the API
- Shows 20 Pokémon on each page
- Search Pokémon by name without making a new API request for every keystroke
- Displays:
  - Pokémon image
  - Pokémon name
  - Pokédex number
  - Type
  - Height
  - Weight
- Shows an ability sentence inside the selected card:

  > I am bulbasaur and I have overgrow.

- Uses different top-border colors for Pokémon types
- Includes simple hover effects
- Shows a loading message while API data is being retrieved
- Shows an error message if the API request fails
- Responsive layout for desktop and mobile screens
- Uses no libraries or frameworks

## Project Preview

The page includes:

1. A heading and short introduction
2. A search field
3. A Pokémon grid
4. Card details and ability buttons
5. Pagination controls

The design intentionally uses a simple layout with plain colors, readable text, and minimal decoration.

## File Structure

```text
Pokemon Web App/
├── index.html
├── style.css
├── script.js
└── README.md
```


```text
https://pokeapi.co/api/v2/pokemon?limit=60&offset=0
```
 
## Credits

Pokémon data is provided by [PokéAPI](https://pokeapi.co/).

This project is for learning and demonstration purposes and is not affiliated with or endorsed by Nintendo, Game Freak, or The Pokémon Company.

