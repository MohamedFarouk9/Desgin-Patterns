import { Observer } from "./Observer.js";
import { WeatherData } from "./WeatherData.js";

export class CurrentConditionsDisplay implements Observer {
  private temperature: number = 0;
  private humidity: number = 0;

  public update(subject: WeatherData): void {
    this.temperature = subject.getTemperature();
    this.humidity = subject.getHumidity();
    this.display();
  }

  private display(): void {
    console.log(`[CurrentConditionsDisplay] Current conditions: ${this.temperature}°C, ${this.humidity}% humidity`);
  }
}