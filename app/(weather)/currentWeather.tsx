import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, ImageBackground, Image, ActivityIndicator } from 'react-native';
import ClearDayIcon from '@/assets/weathericons/clear-day.svg';
import CloudyNightIcon from '@/assets/weathericons/cloudy-night.svg';

// Define the interface for the weather data
interface WeatherData {
  time: Date;
  temperature2m: number;
  relativeHumidity2m: number;
  apparentTemperature: number;
  isDay: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weatherCode: number;
  cloudCover: number;
  pressureMsl: number;
  surfacePressure: number;
  windSpeed10m: number;
  windDirection10m: number;
  windGusts10m: number;
}

const CurrentWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch weather data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          latitude: 48.157998, // Update this with dynamic latitude if needed
          longitude: 17.068557, // Update this with dynamic longitude if needed
          current_weather: true, // Enable current weather
          timezone: "auto", // Use auto to automatically detect timezone
        };

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${params.latitude}&longitude=${params.longitude}&current_weather=${params.current_weather}&timezone=${params.timezone}`;
        
        // Fetch weather data using fetch (React Native built-in)
        const response = await fetch(url);
        const data = await response.json();

        if (!data.current_weather) {
          console.error("Current weather data is not available.");
          return;
        }

        // Extract weather data from API response
        const currentWeather = data.current_weather;

        const weather: WeatherData = {
          time: new Date(currentWeather.time),
          temperature2m: currentWeather.temperature,
          relativeHumidity2m: currentWeather.humidity ?? 0, // API might not include humidity, fallback to 0
          apparentTemperature: currentWeather.apparent_temperature ?? currentWeather.temperature,
          isDay: currentWeather.is_day,
          precipitation: currentWeather.precipitation ?? 0,
          rain: currentWeather.rain, // Open-Meteo API might not provide detailed rain info here
          showers: 0, // Open-Meteo API might not provide this info
          snowfall: currentWeather.snowfall ?? 0,
          weatherCode: currentWeather.weathercode ?? 0,
          cloudCover: currentWeather.cloudcover ?? 0,
          pressureMsl: currentWeather.pressure_msl ?? 0,
          surfacePressure: currentWeather.surface_pressure ?? 0,
          windSpeed10m: currentWeather.windspeed,
          windDirection10m: currentWeather.winddirection,
          windGusts10m: currentWeather.windgusts ?? 0,
        };

        setWeatherData(weather);
        setLoading(false); // Loading done
      } catch (error) {
        console.error("Error fetching weather data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <ScrollView style={styles.wrapper}>
      <SafeAreaView>
        <View style={styles.imageRow}>
          <ImageBackground source={require('@/assets/images/Polygon1_1.png')} style={styles.sideImage} resizeMode="contain" />
          <ImageBackground source={require('@/assets/images/Polygon2_1.png')} style={styles.sideImage} resizeMode="contain" />
        </View>
        <View>
          <Text style={{ padding:20 }}>Current Weather</Text>
          {weatherData ? (
            <View style={styles.weatherContainer}>
              <ClearDayIcon width={200} height={200} />
              <CloudyNightIcon width={200} height={200} />
              <Text>Time: {weatherData.time.toLocaleTimeString()}</Text>
              <Text>Temperature: {weatherData.temperature2m} °C</Text>
              <Text>Humidity: {weatherData.relativeHumidity2m} %</Text>
              <Text>Apparent Temperature: {weatherData.apparentTemperature} °C</Text>
              <Text>Precipitation: {weatherData.precipitation} mm</Text>
              <Text>Cloud Cover: {weatherData.cloudCover} %</Text>
              <Text>Wind Speed: {weatherData.windSpeed10m} m/s</Text>
              <Text>Wind Direction: {weatherData.windDirection10m} °</Text>
              <Text>Wind Gusts: {weatherData.windGusts10m} m/s</Text>
              <Text>Pressure MSL: {weatherData.pressureMsl} hPa</Text>
              <Text>Surface Pressure: {weatherData.surfacePressure} hPa</Text>
              <Text>Snowfall: {weatherData.snowfall} mm</Text>
              <Text>Weather Code: {weatherData.weatherCode}</Text>
              <Text>Is Day: {weatherData.isDay ? "Yes" : "No"}</Text>
              <Text>Rain: {weatherData.rain} mm</Text>
              
            </View>
          ) : (
            <Text>No weather data available</Text>
          )}
        </View>
      </SafeAreaView>
    </ScrollView>
  );
};

export default CurrentWeather;

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: '#fff',
    flex: 1,
  },
  imageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    position: 'absolute',
  },
  sideImage: {
    width: 180,
    height: 450,
  },
  weatherContainer: {
    padding: 20,
  },
});
