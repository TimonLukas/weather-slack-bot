require('dotenv').config();
const DEBUG = process.env.DEBUG === "true";

const express = require('express');
const axios = require('axios');
const WebClient = require('@slack/client').WebClient;
const Weather = require("./Weather");

const PORT = process.env.WEATHER_PORT || 8030;
const channel = process.env.WEATHER_CHANNEL || 'wetter';

const app = express();
const client = new WebClient(process.env.SLACK_TOKEN);

app.get('/', (request, response) => {
  const cityId = process.env.WEATHER_CITY_ID;
  const apiKey = process.env.OPENWEATHERMAP_KEY;

  const url = `http://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=metric`;

  axios.get(url).then(success => {
    response.end();
    const weatherData = success.data;

    const weather = new Weather(weatherData);

    if(DEBUG !== true) {
      client.chat.postMessage(channel, weather.render(), (error) => {
        if (typeof error !== "undefined") {
          throw error;
        }
      });
    } else {
      console.log(weather.render());
    }
  }).catch(error => {
    console.error(error);
  });
});

app.listen(PORT);
