const axios = require('axios');
const WebClient = require('@slack/client').WebClient;

const channel = process.env.WEATHER_CHANNEL || 'wetter';
const client = new WebClient(process.env.SLACK_TOKEN);

const getWeatherData = () => {
  return new Promise((resolve, reject) => {
    const cityId = process.env.WEATHER_CITY_ID;
    const apiKey = process.env.OPENWEATHERMAP_KEY;

    const url = `http://api.openweathermap.org/data/2.5/weather?id=${cityId}&appid=${apiKey}&units=metric`;
    axios.get(url).then(response => {
      resolve(response.data);
    }).catch(error => {
      reject(error);
    });
  });
};

const sendSlackMessage = message => {
  client.chat.postMessage(channel, message, (error) => {
    if (typeof error !== 'undefined') {
      throw error;
    }
  });
};

module.exports = {
  getWeatherData,
  sendSlackMessage
};