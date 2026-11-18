import { Observer } from "./Observer.js";
import { WeatherData } from "./WeatherData.js";

export class StatisticsDisplay implements Observer {
  private temperatureSum: number = 0;
  private humiditySum: number = 0;
  private callCount: number = 0;
  private minTemperature: number = Number.MAX_SAFE_INTEGER;
  private maxTemperature: number = -Number.MAX_SAFE_INTEGER;

  public update(subject: WeatherData): void {
    this.callCount++;
    const temp = subject.getTemperature();
    const humidity = subject.getHumidity();

    this.temperatureSum += temp;
    this.humiditySum += humidity;

    if (temp < this.minTemperature) {
      this.minTemperature = temp;
    }
    if (temp > this.maxTemperature) {
      this.maxTemperature = temp;
    }

    this.display();
  }

  private display(): void {
    const avgTemperature = this.callCount > 0 ? this.temperatureSum / this.callCount : 0;
    const avgHumidity = this.callCount > 0 ? this.humiditySum / this.callCount : 0;
    console.log(`[StatisticsDisplay] Avg: ${avgTemperature.toFixed(1)}°C, ${avgHumidity.toFixed(1)}% humidity | Min: ${this.minTemperature}°C, Max: ${this.maxTemperature}°C`);
  }
}