/**
 * Premium Sample Datasets for SKYCAST Weather Application
 * Used for high-fidelity UI demonstration prior to live API integration.
 */

export const SAMPLE_CITIES_DATA = {
  'New York': {
    name: 'New York',
    country: 'United States',
    admin1: 'New York',
    current: {
      temperature: 19,
      feelsLike: 18,
      condition: 'Partly Cloudy',
      icon: 'CloudSun',
      weatherCode: 2,
      isDay: true,
      highTemp: 22,
      lowTemp: 14,
      humidity: 58,
      windSpeed: 16,
      windDirection: 240,
      windDirectionName: 'WSW',
      visibility: 10,
      visibilityStatus: 'Excellent - Clear view',
      pressure: 1016,
      pressureStatus: 'Normal (Rising)',
      uvIndex: 4.2,
      uvLevel: 'Moderate',
      sunrise: '06:34 AM',
      sunset: '05:52 PM',
      airQuality: 'Good (AQI 32)'
    },
    forecast: [
      { day: 'Today', date: 'Nov 1', weatherCode: 2, condition: 'Partly Cloudy', icon: 'CloudSun', maxTemp: 22, minTemp: 14, rainProb: 15 },
      { day: 'Mon', date: 'Nov 2', weatherCode: 61, condition: 'Light Rain', icon: 'CloudRain', maxTemp: 18, minTemp: 13, rainProb: 75 },
      { day: 'Tue', date: 'Nov 3', weatherCode: 3, condition: 'Overcast', icon: 'Cloud', maxTemp: 17, minTemp: 11, rainProb: 25 },
      { day: 'Wed', date: 'Nov 4', weatherCode: 0, condition: 'Sunny & Clear', icon: 'Sun', maxTemp: 20, minTemp: 12, rainProb: 5 },
      { day: 'Thu', date: 'Nov 5', weatherCode: 1, condition: 'Mainly Clear', icon: 'SunMedium', maxTemp: 21, minTemp: 13, rainProb: 10 }
    ]
  },

  'London': {
    name: 'London',
    country: 'United Kingdom',
    admin1: 'England',
    current: {
      temperature: 15,
      feelsLike: 14,
      condition: 'Light Drizzle',
      icon: 'CloudDrizzle',
      weatherCode: 51,
      isDay: true,
      highTemp: 17,
      lowTemp: 10,
      humidity: 82,
      windSpeed: 21,
      windDirection: 195,
      windDirectionName: 'SSW',
      visibility: 8.5,
      visibilityStatus: 'Good - Slight haze',
      pressure: 1009,
      pressureStatus: 'Low (Steady)',
      uvIndex: 2.1,
      uvLevel: 'Low',
      sunrise: '07:02 AM',
      sunset: '04:31 PM',
      airQuality: 'Moderate (AQI 45)'
    },
    forecast: [
      { day: 'Today', date: 'Nov 1', weatherCode: 51, condition: 'Light Drizzle', icon: 'CloudDrizzle', maxTemp: 17, minTemp: 10, rainProb: 80 },
      { day: 'Mon', date: 'Nov 2', weatherCode: 63, condition: 'Moderate Rain', icon: 'CloudRain', maxTemp: 15, minTemp: 9, rainProb: 90 },
      { day: 'Tue', date: 'Nov 3', weatherCode: 2, condition: 'Partly Cloudy', icon: 'CloudSun', maxTemp: 16, minTemp: 8, rainProb: 30 },
      { day: 'Wed', date: 'Nov 4', weatherCode: 1, condition: 'Mainly Clear', icon: 'SunMedium', maxTemp: 17, minTemp: 9, rainProb: 15 },
      { day: 'Thu', date: 'Nov 5', weatherCode: 45, condition: 'Morning Fog', icon: 'CloudFog', maxTemp: 14, minTemp: 7, rainProb: 20 }
    ]
  },

  'Tokyo': {
    name: 'Tokyo',
    country: 'Japan',
    admin1: 'Kanto',
    current: {
      temperature: 21,
      feelsLike: 21,
      condition: 'Clear Sky',
      icon: 'Sun',
      weatherCode: 0,
      isDay: true,
      highTemp: 23,
      lowTemp: 15,
      humidity: 48,
      windSpeed: 12,
      windDirection: 110,
      windDirectionName: 'ESE',
      visibility: 12,
      visibilityStatus: 'Crystal Clear',
      pressure: 1020,
      pressureStatus: 'High (Stable)',
      uvIndex: 5.8,
      uvLevel: 'Moderate',
      sunrise: '06:01 AM',
      sunset: '04:47 PM',
      airQuality: 'Excellent (AQI 18)'
    },
    forecast: [
      { day: 'Today', date: 'Nov 1', weatherCode: 0, condition: 'Clear Sky', icon: 'Sun', maxTemp: 23, minTemp: 15, rainProb: 0 },
      { day: 'Mon', date: 'Nov 2', weatherCode: 1, condition: 'Mainly Sunny', icon: 'SunMedium', maxTemp: 22, minTemp: 14, rainProb: 5 },
      { day: 'Tue', date: 'Nov 3', weatherCode: 2, condition: 'Partly Cloudy', icon: 'CloudSun', maxTemp: 20, minTemp: 13, rainProb: 20 },
      { day: 'Wed', date: 'Nov 4', weatherCode: 61, condition: 'Slight Showers', icon: 'CloudRain', maxTemp: 19, minTemp: 14, rainProb: 65 },
      { day: 'Thu', date: 'Nov 5', weatherCode: 0, condition: 'Clear Sky', icon: 'Sun', maxTemp: 21, minTemp: 13, rainProb: 10 }
    ]
  },

  'Paris': {
    name: 'Paris',
    country: 'France',
    admin1: 'Île-de-France',
    current: {
      temperature: 16,
      feelsLike: 15,
      condition: 'Partly Cloudy',
      icon: 'CloudSun',
      weatherCode: 2,
      isDay: true,
      highTemp: 18,
      lowTemp: 11,
      humidity: 64,
      windSpeed: 14,
      windDirection: 270,
      windDirectionName: 'W',
      visibility: 9.8,
      visibilityStatus: 'Very Good',
      pressure: 1015,
      pressureStatus: 'Normal (Stable)',
      uvIndex: 3.2,
      uvLevel: 'Moderate',
      sunrise: '07:35 AM',
      sunset: '05:32 PM',
      airQuality: 'Good (AQI 29)'
    },
    forecast: [
      { day: 'Today', date: 'Nov 1', weatherCode: 2, condition: 'Partly Cloudy', icon: 'CloudSun', maxTemp: 18, minTemp: 11, rainProb: 20 },
      { day: 'Mon', date: 'Nov 2', weatherCode: 3, condition: 'Overcast', icon: 'Cloud', maxTemp: 16, minTemp: 10, rainProb: 40 },
      { day: 'Tue', date: 'Nov 3', weatherCode: 61, condition: 'Gentle Rain', icon: 'CloudRain', maxTemp: 15, minTemp: 9, rainProb: 70 },
      { day: 'Wed', date: 'Nov 4', weatherCode: 1, condition: 'Passing Clouds', icon: 'SunMedium', maxTemp: 17, minTemp: 8, rainProb: 15 },
      { day: 'Thu', date: 'Nov 5', weatherCode: 0, condition: 'Sunny Spells', icon: 'Sun', maxTemp: 18, minTemp: 10, rainProb: 10 }
    ]
  },

  'Sydney': {
    name: 'Sydney',
    country: 'Australia',
    admin1: 'New South Wales',
    current: {
      temperature: 25,
      feelsLike: 26,
      condition: 'Sunny & Warm',
      icon: 'Sun',
      weatherCode: 0,
      isDay: true,
      highTemp: 28,
      lowTemp: 18,
      humidity: 52,
      windSpeed: 19,
      windDirection: 60,
      windDirectionName: 'ENE',
      visibility: 15,
      visibilityStatus: 'Outstanding',
      pressure: 1018,
      pressureStatus: 'High (Stable)',
      uvIndex: 8.4,
      uvLevel: 'Very High',
      sunrise: '05:58 AM',
      sunset: '07:22 PM',
      airQuality: 'Excellent (AQI 15)'
    },
    forecast: [
      { day: 'Today', date: 'Nov 1', weatherCode: 0, condition: 'Sunny & Warm', icon: 'Sun', maxTemp: 28, minTemp: 18, rainProb: 0 },
      { day: 'Mon', date: 'Nov 2', weatherCode: 1, condition: 'Fine & Mild', icon: 'SunMedium', maxTemp: 27, minTemp: 19, rainProb: 5 },
      { day: 'Tue', date: 'Nov 3', weatherCode: 2, condition: 'Partly Cloudy', icon: 'CloudSun', maxTemp: 26, minTemp: 18, rainProb: 15 },
      { day: 'Wed', date: 'Nov 4', weatherCode: 95, condition: 'Afternoon Storm', icon: 'CloudLightning', maxTemp: 29, minTemp: 17, rainProb: 60 },
      { day: 'Thu', date: 'Nov 5', weatherCode: 0, condition: 'Bright & Fresh', icon: 'Sun', maxTemp: 24, minTemp: 16, rainProb: 10 }
    ]
  },

  'Dubai': {
    name: 'Dubai',
    country: 'United Arab Emirates',
    admin1: 'Dubai',
    current: {
      temperature: 32,
      feelsLike: 35,
      condition: 'Sunny & Clear',
      icon: 'Sun',
      weatherCode: 0,
      isDay: true,
      highTemp: 34,
      lowTemp: 24,
      humidity: 42,
      windSpeed: 15,
      windDirection: 310,
      windDirectionName: 'NW',
      visibility: 10,
      visibilityStatus: 'Good',
      pressure: 1013,
      pressureStatus: 'Normal',
      uvIndex: 7.9,
      uvLevel: 'Very High',
      sunrise: '06:29 AM',
      sunset: '05:39 PM',
      airQuality: 'Moderate (AQI 55)'
    },
    forecast: [
      { day: 'Today', date: 'Nov 1', weatherCode: 0, condition: 'Sunny & Clear', icon: 'Sun', maxTemp: 34, minTemp: 24, rainProb: 0 },
      { day: 'Mon', date: 'Nov 2', weatherCode: 0, condition: 'Sunny', icon: 'Sun', maxTemp: 33, minTemp: 23, rainProb: 0 },
      { day: 'Tue', date: 'Nov 3', weatherCode: 1, condition: 'Hazy Sun', icon: 'SunMedium', maxTemp: 33, minTemp: 24, rainProb: 0 },
      { day: 'Wed', date: 'Nov 4', weatherCode: 0, condition: 'Clear', icon: 'Sun', maxTemp: 34, minTemp: 23, rainProb: 0 },
      { day: 'Thu', date: 'Nov 5', weatherCode: 2, condition: 'Some Clouds', icon: 'CloudSun', maxTemp: 32, minTemp: 22, rainProb: 5 }
    ]
  }
};

export const POPULAR_CITIES = [
  { name: 'New York', country: 'United States', region: 'North America' },
  { name: 'London', country: 'United Kingdom', region: 'Europe' },
  { name: 'Tokyo', country: 'Japan', region: 'Asia' },
  { name: 'Paris', country: 'France', region: 'Europe' },
  { name: 'Sydney', country: 'Australia', region: 'Oceania' },
  { name: 'Dubai', country: 'United Arab Emirates', region: 'Middle East' }
];

