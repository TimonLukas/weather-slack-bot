require('dotenv').config();
const DEBUG = process.env.DEBUG === 'true';

const express = require('express');
const Weather = require('./Weather');
const util = require('./util');

const PORT = process.env.WEATHER_PORT || 8030;

const app = express();

const main = () => {
  util.getWeatherData().then(data => {
    const weather = new Weather(data);

    if(DEBUG !== true) {
      util.sendSlackMessage(weather.render());
    } else {
      console.log(weather.render());
    }
  });
};

if(DEBUG !== true) {
  app.get('/', (request, response) => {
    response.end();
    main();
  });

  app.listen(PORT);
} else {
  main();
}