import { Subject } from "./Subject.js";
import { Observer } from "./Observer.js";

export class WeatherData implements Subject {
  private observers: Observer[] = [];
  private temperature: number = 0;
  private humidity: number = 0;
  private pressure: number = 1013;

  public attach(observer: Observer): void {
    this.observers.push(observer);
    console.log(`[WeatherData] Attached observer: ${observer.constructor.name}`);
  }

  public detach(observer: Observer): void {
    this.observers = this.observers.filter(obs => obs !== observer);
    console.log(`[WeatherData] Detached observer: ${observer.constructor.name}`);
  }

  public notify(): void {
    this.observers.forEach(observer => {
      observer.update(this);
    });
  }

  // Set measurements and notify observers
  public setMeasurements(temperature: number, humidity: number, pressure: number): void {
    this.temperature = temperature;
    this.humidity = humidity;
    this.pressure = pressure;

    console.log(`[WeatherData] Measurements updated: ${temperature}°C, ${humidity}%, ${pressure} hPa`);
    this.notify();
  }

  // Provide read-only access to state for observers
  public getTemperature(): number {
    return this.temperature;
  }

  public getHumidity(): number {
    return this.humidity;
  }

  public getPressure(): number {
    return this.pressure;
  }
}