import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, FlatList } from 'react-native';
import { getWeatherIcon } from '@/utils/weatherIcons';
import { FontAwesome6 } from '@expo/vector-icons';

interface DailyData {
  time: Date;
  temperatureMax: number;
  temperatureMin: number;
  weatherCode: number;
  precipitationProbability: number;
  precipitationSum: number;
  precipitationHours: number;
  windSpeed10mMax: number;
  windGusts10mMax: number;
}

const LongtermWeather = () => {
  const [dailyForecast, setDailyForecast] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = {
          latitude: 54.149210,
          longitude: 12.191914,
          current_weather: false,
          daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_hours,precipitation_probability_max,wind_speed_10m_max,wind_gusts_10m_max,weathercode',
          timezone: 'auto',
        };

        const url = `https://api.open-meteo.com/v1/forecast?latitude=${params.latitude}&longitude=${params.longitude}&current_weather=${params.current_weather}&daily=${params.daily}&timezone=${params.timezone}`;
        const response = await fetch(url);
        const data = await response.json();

        if (!data.daily) {
          console.error('Daily forecast data is not available.');
          setLoading(false);
          return;
        }

        // Extract daily forecast data
        const dailyData: DailyData[] = data.daily.time.map((time: string, index: number) => ({
          time: new Date(time),
          temperatureMax: data.daily.temperature_2m_max[index],
          temperatureMin: data.daily.temperature_2m_min[index],
          weatherCode: data.daily.weathercode ? data.daily.weathercode[index] : 0,  // Handling missing weather code
          precipitationProbability: data.daily.precipitation_probability_max[index],
          precipitationSum: data.daily.precipitation_sum[index],
          precipitationHours: data.daily.precipitation_hours[index],
          windSpeed10mMax: data.daily.wind_speed_10m_max[index],
          windGusts10mMax: data.daily.wind_gusts_10m_max[index],
        }));

        setDailyForecast(dailyData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching weather data: ', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  const renderDailyItem = ({ item }: { item: DailyData }) => {
    const WeatherIcon = getWeatherIcon(item.weatherCode, true);

    const dayName = item.time.toLocaleDateString('en-US', { weekday: 'short' }); // E.g., "Mon"
    const formattedDate = item.time.toLocaleDateString('en-US'); // Optional: Display full date if needed

    return (
      <View style={styles.dailyItem}>
        {/* Day and date */}
        <View style={styles.timeInfo}>
          <Text style={{fontFamily: 'DMSans', fontSize: 18}}>{dayName}</Text>
          <Text style={{fontFamily: 'DMSans', fontSize: 16, marginLeft: 20}}>{formattedDate}</Text>
        </View>

        <View style={{flexDirection:"row"}}>
          {/* Weather icon */}
          <WeatherIcon width={80} height={70} />

          {/* Temperature */}
          <View style={styles.tempInfoContainer}>
            <FontAwesome6 name="temperature-three-quarters" size={40} color="black" />
            <View style={styles.tempInfo}>
              <Text style={{fontFamily: 'DMSans', fontSize: 16}}>Max: {item.temperatureMax}°C</Text>
              <Text style={{fontFamily: 'DMSans', fontSize: 16}}>Min: {item.temperatureMin}°C</Text>
            </View>
          </View>
        </View>

        {/* Precipitation */}
        <View style={styles.precipInfo}>
          <FontAwesome6 name="cloud-rain" size={20} color="black" />
          <Text style={styles.precipitationText}>
            {item.precipitationProbability}% chance of rain, {item.precipitationSum}mm in {item.precipitationHours} hours
          </Text>
        </View>

        {/* Wind */}
        <View style={styles.windInfo}>
          <FontAwesome6 name="wind" size={20} color="black" />
          <Text style={styles.windText}>
            Max wind: {item.windSpeed10mMax} m/s, Gusts: {item.windGusts10mMax} m/s
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: 'white' }}>
      <FlatList
        contentContainerStyle={{ flexGrow: 1 }}
        data={dailyForecast}
        renderItem={renderDailyItem}
        keyExtractor={(item, index) => index.toString()}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

export default LongtermWeather;

const styles = StyleSheet.create({
  dailyItem: {
    flexDirection: 'column',
    backgroundColor: 'rgba(253, 71, 183, 0.23)', // Transparent pink background
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 20,
  },
  timeInfo: {
    flexDirection: 'row',
    marginRight: 10,
    marginBottom: 10,
  },
  tempInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  tempInfo: {
    marginLeft: 7,
  },
  precipInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  precipitationText: {
    fontFamily: 'DMSans',
    fontSize: 16,
    marginLeft: 5,
  },
  windInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  windText: {
    fontFamily: 'DMSans',
    fontSize: 16,
    marginLeft: 5,
  },
});
