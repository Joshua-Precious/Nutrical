import { useAppTheme } from "@/src/hooks/useAppTheme";
import { BarcodeScanningResult, CameraView } from "expo-camera";
import * as Haptics from "expo-haptics";
import { X } from "lucide-react-native";
import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface BarcodeScannerProps {
  visible: boolean;
  onClose: () => void;
  onBarcodeScanned: (barcode: string) => void;
}

export function BarcodeScanner({
  visible,
  onClose,
  onBarcodeScanned,
}: BarcodeScannerProps) {
  const { colors } = useAppTheme();
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    if (visible) {
      setScanned(false);
    }
  }, [visible]);

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    if (!scanned) {
      setScanned(true);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      onBarcodeScanned(data);
    }
  };

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
          </View>
        </CameraView>
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
});
