import { useAppTheme } from "@/src/hooks/useAppTheme";
import { BarcodeScanningResult, CameraView } from "expo-camera";
import * as Haptics from "expo-haptics";
import { AlertCircle, X } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Linking,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface BarcodeScannerProps {
  visible: boolean;
  onClose: () => void;
  onBarcodeScanned: (barcode: string) => void;
  permissionGranted?: boolean;
  onRequestPermission?: () => void;
}

export function BarcodeScanner({
  visible,
  onClose,
  onBarcodeScanned,
  permissionGranted = true,
  onRequestPermission,
}: BarcodeScannerProps) {
  const { colors } = useAppTheme();
  const [scanned, setScanned] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualBarcode, setManualBarcode] = useState("");

  useEffect(() => {
    if (visible) {
      setScanned(false);
      setShowManualInput(false);
      setManualBarcode("");
    }
  }, [visible]);

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    if (!scanned) {
      setScanned(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onBarcodeScanned(data);
    }
  };

  const handleManualSubmit = () => {
    if (manualBarcode.trim()) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onBarcodeScanned(manualBarcode.trim());
      onClose();
    }
  };

  const handleOpenSettings = () => {
    Linking.openSettings();
  };

  // Show permission request screen if not granted
  if (!permissionGranted) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        onRequestClose={onClose}
        transparent={false}
      >
        <View
          style={[
            styles.container,
            { backgroundColor: colors["bg-200"], justifyContent: "center" },
          ]}
        >
          <View style={styles.permissionContainer}>
            <View
              style={[
                styles.permissionIcon,
                { backgroundColor: colors["bg-300"] },
              ]}
            >
              <AlertCircle size={48} color={colors.primary} />
            </View>
            <Text
              style={[
                styles.permissionTitle,
                { color: colors["bg-text"], marginBottom: 12 },
              ]}
            >
              Camera Permission Required
            </Text>
            <Text
              style={[
                styles.permissionText,
                { color: colors["bg-text-muted"], marginBottom: 24 },
              ]}
            >
              To scan product barcodes, please grant camera access in your
              device settings.
            </Text>
            <Pressable
              onPress={onRequestPermission || handleOpenSettings}
              style={[
                styles.permissionButton,
                { backgroundColor: colors.primary, marginBottom: 12 },
              ]}
            >
              <Text style={[styles.permissionButtonText, { color: "#fff" }]}>
                Grant Permission
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setShowManualInput(true)}
              style={[
                styles.permissionButton,
                { backgroundColor: colors["bg-300"], marginBottom: 12 },
              ]}
            >
              <Text
                style={[
                  styles.permissionButtonText,
                  { color: colors["bg-text"] },
                ]}
              >
                Enter Barcode Manually
              </Text>
            </Pressable>
            <Pressable onPress={onClose}>
              <Text style={[styles.cancelText, { color: colors.accent }]}>
                Cancel
              </Text>
            </Pressable>
          </View>

          {/* Manual Input Overlay */}
          {showManualInput && (
            <View
              style={[
                styles.manualInputOverlay,
                { backgroundColor: "rgba(0,0,0,0.5)" },
              ]}
            >
              <View
                style={[
                  styles.manualInputContainer,
                  { backgroundColor: colors["bg-100"] },
                ]}
              >
                <Text
                  style={[
                    styles.manualInputTitle,
                    { color: colors["bg-text"] },
                  ]}
                >
                  Enter Barcode
                </Text>
                <TextInput
                  value={manualBarcode}
                  onChangeText={setManualBarcode}
                  placeholder="Type or paste barcode number"
                  placeholderTextColor={colors["bg-text-muted"]}
                  keyboardType="numeric"
                  style={[
                    styles.manualInput,
                    {
                      backgroundColor: colors["bg-200"],
                      color: colors["bg-text"],
                    },
                  ]}
                  autoFocus
                />
                <View style={styles.manualInputActions}>
                  <Pressable
                    onPress={() => setShowManualInput(false)}
                    style={[
                      styles.manualInputButton,
                      { backgroundColor: colors["bg-300"] },
                    ]}
                  >
                    <Text style={{ color: colors["bg-text"] }}>Cancel</Text>
                  </Pressable>
                  <Pressable
                    onPress={handleManualSubmit}
                    style={[
                      styles.manualInputButton,
                      { backgroundColor: colors.primary },
                    ]}
                  >
                    <Text style={{ color: "#fff" }}>Search</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          )}
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      transparent={false}
    >
      <View style={styles.container}>
        <CameraView
          style={styles.camera}
          facing="back"
          onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: [
              "ean13",
              "ean8",
              "upc_a",
              "upc_e",
              "code128",
              "code39",
              "qr",
            ],
          }}
        >
          {/* Header */}
          <View
            style={[styles.header, { backgroundColor: "rgba(0, 0, 0, 0.6)" }]}
          >
            <Text style={[styles.headerText, { color: colors.white }]}>
              Scan Product Barcode
            </Text>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <X size={28} color={colors.white} />
            </Pressable>
          </View>

          {/* Scanning Frame */}
          <View style={styles.scanFrame}>
            <View style={styles.overlay}>
              <View style={styles.scanArea}>
                <View
                  style={[
                    styles.corner,
                    styles.topLeft,
                    { borderColor: colors.primary },
                  ]}
                />
                <View
                  style={[
                    styles.corner,
                    styles.topRight,
                    { borderColor: colors.primary },
                  ]}
                />
                <View
                  style={[
                    styles.corner,
                    styles.bottomLeft,
                    { borderColor: colors.primary },
                  ]}
                />
                <View
                  style={[
                    styles.corner,
                    styles.bottomRight,
                    { borderColor: colors.primary },
                  ]}
                />
              </View>
            </View>
          </View>

          {/* Instructions */}
          <View
            style={[
              styles.instructions,
              { backgroundColor: "rgba(0, 0, 0, 0.6)" },
            ]}
          >
            <Text style={[styles.instructionText, { color: colors.white }]}>
              Position the barcode within the frame
            </Text>
            {scanned && (
              <Text style={[styles.scannedText, { color: colors.primary }]}>
                ✓ Barcode scanned!
              </Text>
            )}
            <Pressable
              onPress={() => setShowManualInput(true)}
              style={[
                styles.manualInputTrigger,
                { backgroundColor: colors["bg-100"], marginTop: 16 },
              ]}
            >
              <Text
                style={[
                  styles.manualInputTriggerText,
                  { color: colors.accent },
                ]}
              >
                Enter Barcode Manually
              </Text>
            </Pressable>
          </View>
        </CameraView>

        {/* Manual Input Overlay */}
        {showManualInput && (
          <View
            style={[
              styles.manualInputOverlay,
              { backgroundColor: "rgba(0,0,0,0.8)" },
            ]}
          >
            <View
              style={[
                styles.manualInputContainer,
                { backgroundColor: colors["bg-100"] },
              ]}
            >
              <Text
                style={[styles.manualInputTitle, { color: colors["bg-text"] }]}
              >
                Enter Barcode
              </Text>
              <TextInput
                value={manualBarcode}
                onChangeText={setManualBarcode}
                placeholder="Type or paste barcode number"
                placeholderTextColor={colors["bg-text-muted"]}
                keyboardType="numeric"
                style={[
                  styles.manualInput,
                  {
                    backgroundColor: colors["bg-200"],
                    color: colors["bg-text"],
                  },
                ]}
                autoFocus
              />
              <View style={styles.manualInputActions}>
                <Pressable
                  onPress={() => setShowManualInput(false)}
                  style={[
                    styles.manualInputButton,
                    { backgroundColor: colors["bg-300"] },
                  ]}
                >
                  <Text style={{ color: colors["bg-text"] }}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleManualSubmit}
                  style={[
                    styles.manualInputButton,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Text style={{ color: "#fff" }}>Search</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
  },
  scanFrame: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  scanArea: {
    width: 280,
    height: 280,
    position: "relative",
  },
  corner: {
    position: "absolute",
    width: 40,
    height: 40,
    borderWidth: 4,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: 8,
  },
  topRight: {
    top: 0,
    right: 0,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: 8,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: 8,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: 8,
  },
  instructions: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  instructionText: {
    fontSize: 16,
    textAlign: "center",
  },
  scannedText: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  permissionContainer: {
    paddingHorizontal: 32,
    alignItems: "center",
  },
  permissionIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  permissionButton: {
    width: "100%",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
  },
  permissionButtonText: {
    fontSize: 16,
    fontWeight: "600",
  },
  cancelText: {
    fontSize: 16,
    fontWeight: "600",
  },
  manualInputTrigger: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  manualInputTriggerText: {
    fontSize: 14,
    fontWeight: "600",
  },
  manualInputOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  manualInputContainer: {
    width: "85%",
    padding: 24,
    borderRadius: 16,
  },
  manualInputTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  manualInput: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 16,
  },
  manualInputActions: {
    flexDirection: "row",
    gap: 12,
  },
  manualInputButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
});
