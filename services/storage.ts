import AsyncStorage from '@react-native-async-storage/async-storage';
import { StoredIds } from '@/types/tracking';

const STORAGE_KEYS = {
  VEHICLE_ID: 'vehicle_id',
  DRIVER_ID: 'driver_id',
} as const;

export const StorageService = {
  async saveIds(vehicleId: string, driverId: string): Promise<void> {
    try {
      await AsyncStorage.multiSet([
        [STORAGE_KEYS.VEHICLE_ID, vehicleId],
        [STORAGE_KEYS.DRIVER_ID, driverId],
      ]);
    } catch (error) {
      console.error('Failed to save IDs to storage:', error);
      throw new Error('Failed to save data');
    }
  },

  async getIds(): Promise<StoredIds | null> {
    try {
      const values = await AsyncStorage.multiGet([
        STORAGE_KEYS.VEHICLE_ID,
        STORAGE_KEYS.DRIVER_ID,
      ]);
      
      const vehicleId = values[0][1];
      const driverId = values[1][1];
      
      if (vehicleId && driverId) {
        return { vehicleId, driverId };
      }
      
      return null;
    } catch (error) {
      console.error('Failed to get IDs from storage:', error);
      return null;
    }
  },

  async clearIds(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.VEHICLE_ID,
        STORAGE_KEYS.DRIVER_ID,
      ]);
    } catch (error) {
      console.error('Failed to clear IDs from storage:', error);
      throw new Error('Failed to clear data');
    }
  },
};