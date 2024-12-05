import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, ImageBackground, ActivityIndicator, FlatList } from 'react-native';
import { getWeatherIcon } from '@/utils/weatherIcons';
import { Fontisto } from '@expo/vector-icons';

interface WeatherData {
  time: Date;
  temperature2m: number;
  isDay: boolean;
  weatherCode: number;
  windSpeed10m: number;
  windDirection10m: number;
}

interface HourlyData {
  time: Date;
  temperature2m: number;
  weatherCode: number;
  isDay: boolean;
}

const CurrentWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [hourlyForecast, setHourlyForecast] = useState<HourlyData[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch weather data when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          latitude: 48.157998,
          longitude: 17.068557,
          current_weather: true,
          hourly: 'temperature_2m,weather_code,is_day',
          timezone: "auto",
        };

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${params.latitude}&longitude=${params.longitude}&current_weather=${params.current_weather}&hourly=${params.hourly}&timezone=${params.timezone}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (!data.current_weather || !data.hourly) {
          console.error("Current or hourly weather data is not available.");
          setLoading(false);
          return;
        }

        // Extract current weather
        const currentWeather = data.current_weather;
        const weather: WeatherData = {
          time: new Date(currentWeather.time),
          temperature2m: currentWeather.temperature,
          isDay: currentWeather.is_day,
          weatherCode: currentWeather.weathercode ?? 0,
          windSpeed10m: currentWeather.windspeed,
          windDirection10m: currentWeather.winddirection,
        };

        // Extract hourly forecast data (next 12 hours)
        const hourlyData: HourlyData[] = data.hourly.time.slice(0, 12).map((time: string, index: number) => ({
          time: new Date(time),
          temperature2m: data.hourly.temperature_2m[index],
          weatherCode: data.hourly.weather_code[index],
          isDay: data.hourly.is_day[index],
        }));

        setWeatherData(weather);
        setHourlyForecast(hourlyData);
        setLoading(false);
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

  const renderHourlyItem = ({ item }: { item: HourlyData }) => {
    const HourlyIcon = getWeatherIcon(item.weatherCode, item.isDay);
    return (
      <View style={styles.hourlyItem}>
        <HourlyIcon width={70} height={60} />
        <Text style={styles.hourlyTime}>{item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
        <Text style={styles.hourlyTemp}>{item.temperature2m}°C</Text>
      </View>
    );
  };

  return (
    <ScrollView style={styles.wrapper}>
      <SafeAreaView>
        {/* Background images */}
        <View style={styles.imageRow}>
          <ImageBackground source={require('@/assets/images/Polygon1_1.png')} style={styles.sideImage} resizeMode="contain" />
          <ImageBackground source={require('@/assets/images/Polygon2_1.png')} style={styles.sideImage} resizeMode="contain" />
        </View>
        <View style={{alignItems: 'center', marginTop: 50}}>
          {/* Time */}
          {weatherData ? (
            <Text style={{ fontSize: 18, fontFamily: 'DMSans' }}>
              Today {weatherData.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>  
          ) : (
            <Text style={{ fontSize: 18, fontFamily: 'DMSans' }}>Today</Text>
          )}
          {/* Icon for current weather */}
          <WeatherIcon width={130} height={130} />
          {/* Temperature */}
          {weatherData ? (
            <Text style={{ fontSize: 40, fontFamily: 'DMSans', marginTop: 50}}>
              {weatherData.temperature2m}°C
            </Text>  
          ) : (
            <Text style={{ fontSize: 35, fontFamily: 'DMSans' }}>Not available</Text>
          )}
          {/* Wind information */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
            <Fontisto name="wind" size={22} color='#4F8CAE' />
            <Text style={{ fontSize: 18, fontFamily: 'DMSans', marginLeft: 10 }}>
              {weatherData?.windSpeed10m} m/s
            </Text>
          </View>
        </View>
        {/* Horizontal FlatList for 12-hour forecast */}
        <View style={{marginTop: 50}}>
        <FlatList
          data={hourlyForecast}
          renderItem={renderHourlyItem}
          keyExtractor={(item, index) => index.toString()}
          horizontal
          style={styles.hourlyList}
          showsHorizontalScrollIndicator={false}
        />
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
  hourlyList: {
    marginTop: 20,
    marginBottom: 50,
    
  },
  hourlyItem: {
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: 'rgba(253, 71, 183, 0.23)',
    padding: 10,
    borderRadius: 20, 
  },
  hourlyTime: {
    fontSize: 15,
    fontFamily: 'DMSans',
    marginBottom: 5,
  },
  hourlyTemp: {
    fontSize: 22,
    fontFamily: 'DMSans',
    marginTop: 5,
  },
});
