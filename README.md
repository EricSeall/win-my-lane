# Win My Lane - A tool for countering your lane opponent in League of Legends




## Features

<img align="right" src="https://github.com/user-attachments/assets/c679bbe6-b9a2-4aa7-9543-2551f3cc5686"  width="200"/>

Ever lost lane to a fed Yasuo because you didn't know how his passive shield works?

Ever lost lane to a fed Kled because you didn't know about his remounting mechanic?

***Lose no more!***

The application is centered around Riot Games' [Data Dragon](https://developer.riotgames.com/docs/lol#data-dragon) API, which happens to contain data for the weaknesses of most champions. 

The user begins to input a champion name and the application suggests champions that begin with those characters. Clicking on a suggestion will query that champion. Pressing the <kbd>Enter</kbd> key will query the champion at the top of the suggestion list. It is also possible to <kbd>Tab</kbd> through the list of suggestions and hit <kbd>Enter</kbd> to query for accessibility purposes.

If there is no weakness data for a given champion then the application lets you know the next best thing you can do - **Get Good.**

A simple and invaluable tool for you *(or your teammates)* to get a slight edge over your opponent going into the game!

<br>
<br>

## Development

### Dependencies

- Node.js
- NPM

### Running The Program

Install dependencies:
> `npm install`

Run Application:
> `npm run dev`
