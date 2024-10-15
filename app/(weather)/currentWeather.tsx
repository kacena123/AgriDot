import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, ImageBackground, Image, ActivityIndicator } from 'react-native';
import ClearDayIcon from '@/assets/weathericons/clear-day.svg';
import CloudyNightIcon from '@/assets/weathericons/cloudy-night.svg';
import { getWeatherIcon } from '@/utils/weatherIcons';
import { Fontisto } from '@expo/vector-icons';

// Define the interface for the weather data
interface WeatherData {
  time: Date;
  temperature2m: number;
  isDay: boolean;
  weatherCode: number;
  windSpeed10m: number;
  windDirection10m: number;
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
          isDay: currentWeather.is_day,
          weatherCode: currentWeather.weathercode ?? 0,
          windSpeed10m: currentWeather.windspeed,
          windDirection10m: currentWeather.winddirection,
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

  const WeatherIcon = getWeatherIcon(weatherData?.weatherCode ?? 0, weatherData?.isDay ?? true);

  return (
    <ScrollView style={styles.wrapper}>
      <SafeAreaView>
        <View style={styles.imageRow}>
          <ImageBackground source={require('@/assets/images/Polygon1_1.png')} style={styles.sideImage} resizeMode="contain" />
          <ImageBackground source={require('@/assets/images/Polygon2_1.png')} style={styles.sideImage} resizeMode="contain" />
        </View>
        <View style={{alignItems: 'center', marginTop: 50}}>
          {weatherData ? (
            <Text style={{ fontSize: 18, fontFamily: 'DMSans' }}>
              Today {weatherData.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>  
          ) : (
            <Text style={{ fontSize: 18, fontFamily: 'DMSans' }}>Today</Text>
          )}
          <WeatherIcon width={130} height={130} />
          {weatherData ? (
            <Text style={{ fontSize: 40, fontFamily: 'DMSans', marginTop: 50}}>
              {weatherData.temperature2m}°C
            </Text>  
          ) : (
            <Text style={{ fontSize: 35, fontFamily: 'DMSans' }}>Not available</Text>
          )}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <Fontisto name="wind" size={22} color='#FD47B7' />
            <Text style={{ fontSize: 18, fontFamily: 'DMSans', marginLeft: 10 }}>
              {weatherData?.windSpeed10m} m/s
            </Text>
          </View>
          <Text style={{ fontSize: 18, fontFamily: 'DMSans', marginTop: 200 }}>
            {weatherData?.isDay ? 'Day' : 'Night'}
          </Text>
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
    width: 140,
    height: 450,
  },
  weatherContainer: {
    padding: 20,
  },
});
