import React, { useState } from 'react';
import { View, StyleSheet, Modal, Pressable, Image } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import FinTrackedColors from '../../constants/Colors';
import { scanReceiptImage, ScannedReceiptResult } from '../../services/aiReceiptScanner';
import { formatRupee } from '../../utils/formatters';

interface ReceiptScannerModalProps {
  visible: boolean;
  onClose: () => void;
  onReceiptScanned: (result: ScannedReceiptResult) => void;
}

export const ReceiptScannerModal: React.FC<ReceiptScannerModalProps> = ({
  visible,
  onClose,
  onReceiptScanned,
}) => {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScannedReceiptResult | null>(null);

  const handlePickImage = async (useCamera: boolean) => {
    try {
      setScanResult(null);

      const permissionResult = useCamera
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permissionResult.granted) {
        alert('Permission to access camera or gallery is required!');
        return;
      }

      const result = useCamera
        ? await ImagePicker.launchCameraAsync({ quality: 0.8, allowsEditing: true })
        : await ImagePicker.launchImageLibraryAsync({ quality: 0.8, allowsEditing: true });

      if (result.canceled || !result.assets || result.assets.length === 0) return;

      const uri = result.assets[0].uri;
      setImageUri(uri);

      // Start AI vision scanning
      setIsScanning(true);
      const parsed = await scanReceiptImage(uri);
      setScanResult(parsed);
      setIsScanning(false);
    } catch (err: any) {
      console.error('Image Picker Error:', err);
      setIsScanning(false);
    }
  };

  const handleApplyToForm = () => {
    if (scanResult) {
      onReceiptScanned(scanResult);
      onClose();
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <Ionicons name="sparkles" size={20} color={FinTrackedColors.gold} />
              <Text variant="titleMedium" style={styles.title}>
                AI Receipt Vision Scanner
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={FinTrackedColors.textSecondary} />
            </Pressable>
          </View>

          {!imageUri ? (
            <View style={styles.optionsContainer}>
              <Pressable
                onPress={() => handlePickImage(true)}
                style={({ pressed }) => [styles.optionCard, pressed && { opacity: 0.7 }]}
              >
                <View style={styles.iconBg}>
                  <Ionicons name="camera" size={28} color={FinTrackedColors.primary} />
                </View>
                <Text style={styles.optionTitle}>Snap Receipt Photo</Text>
                <Text style={styles.optionSub}>Use camera to scan paper receipt</Text>
              </Pressable>

              <Pressable
                onPress={() => handlePickImage(false)}
                style={({ pressed }) => [styles.optionCard, pressed && { opacity: 0.7 }]}
              >
                <View style={styles.iconBg}>
                  <Ionicons name="images" size={28} color={FinTrackedColors.secondary} />
                </View>
                <Text style={styles.optionTitle}>Upload from Gallery</Text>
                <Text style={styles.optionSub}>Select screenshot or saved bill</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.previewContainer}>
              <Image source={{ uri: imageUri }} style={styles.receiptPreviewImage} />

              {isScanning ? (
                <View style={styles.scanningBox}>
                  <ActivityIndicator size="small" color={FinTrackedColors.primary} />
                  <Text style={styles.scanningText}>AI is analyzing receipt text & total...</Text>
                </View>
              ) : scanResult ? (
                <View style={styles.resultBox}>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Merchant:</Text>
                    <Text style={styles.resultValue}>{scanResult.title}</Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Total Amount:</Text>
                    <Text style={[styles.resultValue, { color: FinTrackedColors.primary, fontSize: 16 }]}>
                      {formatRupee(scanResult.amount)}
                    </Text>
                  </View>
                  <View style={styles.resultRow}>
                    <Text style={styles.resultLabel}>Category:</Text>
                    <Text style={styles.resultValue}>{scanResult.category}</Text>
                  </View>

                  <Button
                    mode="contained"
                    onPress={handleApplyToForm}
                    style={styles.applyBtn}
                    contentStyle={styles.applyBtnContent}
                    labelStyle={styles.applyBtnLabel}
                  >
                    Auto-Fill Transaction Form
                  </Button>
                </View>
              ) : null}
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: FinTrackedColors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: FinTrackedColors.surfaceBorder + '80',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
    marginLeft: 8,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 12,
  },
  optionCard: {
    flex: 1,
    backgroundColor: FinTrackedColors.surfaceVariant + '40',
    padding: 16,
    borderRadius: 18,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: FinTrackedColors.surfaceBorder,
    marginRight: 8,
  },
  iconBg: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: FinTrackedColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  optionTitle: {
    color: FinTrackedColors.textPrimary,
    fontWeight: '700',
    fontSize: 13,
    textAlign: 'center',
  },
  optionSub: {
    color: FinTrackedColors.textSecondary,
    fontSize: 10,
    textAlign: 'center',
    marginTop: 2,
  },
  previewContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  receiptPreviewImage: {
    width: 120,
    height: 140,
    borderRadius: 12,
    marginBottom: 14,
  },
  scanningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  scanningText: {
    color: FinTrackedColors.primary,
    fontWeight: '600',
    fontSize: 13,
    marginLeft: 10,
  },
  resultBox: {
    width: '100%',
    backgroundColor: FinTrackedColors.surfaceVariant + '40',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: FinTrackedColors.primary + '40',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  resultLabel: {
    color: FinTrackedColors.textSecondary,
    fontSize: 12,
  },
  resultValue: {
    color: FinTrackedColors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
  },
  applyBtn: {
    backgroundColor: FinTrackedColors.primary,
    borderRadius: 14,
    marginTop: 12,
  },
  applyBtnContent: {
    height: 44,
  },
  applyBtnLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
