import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, ImageBackground, ActivityIndicator, FlatList } from 'react-native';
import { getWeatherIcon } from '@/utils/weatherIcons';
import { FontAwesome6 } from '@expo/vector-icons';
import { LocationContext } from '@/context/LocationContext';
import * as Location from 'expo-location';


interface HourlyData {
  time: Date;
  temperature2m: number;
  weatherCode: number;
  isDay: boolean;
  cloudCover: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  windSpeed10m: number;
}

const HourlyWeather = () => {
  const [hourlyForecast, setHourlyForecast] = useState<HourlyData[]>([]);
  const [loading, setLoading] = useState(true);
  const { coordinates } = React.useContext(LocationContext);
  const [currentLatitude, setLatitude] = useState<string>('');
  const [currentLongitude, setLongitude] = useState<string>('');

  // Function to get user's current location
  const useMyLocation = async () => {
    // Request permission to access location
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      alert('Permission to access location was denied');
      return;
    }
    // Get current location
    let location = await Location.getCurrentPositionAsync({});
    setLatitude(location.coords.latitude.toString());
    setLongitude(location.coords.longitude.toString());
  };

  // Fetch hourly weather data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        let params;
        if (!coordinates) {
          await useMyLocation();
          if (!currentLatitude || !currentLongitude) {
            return;
          }
          params = {
            latitude: currentLatitude,
            longitude: currentLongitude,
            current_weather: false,
            hourly: 'temperature_2m,weather_code,is_day,cloudcover,precipitation,rain,showers,snowfall,windspeed_10m',
            timezone: "auto",
          };
          console.log(params);
        } else {
          const [latitude, longitude] = coordinates.split(' ').map(Number);
          params = {
            latitude,
            longitude,
            current_weather: false,
            hourly: 'temperature_2m,weather_code,is_day,cloudcover,precipitation,rain,showers,snowfall,windspeed_10m',
            timezone: "auto",
          };
        }

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${params.latitude}&longitude=${params.longitude}&current_weather=${params.current_weather}&hourly=${params.hourly}&timezone=${params.timezone}`;
        
        const response = await fetch(url);
        const data = await response.json();

        if (!data.hourly) {
          console.error("Current or hourly weather data is not available.");
          setLoading(false);
          return;
        }

        const currentHourIndex = new Date().getHours();
        // Extract hourly forecast data (next 12 hours)
        const hourlyData: HourlyData[] = data.hourly.time.slice(currentHourIndex, currentHourIndex + 32).map((time: string, index: number) => ({
          time: new Date(time),
          temperature2m: data.hourly.temperature_2m[index],
          weatherCode: data.hourly.weather_code[index],
          isDay: data.hourly.is_day[index],
          cloudCover: data.hourly.cloudcover[index],
          precipitation: data.hourly.precipitation[index],
          rain: data.hourly.rain[index],
          showers: data.hourly.showers[index],
          snowfall: data.hourly.snowfall[index],
          windSpeed10m: data.hourly.windspeed_10m[index],
        }));

        setHourlyForecast(hourlyData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching weather data: ", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [coordinates, currentLatitude, currentLongitude]);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderHourlyItem = ({ item }: { item: HourlyData }) => {
    const HourlyIcon = getWeatherIcon(item.weatherCode, item.isDay);
    const dayName = item.time.toLocaleDateString('en-US', { weekday: 'short' }).charAt(0).toUpperCase() + item.time.toLocaleDateString('en-EN', { weekday: 'short' }).slice(1);
    const timeString = item.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const renderPrecipitation = () => {
      if (item.snowfall !== 0) {
        return (
          <View style={styles.infoRow}>
            <View style={{width: 28, alignItems: 'center'}}>
            <FontAwesome6 name="snowflake" size={22} color="black" />
            </View>
            <Text style={styles.infoText}>{item.snowfall} mm</Text>
          </View>
        );
      } else if (item.precipitation !== 0) {
        return (
          <View style={styles.infoRow}>
            <View style={{width: 28, alignItems: 'center'}}>
              <FontAwesome6 name="droplet" size={22} color="black" />
            </View>
            <Text style={styles.infoText}>{item.precipitation} mm</Text>
          </View>
        );
      } else if (item.rain !== 0) {
        return (
          <View style={styles.infoRow}>
            <View style={{width: 28, alignItems: 'center'}}>
              <FontAwesome6  name="droplet" size={22} color="black" />
            </View>
            <Text style={styles.infoText}>{item.rain} mm</Text>
          </View>
        );
      } else if (item.showers !== 0) {
        return (
          <View style={styles.infoRow}>
            <View style={{width: 28, alignItems: 'center'}}>
              <FontAwesome6 name="droplet" size={22} color="black" />
            </View>
            <Text style={styles.infoText}>{item.showers} mm</Text>
          </View>
        );
      } else {
        return (
          <View style={styles.infoRow}>
            <View style={{width: 30, alignItems: 'center'}}>
              <FontAwesome6 name="droplet" size={22} color="black" />
            </View>
            <Text style={styles.infoText}>0 mm</Text>
          </View>
        );
      }
    };

    return (
      <View style={styles.hourlyItem}>
        <View style={{ flexDirection: 'column', alignItems: 'center', marginRight: 7 }}>
          <Text style={{fontFamily: 'DMSans', fontSize: 16}}>{dayName}</Text>
          <Text style={{fontFamily: 'DMSans', fontSize: 16}}>{timeString}</Text>
        </View>

        <HourlyIcon style={{marginRight: 7}} width={80} height={70} />

        <View style={{alignItems: 'center', width: 70}}>
          <Text style={{fontFamily: 'DMSans', fontSize:22}}>{item.temperature2m}°C</Text>
        </View>

        <View style={{flexDirection: 'column', alignItems: 'center', marginLeft: 7}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <FontAwesome6 style={{width: 28}} name="cloud" size={22} color="black" />
            <Text style={styles.infoText}>{item.cloudCover} %</Text>
          </View>
          {renderPrecipitation()}
        </View>
      </View>
    );
  };

  return (
    <View style={{backgroundColor: 'white'}}>
      <FlatList
          contentContainerStyle={{ flexGrow: 1 }}
          data={hourlyForecast}
          renderItem={renderHourlyItem}
          keyExtractor={(item, index) => index.toString()}
          showsHorizontalScrollIndicator={false}
        />
    </View>
  )
}

export default HourlyWeather

const styles = StyleSheet.create({
  hourlyItem: {
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(253, 71, 183, 0.23)', // Transparent pink background
    padding: 15,
    marginVertical: 8, 
    marginHorizontal: 16, 
    borderRadius: 20, 
  },
  timeInfo: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 10,
  },
  dayText: {
    fontFamily: 'DMSans',
    fontSize: 16,
  },
  timeText: {
    fontFamily: 'DMSans',
    fontSize: 16,
  },
  weatherIcon: {
    marginRight: 15,
  },
  temperatureContainer: {
    alignItems: 'center',
    width: 60,
  },
  temperatureText: {
    fontFamily: 'DMSans',
    fontSize: 24,
  },
  cloudInfo: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: 15,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  infoText: {
    fontFamily: 'DMSans',
    fontSize: 16,
    marginLeft: 8,
  },
})