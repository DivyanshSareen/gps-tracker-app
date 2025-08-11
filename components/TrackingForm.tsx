import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Check, CircleAlert as AlertCircle } from 'lucide-react-native';
import { FormData, ValidationErrors, StoredIds } from '@/types/tracking';
import { StorageService } from '@/services/storage';

interface TrackingFormProps {
  onSubmit: (vehicleId: string, driverId: string) => void;
  isLoading: boolean;
}

export function TrackingForm({ onSubmit, isLoading }: TrackingFormProps) {
  const [formData, setFormData] = useState<FormData>({
    vehicleId: '',
    driverId: '',
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    loadStoredIds();
  }, []);

  const loadStoredIds = async () => {
    try {
      const storedIds = await StorageService.getIds();
      if (storedIds) {
        setFormData(storedIds);
      }
    } catch (error) {
      console.error('Failed to load stored IDs:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (!formData.vehicleId.trim()) {
      newErrors.vehicleId = 'Vehicle ID is required';
    }

    if (!formData.driverId.trim()) {
      newErrors.driverId = 'Driver ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      setMessage({
        text: 'Please fill in all required fields',
        type: 'error',
      });
      return;
    }

    try {
      await StorageService.saveIds(formData.vehicleId.trim(), formData.driverId.trim());
      
      setMessage({
        text: 'IDs saved successfully!',
        type: 'success',
      });

      onSubmit(formData.vehicleId.trim(), formData.driverId.trim());
    } catch (error) {
      setMessage({
        text: 'Failed to save IDs. Please try again.',
        type: 'error',
      });
    }
  };

  const clearForm = async () => {
    try {
      await StorageService.clearIds();
      setFormData({ vehicleId: '', driverId: '' });
      setErrors({});
      setMessage({
        text: 'Form cleared successfully',
        type: 'success',
      });
    } catch (error) {
      setMessage({
        text: 'Failed to clear form',
        type: 'error',
      });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>GPS Tracking Setup</Text>
      
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Vehicle ID *</Text>
        <TextInput
          style={[styles.input, errors.vehicleId && styles.inputError]}
          value={formData.vehicleId}
          onChangeText={(text) => {
            setFormData(prev => ({ ...prev, vehicleId: text }));
            if (errors.vehicleId) {
              setErrors(prev => ({ ...prev, vehicleId: undefined }));
            }
          }}
          placeholder="Enter vehicle ID"
          editable={!isLoading}
        />
        {errors.vehicleId && (
          <Text style={styles.errorText}>{errors.vehicleId}</Text>
        )}
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Driver ID *</Text>
        <TextInput
          style={[styles.input, errors.driverId && styles.inputError]}
          value={formData.driverId}
          onChangeText={(text) => {
            setFormData(prev => ({ ...prev, driverId: text }));
            if (errors.driverId) {
              setErrors(prev => ({ ...prev, driverId: undefined }));
            }
          }}
          placeholder="Enter driver ID"
          editable={!isLoading}
        />
        {errors.driverId && (
          <Text style={styles.errorText}>{errors.driverId}</Text>
        )}
      </View>

      {message && (
        <View style={[styles.messageContainer, 
          message.type === 'success' ? styles.successMessage : styles.errorMessage
        ]}>
          {message.type === 'success' ? (
            <Check size={16} color="#10B981" />
          ) : (
            <AlertCircle size={16} color="#EF4444" />
          )}
          <Text style={[styles.messageText,
            message.type === 'success' ? styles.successText : styles.errorMessageText
          ]}>
            {message.text}
          </Text>
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton, isLoading && styles.disabledButton]}
          onPress={handleSubmit}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Saving...' : 'Save & Start Tracking'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.secondaryButton]}
          onPress={clearForm}
          disabled={isLoading}
        >
          <Text style={styles.secondaryButtonText}>Clear Form</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#F9FAFB',
  },
  inputError: {
    borderColor: '#EF4444',
    backgroundColor: '#FEF2F2',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    marginTop: 4,
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  successMessage: {
    backgroundColor: '#ECFDF5',
    borderColor: '#10B981',
    borderWidth: 1,
  },
  errorMessage: {
    backgroundColor: '#FEF2F2',
    borderColor: '#EF4444',
    borderWidth: 1,
  },
  messageText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
  },
  successText: {
    color: '#065F46',
  },
  errorMessageText: {
    color: '#991B1B',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
  },
  secondaryButton: {
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
  secondaryButtonText: {
    color: '#6B7280',
    fontSize: 16,
    fontWeight: '600',
  },
});