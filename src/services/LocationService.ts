import {Platform, PermissionsAndroid} from 'react-native';
import {LocationData, GymSettings} from '../types';

class LocationService {
  private static instance: LocationService;

  private constructor() {}

  public static getInstance(): LocationService {
    if (!LocationService.instance) {
      LocationService.instance = new LocationService();
    }
    return LocationService.instance;
  }

  // Request location permissions (simplified for testing)
  public async requestPermissions(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        return true; // Simplified for testing
      } else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'This app needs access to your location to verify gym attendance.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      }
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  }

  // Mock location for testing (replace with real implementation later)
  public async getCurrentLocation(accuracy: 'high' | 'balanced' | 'low' = 'balanced'): Promise<LocationData | null> {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        console.log('Location permission denied');
        return null;
      }

      // Mock location for testing - replace with real geolocation later
      return {
        latitude: 37.7749, // San Francisco coordinates as example
        longitude: -122.4194,
        accuracy: 10,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  }

  // Start watching location (simplified for testing)
  public startLocationWatch(
    callback: (location: LocationData) => void,
    accuracy: 'high' | 'balanced' | 'low' = 'balanced'
  ): void {
    // Simplified for testing - no real location watching
    console.log('Location watching started (simplified)');
  }

  // Stop watching location
  public stopLocationWatch(): void {
    console.log('Location watching stopped');
  }

  // Check if user is at home location
  public isAtHomeLocation(
    currentLocation: LocationData,
    homeLocation: {latitude: number; longitude: number; radius: number}
  ): boolean {
    const distance = this.calculateDistance(
      currentLocation.latitude,
      currentLocation.longitude,
      homeLocation.latitude,
      homeLocation.longitude
    );

    return distance <= homeLocation.radius;
  }

  // Check if user is at gym (not at home)
  public isAtGym(
    currentLocation: LocationData,
    homeLocation: {latitude: number; longitude: number; radius: number}
  ): boolean {
    return !this.isAtHomeLocation(currentLocation, homeLocation);
  }

  // Calculate distance between two coordinates using Haversine formula
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  }

  // Check if location permission is granted
  public async checkLocationPermission(): Promise<boolean> {
    try {
      if (Platform.OS === 'ios') {
        return true; // Simplified for testing
      } else {
        const granted = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        return granted;
      }
    } catch (error) {
      console.error('Error checking location permission:', error);
      return false;
    }
  }
}

export default LocationService;
