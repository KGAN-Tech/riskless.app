import { useEffect, useState, type JSX } from "react";
import {
  Sun,
  Cloud,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  CloudFog,
} from "lucide-react";
import { Card } from "@/components/atoms/card";

interface WeatherData {
  temperature: number;
  weatherDescription: string;
  high: number;
  low: number;
  humidity: number;
  icon: JSX.Element;
}

interface WeatherCardProps {
  longitude?: number;
  latitude?: number;
  location?: string;
}

const WeatherCard = ({
  longitude,
  latitude,
  location = "Not found",
}: WeatherCardProps) => {
  const [weather, setWeather] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      if (!latitude || !longitude) return;
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
        );

        const data = await response.json();
        const code = data.current.weather_code;

        setWeather({
          temperature: data.current.temperature_2m,
          weatherDescription: getWeatherDescription(code),
          high: data.daily.temperature_2m_max[0],
          low: data.daily.temperature_2m_min[0],
          humidity: data.current.relative_humidity_2m,
          icon: getWeatherIcon(code),
        });
      } catch (error) {
        console.error("Error fetching weather:", error);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  /** Maps weather codes to readable descriptions */
  const getWeatherDescription = (code: number) => {
    const map: Record<number, string> = {
      0: "Clear sky",
      1: "Mainly clear",
      2: "Partly cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Depositing rime fog",
      51: "Light drizzle",
      61: "Light rain",
      71: "Light snow",
      80: "Rain showers",
      95: "Thunderstorm",
    };
    return map[code] || "Unknown";
  };

  /** Maps weather codes to Lucide icons */
  const getWeatherIcon = (code: number): JSX.Element => {
    const iconClass = "w-10 h-10 flex-shrink-0 text-amber-500";
    if ([0, 1].includes(code)) return <Sun className={iconClass} />;
    if ([2, 3].includes(code)) return <Cloud className={iconClass} />;
    if ([45, 48].includes(code)) return <CloudFog className={iconClass} />;
    if ([51].includes(code)) return <CloudDrizzle className={iconClass} />;
    if ([61, 80].includes(code)) return <CloudRain className={iconClass} />;
    if ([71].includes(code)) return <CloudSnow className={iconClass} />;
    if ([95].includes(code)) return <CloudLightning className={iconClass} />;
    return <Cloud className={iconClass} />; // fallback
  };

  if (!weather)
    return (
      <Card className="p-5 border-0 rounded-3xl calm-shadow">
        <p className="text-center text-muted-foreground">Loading weather...</p>
      </Card>
    );

  return (
    <Card className="p-5 nature-gradient border-0 rounded-3xl calm-shadow">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3">
          {weather.icon}
          <div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <span className="text-4xl text-foreground font-semibold">
                {weather.temperature}°C
              </span>
              <span className="text-base text-foreground">
                {weather.weatherDescription}
              </span>
            </div>
            <p
              className="text-muted-foreground text-sm mt-1 break-words sm:truncate sm:max-w-[250px]"
              title={location}
            >
              {location}
            </p>
          </div>
        </div>

        <div className="flex sm:items-center justify-between gap-2 text-sm text-foreground space-y-1 w-full sm:w-auto">
          <div>High: {weather.high}°C</div>
          <div>Low: {weather.low}°C</div>
          <div>Humidity: {weather.humidity}%</div>
        </div>
      </div>
    </Card>
  );
};

export default WeatherCard;
