import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MapPin, Clock, Activity, CircleCheck as CheckCircle } from 'lucide-react-native';
import { TrackingState } from '@/types/tracking';

interface TrackingStatusProps {
  trackingState: TrackingState;
  vehicleId?: string;
  driverId?: string;
}

export function TrackingStatus({ trackingState, vehicleId, driverId }: TrackingStatusProps) {
  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return 'Never';
    return new Date(timestamp).toLocaleString();
  };

  const getStatusColor = () => {
    return trackingState.isTracking ? '#10B981' : '#6B7280';
  };

  const getStatusText = () => {
    return trackingState.isTracking ? 'Tracking Active' : 'Tracking Stopped';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tracking Status</Text>
      
      <View style={styles.statusRow}>
        <Activity size={20} color={getStatusColor()} />
        <Text style={[styles.statusText, { color: getStatusColor() }]}>
          {getStatusText()}
        </Text>
      </View>

      {vehicleId && driverId && (
        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Current Session</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Vehicle ID:</Text>
            <Text style={styles.infoValue}>{vehicleId}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Driver ID:</Text>
            <Text style={styles.infoValue}>{driverId}</Text>
          </View>
        </View>
      )}

      <View style={styles.statsSection}>
        <Text style={styles.sectionTitle}>Statistics</Text>
        
        <View style={styles.statRow}>
          <CheckCircle size={16} color="#10B981" />
          <Text style={styles.statLabel}>API Calls Sent:</Text>
          <Text style={styles.statValue}>{trackingState.apiCallCount}</Text>
        </View>

        <View style={styles.statRow}>
          <Clock size={16} color="#6B7280" />
          <Text style={styles.statLabel}>Last API Call:</Text>
          <Text style={styles.statValue}>
            {formatTimestamp(trackingState.lastApiCall)}
          </Text>
        </View>

        {trackingState.lastLocation && (
          <View style={styles.locationSection}>
            <View style={styles.statRow}>
              <MapPin size={16} color="#3B82F6" />
              <Text style={styles.statLabel}>Last Location:</Text>
            </View>
            <Text style={styles.locationText}>
              Lat: {trackingState.lastLocation.latitude.toFixed(6)}
            </Text>
            <Text style={styles.locationText}>
              Lng: {trackingState.lastLocation.longitude.toFixed(6)}
            </Text>
          </View>
        )}
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
    fontSize: 20,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 16,
    textAlign: 'center',
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#F9FAFB',
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  infoSection: {
    marginBottom: 20,
    padding: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  statsSection: {
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 16,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 8,
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: '600',
  },
  locationSection: {
    marginTop: 8,
    paddingLeft: 24,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'monospace',
    marginLeft: 24,
  },
});