import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import React, { useState, useEffect } from "react";
import { Camera, CameraType } from "expo-camera";
import { BarCodeScanner } from 'expo-barcode-scanner';
import { useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';

const ScanCode = () => {
  const [scanned, setScanned] = useState<boolean | string>(false);
  const [scannedText, setScannedText] = useState<string>("Not yet Scanned");
  const navigation = useRouter();

  const typeCamera = CameraType.back

  const handleBarCodeScanned = ({type,data}:any) => {
    console.log(data);
    setScanned(true);
    setScannedText(data);
    data && fetch(`https://world.openfoodfacts.net/api/v2/product/${data}`)
    .then((response) => response.json())
    .then((responseJson) => {
      console.log (responseJson);
      navigation.push({
        pathname: "/(tabs)/FormQuantity",
        params: {
          product: responseJson,
        }
      })
    })
    ;
  };

  const getData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('products');
      console.log(jsonValue);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    getData();
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

export default ScanCode;

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
