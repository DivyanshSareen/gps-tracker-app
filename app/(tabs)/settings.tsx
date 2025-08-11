import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  SafeAreaView,
  Alert 
} from 'react-native';
import { 
  Trash2, 
  Info, 
  Shield, 
  Globe,
  Clock,
  MapPin 
} from 'lucide-react-native';
import { StorageService } from '@/services/storage';

export default function SettingsScreen() {
  const [hasStoredData, setHasStoredData] = useState(false);

  useEffect(() => {
    checkStoredData();
  }, []);

  const checkStoredData = async () => {
    try {
      const storedIds = await StorageService.getIds();
      setHasStoredData(!!storedIds);
    } catch (error) {
      console.error('Failed to check stored data:', error);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will remove all stored Vehicle and Driver IDs. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            try {
              await StorageService.clearIds();
              setHasStoredData(false);
              Alert.alert('Success', 'All data has been cleared.');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data. Please try again.');
            }
          },
        },
      ]
    );
  };

  const InfoCard = ({ icon, title, description }: { 
    icon: React.ReactNode; 
    title: string; 
    description: string; 
  }) => (
    <View style={styles.infoCard}>
      <View style={styles.infoHeader}>
        {icon}
        <Text style={styles.infoTitle}>{title}</Text>
      </View>
      <Text style={styles.infoDescription}>{description}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data Management</Text>
          
          <TouchableOpacity
            style={[styles.actionButton, !hasStoredData && styles.disabledButton]}
            onPress={handleClearData}
            disabled={!hasStoredData}
          >
            <Trash2 size={20} color={hasStoredData ? '#EF4444' : '#9CA3AF'} />
            <Text style={[styles.actionButtonText, !hasStoredData && styles.disabledButtonText]}>
              Clear All Stored Data
            </Text>
          </TouchableOpacity>
          
          <Text style={styles.helperText}>
            {hasStoredData 
              ? 'Remove all stored Vehicle and Driver IDs from local storage'
              : 'No stored data to clear'
            }
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>How It Works</Text>
          
          <InfoCard
            icon={<Info size={20} color="#3B82F6" />}
            title="Data Storage"
            description="Vehicle and Driver IDs are securely stored locally on your device using AsyncStorage."
          />
          
          <InfoCard
            icon={<MapPin size={20} color="#10B981" />}
            title="Location Tracking"
            description="GPS coordinates are collected using device location services with proper permission handling."
          />
          
          <InfoCard
            icon={<Clock size={20} color="#F59E0B" />}
            title="Data Transmission"
            description="Location data is automatically sent to the API every 30 seconds while tracking is active."
          />
          
          <InfoCard
            icon={<Globe size={20} color="#8B5CF6" />}
            title="API Integration"
            description="Data is sent to https://api.example.com/tracking/location with automatic retry logic for failed requests."
          />
          
          <InfoCard
            icon={<Shield size={20} color="#059669" />}
            title="Privacy & Security"
            description="All data is processed locally and only location coordinates are transmitted to the API endpoint."
          />
        </View>

        <View style={styles.footer}>
          <Text style={styles.versionText}>GPS Tracker v1.0.0</Text>
          <Text style={styles.footerText}>
            Built with React Native and Expo
          </Text>
        </View>
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
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1F2937',
    textAlign: 'center',
  },
  section: {
    margin: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 16,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  disabledButton: {
    opacity: 0.5,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#EF4444',
    marginLeft: 12,
  },
  disabledButtonText: {
    color: '#9CA3AF',
  },
  helperText: {
    fontSize: 14,
    color: '#6B7280',
    marginLeft: 4,
  },
  infoCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginLeft: 12,
  },
  infoDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  footer: {
    padding: 20,
    alignItems: 'center',
    marginTop: 20,
  },
  versionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});