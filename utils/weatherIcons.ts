import ClearDayIcon from '@/assets/weathericons/clear-day.svg';
import ClearNightIcon from '@/assets/weathericons/clear-night.svg';
import PartlyCloudyDayIcon from '@/assets/weathericons/partly-cloudy-day.svg';
import PartlyCloudyNightIcon from '@/assets/weathericons/partly-cloudy-night.svg';
// Import other icons...

// Weather icon mapping function
export const getWeatherIcon = (weatherCode: number, isDay: boolean): React.FC<any> => {
  switch (weatherCode) {
    case 0:
      return isDay ? ClearDayIcon : ClearNightIcon;
    case 1:
    case 2:
    case 3:
      return isDay ? PartlyCloudyDayIcon : PartlyCloudyNightIcon;
    // Add more cases for other weather codes
    default:
      return isDay ? ClearDayIcon : ClearNightIcon; // Default icon
  }
};
