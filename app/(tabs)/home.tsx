import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import React, { useState, useEffect } from "react";
import { Camera, CameraType } from "expo-camera";
import { BarCodeScanner } from 'expo-barcode-scanner';

const home = () => {
  const [scanned, setScanned] = useState<boolean | string>(false);
  const [scannedText, setScannedText] = useState<string>("Not yet Scanned");
  const [quantity, setQuantity] = useState<string>("");

  const typeCamera = CameraType.back

  const handleBarCodeScanned = ({type,data}:any) => {
    console.log(data);
    setScanned(true);
    setScannedText(data);
    data && fetch(`https://world.openfoodfacts.net/api/v2/product/${data}`)
    .then((response) => response.json())
    .then((responseJson) => {console.log (responseJson);})
  };

  useEffect(() => {
  }, []);

  return (
    <View style={styles.container}>
      <Camera 
       barCodeScannerSettings={{
        barCodeTypes: [BarCodeScanner.Constants.BarCodeType.ean13],

       }}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        type={typeCamera}
        style={styles.camera}
      />
      {scanned && (
        <Button onPress={() => setScanned(false)}>
          <Text>Scan</Text>
        </Button>
      )}
      <Text style={{ fontSize: 30 }}>{scannedText}</Text>
    </View>
  );
};

export default home;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  Scanner: {
    width: "70%",
    height: "50%",
    backgroundColor: "black",
  },
  camera: {
    width: "100%",
    height: "90%",
  },
});
