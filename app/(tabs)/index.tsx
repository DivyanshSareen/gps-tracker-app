import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { TrackingForm } from '@/components/TrackingForm';
import { TrackingStatus } from '@/components/TrackingStatus';
import { TrackingControls } from '@/components/TrackingControls';
import { useLocationTracking } from '@/hooks/useLocationTracking';
import { StorageService } from '@/services/storage';

export default function TrackingScreen() {
  const [isLoading, setIsLoading] = useState(false);
  const [currentIds, setCurrentIds] = useState<{ vehicleId: string; driverId: string } | null>(null);
  const { trackingState, startTracking, stopTracking } = useLocationTracking();

  useEffect(() => {
    loadStoredIds();
  }, []);

  const loadStoredIds = async () => {
    try {
      const storedIds = await StorageService.getIds();
      if (storedIds) {
        setCurrentIds(storedIds);
      }
    } catch (error) {
      console.error('Failed to load stored IDs:', error);
    }
  };

  const handleFormSubmit = async (vehicleId: string, driverId: string) => {
    setIsLoading(true);
    
    try {
      setCurrentIds({ vehicleId, driverId });
      const success = await startTracking(vehicleId, driverId);
      
      if (!success) {
        alert('Failed to start tracking. Please check location permissions.');
      }
    } catch (error) {
      console.error('Failed to start tracking:', error);
      alert('Failed to start tracking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartTracking = async () => {
    if (!currentIds) return;
    
    setIsLoading(true);
    try {
      const success = await startTracking(currentIds.vehicleId, currentIds.driverId);
      if (!success) {
        alert('Failed to start tracking. Please check location permissions.');
      }
    } catch (error) {
      console.error('Failed to start tracking:', error);
      alert('Failed to start tracking. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStopTracking = () => {
    stopTracking();
  };

  const handleReset = async () => {
    try {
      stopTracking();
      await StorageService.clearIds();
      setCurrentIds(null);
    } catch (error) {
      console.error('Failed to reset session:', error);
      alert('Failed to reset session. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {!currentIds ? (
          <TrackingForm
            onSubmit={handleFormSubmit}
            isLoading={isLoading}
          />
        ) : (
          <>
            <TrackingStatus
              trackingState={trackingState}
              vehicleId={currentIds.vehicleId}
              driverId={currentIds.driverId}
            />
            <TrackingControls
              isTracking={trackingState.isTracking}
              onStartTracking={handleStartTracking}
              onStopTracking={handleStopTracking}
              onReset={handleReset}
              disabled={isLoading}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  scrollView: {
    flex: 1,
  },
});