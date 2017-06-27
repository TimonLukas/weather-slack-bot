const attributes = require('./attributes.json');

module.exports = class Weather {
  constructor (data) {
    this.temperature = {
      current: data.main.temp,
      min: data.main.temp_min,
      max: data.main.temp_max
    };

    this.humidity = data.main.humidity;
    this.clouds = data.clouds.all;
  }

  areConditionsMatching (cases, value) {
    const isConditionMatching = (operator, compare, value) => {
      switch (operator) {
        case '>':
          return value > compare;
        case '>=':
          return value >= compare;
        case '<':
          return value < compare;
        case '<=':
          return value <= compare;
        case '=':
          return value === compare;
      }
    };

    const wrap = (operator, compare, value) => {
      if (!isConditionMatching(operator, compare, value)) {
        return 'asdf';
      }
    };

    const result = cases.filter(temperatureCase => wrap(temperatureCase.condition, temperatureCase.value, value));
    return result.length === 0;
  }

  getAttributeForTemperature (temperature) {
    const result = attributes.temperature.filter(temperatureCase => {
      return this.areConditionsMatching(temperatureCase.conditions, temperature);
    });

    return result[0].attributes[Math.floor(Math.random() * result[0].attributes.length)];
  }

  render () {
    const temperatureAttribute = this.getAttributeForTemperature(this.temperature.current);
    const clouds = this.clouds === 0 ? "Der Himmel ist klar!" : `Es gibt ${this.clouds}% Wolkenbedeckung.`;
    return `Die Temperatur beträgt ${temperatureAttribute} ${this.temperature.current}°C (:arrow_up: ${this.temperature.max}, :arrow_down: ${this.temperature.min}).
Die Luftfeuchtigkeit liegt bei ${this.humidity}%. ${clouds}`;
  }
};