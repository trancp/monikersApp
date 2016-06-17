# Aaron's Angular Fire Boilerplate

### Introduction
This boilerplate originated from https://github.com/firebase/generator-angularfire. All unnecessary files have been removed except for the "Chat" functionality to serve as an example.

### Setup
To configure to your own Firebase config:
- Replace `FBURL` in `/app/scripts/angularfire/config.js` to your own database URL.
- Change your angular app name in `index.html` and `/app/scripts/app.js`

To run:
- Clone the repo
- Run `npm install` and `bower install`
- Run `grunt serve` to run the app in `localhost:9000`