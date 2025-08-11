export interface TrackingState {
  isTracking: boolean;
  lastApiCall: string | null;
  lastLocation: { latitude: number; longitude: number } | null;
  apiCallCount: number;
  connectionStatus: string; // Added for WebSocket connection status
}

export interface LocationData {
  vehicleId: string;
  driverId: string;
  latitude: number;
  longitude: number;
  timestamp: string;
}

export interface StoredIds {
  vehicleId: string;
  driverId: string;
}

export interface FormData {
  vehicleId: string;
  driverId: string;
}

export interface ValidationErrors {
  vehicleId?: string;
  driverId?: string;
}
