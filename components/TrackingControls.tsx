import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, Pause, RotateCcw } from 'lucide-react-native';

interface TrackingControlsProps {
  isTracking: boolean;
  onStartTracking: () => void;
  onStopTracking: () => void;
  onReset: () => void;
  disabled?: boolean;
}

export function TrackingControls({
  isTracking,
  onStartTracking,
  onStopTracking,
  onReset,
  disabled = false,
}: TrackingControlsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tracking Controls</Text>
      
      <View style={styles.buttonContainer}>
        {!isTracking ? (
          <TouchableOpacity
            style={[styles.button, styles.startButton, disabled && styles.disabledButton]}
            onPress={onStartTracking}
            disabled={disabled}
          >
            <Play size={20} color="white" />
            <Text style={styles.buttonText}>Start Tracking</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={[styles.button, styles.stopButton]}
            onPress={onStopTracking}
          >
            <Pause size={20} color="white" />
            <Text style={styles.buttonText}>Stop Tracking</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity
          style={[styles.button, styles.resetButton]}
          onPress={onReset}
          disabled={disabled}
        >
          <RotateCcw size={20} color="#6B7280" />
          <Text style={styles.resetButtonText}>Reset Session</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          {isTracking 
            ? 'Location data is being sent every 30 seconds'
            : 'Enter Vehicle and Driver IDs to start tracking'
          }
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 8,
  },
  startButton: {
    backgroundColor: '#10B981',
  },
  stopButton: {
    backgroundColor: '#EF4444',
  },
  resetButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  disabledButton: {
    backgroundColor: '#9CA3AF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  resetButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
});