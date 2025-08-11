import { useState, useEffect, useRef } from 'react';
import * as Location from 'expo-location';
import { Platform } from 'react-native';
import { LocationData, TrackingState } from '@/types/tracking';
import { ApiService } from '@/services/api';

const TRACKING_INTERVAL = 30000; // 30 seconds

export function useLocationTracking() {
  const [trackingState, setTrackingState] = useState<TrackingState>({
    isTracking: false,
    lastApiCall: null,
    lastLocation: null,
    apiCallCount: 0,
    connectionStatus: 'disconnected', // Added connection status
  });

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const locationSubscriptionRef = useRef<Location.LocationSubscription | null>(
    null
  );

  // Monitor WebSocket connection status
  useEffect(() => {
    const checkConnectionStatus = () => {
      const status = ApiService.getConnectionStatus();
      setTrackingState((prev) => ({
        ...prev,
        connectionStatus: status,
      }));
    };

    // Check initial status
    checkConnectionStatus();

    // Set up periodic status checks while tracking
    let statusInterval: NodeJS.Timeout | null = null;
    if (trackingState.isTracking) {
      statusInterval = setInterval(checkConnectionStatus, 5000); // Check every 5 seconds
    }

    return () => {
      if (statusInterval) {
        clearInterval(statusInterval);
      }
    };
  }, [trackingState.isTracking]);

  const requestLocationPermissions = async (): Promise<boolean> => {
    try {
      if (Platform.OS === 'web') {
        // For web, use browser geolocation API
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            () => resolve(true),
            () => resolve(false)
          );
        });
      }

      const { status: foregroundStatus } =
        await Location.requestForegroundPermissionsAsync();

      if (foregroundStatus !== 'granted') {
        console.log('Foreground location permission denied');
        return false;
      }

      const { status: backgroundStatus } =
        await Location.requestBackgroundPermissionsAsync();

      if (backgroundStatus !== 'granted') {
        console.log(
          'Background location permission denied, continuing with foreground only'
        );
      }

      return true;
    } catch (error) {
      console.error('Error requesting location permissions:', error);
      return false;
    }
  };

  const getCurrentLocation = async (): Promise<{
    latitude: number;
    longitude: number;
  } | null> => {
    try {
      if (Platform.OS === 'web') {
        return new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              resolve({
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
              });
            },
            (error) => {
              console.error('Web geolocation error:', error);
              resolve(null);
            }
          );
        });
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      return null;
    }
  };

  const sendLocationToApi = async (vehicleId: string, driverId: string) => {
    const location = await getCurrentLocation();

    if (!location) {
      console.error('Failed to get current location');
      return;
    }

    const locationData: LocationData = {
      vehicleId,
      driverId,
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: new Date().toISOString(),
    };

    console.log(
      `Sending location data via WebSocket. Connection status: ${ApiService.getConnectionStatus()}`
    );

    const success = await ApiService.sendLocationData(locationData);

    setTrackingState((prev) => ({
      ...prev,
      lastLocation: location,
      lastApiCall: success ? new Date().toISOString() : prev.lastApiCall,
      apiCallCount: success ? prev.apiCallCount + 1 : prev.apiCallCount,
      connectionStatus: ApiService.getConnectionStatus(),
    }));

    if (!success) {
      console.warn('Failed to send location data via WebSocket');
    }
  };

  const startTracking = async (
    vehicleId: string,
    driverId: string
  ): Promise<boolean> => {
    const hasPermission = await requestLocationPermissions();

    if (!hasPermission) {
      return false;
    }

    console.log('Starting location tracking with WebSocket connection...');

    // Send initial location immediately
    await sendLocationToApi(vehicleId, driverId);

    // Set up interval for subsequent calls
    intervalRef.current = setInterval(() => {
      sendLocationToApi(vehicleId, driverId);
    }, TRACKING_INTERVAL);

    setTrackingState((prev) => ({
      ...prev,
      isTracking: true,
      connectionStatus: ApiService.getConnectionStatus(),
    }));

    return true;
  };

  const stopTracking = () => {
    console.log(
      'Stopping location tracking and closing WebSocket connection...'
    );

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (locationSubscriptionRef.current) {
      locationSubscriptionRef.current.remove();
      locationSubscriptionRef.current = null;
    }

    // Close WebSocket connection when stopping tracking
    ApiService.closeConnection();

    setTrackingState((prev) => ({
      ...prev,
      isTracking: false,
      connectionStatus: 'disconnected',
    }));
  };

  useEffect(() => {
    return () => {
      stopTracking();
    };
  }, []);

  return {
    trackingState,
    startTracking,
    stopTracking,
    requestLocationPermissions,
    // Additional utility methods for WebSocket management
    getConnectionStatus: () => ApiService.getConnectionStatus(),
    reconnect: () => {
      ApiService.closeConnection();
      // The reconnecting-websocket will automatically reconnect on next send
    },
  };
}
