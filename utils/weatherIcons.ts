import ClearDayIcon from '@/assets/weathericons/clear-day.svg';
import ClearNightIcon from '@/assets/weathericons/clear-night.svg';
import PartlyCloudyDayIcon from '@/assets/weathericons/partly-cloudy-day.svg';
import PartlyCloudyNightIcon from '@/assets/weathericons/partly-cloudy-night.svg';
import MostlyCloudyDayIcon from '@/assets/weathericons/mostly-cloudy-day.svg';
import MostlyCloudyNightIcon from '@/assets/weathericons/mostly-cloudy-night.svg';
import CloudyIcon from '@/assets/weathericons/cloudy.svg';
import FogIcon from '@/assets/weathericons/fog.svg';
import HailIcon from '@/assets/weathericons/hail.svg';
import DrizzleIcon from '@/assets/weathericons/drizzle.svg';
import FreezingDrizzleIcon from '@/assets/weathericons/freezingdrizzle.svg';
import RainIcon from '@/assets/weathericons/rain.svg';
import FreezingRainIcon from '@/assets/weathericons/freezingrain.svg';
import SleetIcon from '@/assets/weathericons/sleet.svg';
import SnowIcon from '@/assets/weathericons/snow.svg';
import ThunderstormHailIcon from '@/assets/weathericons/thunderstorm-hail.svg';
import ThunderstormIcon from '@/assets/weathericons/thunderstorm.svg';
import ThunderstormDustIcon from '@/assets/weathericons/thunderstorm-duststorm.svg';
// Import other icons...

// Weather icon mapping function
export const getWeatherIcon = (weatherCode: number, isDay: boolean): React.FC<any> => {
  switch (weatherCode) {
    case 0:
      return isDay ? ClearDayIcon : ClearNightIcon;
    case 1:
      return isDay ? PartlyCloudyDayIcon : PartlyCloudyNightIcon;
    case 2:
      return isDay ? MostlyCloudyDayIcon : MostlyCloudyNightIcon;
    case 3:
      return isDay ? CloudyIcon : CloudyIcon;
    //Fog
    case 40-49:
        return isDay ? FogIcon : FogIcon;
    //Drizzle
    case 50-52:
        return isDay ? HailIcon : HailIcon;
    case 53-55:
        return isDay ? DrizzleIcon : DrizzleIcon;
    case 56-57:
        return isDay ? FreezingDrizzleIcon : FreezingDrizzleIcon;
    case 58-59:
        return isDay ? DrizzleIcon : DrizzleIcon;
    //Rain and Snow
    case 60-65:
        return isDay ? RainIcon : RainIcon;
    case 66-67:
        return isDay ? FreezingRainIcon : FreezingRainIcon;
    case 68-69:
        return isDay ? SleetIcon : SleetIcon;
    case 70-79:
        return isDay ? SnowIcon : SnowIcon;
    case 80-82:
        return isDay ? RainIcon : RainIcon;
    case 83-84:
        return isDay ? SleetIcon : SleetIcon;
    case 85-88:
        return isDay ? SnowIcon : SnowIcon;
    //Thunderstorm
    case 89-91:
        return isDay ? ThunderstormHailIcon : ThunderstormHailIcon;
    case 92-95:
        return isDay ? ThunderstormIcon : ThunderstormIcon;
    case 96:
        return isDay ? ThunderstormHailIcon : ThunderstormHailIcon;
    case 97:
        return isDay ? ThunderstormIcon : ThunderstormIcon;
    case 98:
        return isDay ? ThunderstormDustIcon : ThunderstormDustIcon;
    case 99:
        return isDay ? ThunderstormHailIcon : ThunderstormHailIcon;
    //Default icon
    default:
      return isDay ? ClearDayIcon : ClearNightIcon; 
  }
};
