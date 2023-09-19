import { StyleSheet, View } from "react-native";
import { Button, Text } from "react-native-paper";
import React, { useState, useCallback } from "react";
import { Camera, CameraType } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useRouter } from "expo-router";
import { useIsFocused, useFocusEffect } from "@react-navigation/native";
import QuantiteForm from "./FormQuantity";
import { auth } from "../(tabs)/_layout";

const ScanCode = () => {
  const [scanned, setScanned] = useState<boolean | string>(false);
  const [scannedText, setScannedText] = useState<string>("Not yet Scanned");
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [product, setProduct] = useState({
    productName: '',
    productImageUrl: undefined || '',
  });
  const [isFormVisible, setIsFormVisible] = useState<boolean>(false);

  const isFocused = useIsFocused();
  const navigation = useRouter();

  const typeCamera = CameraType.back;

  const userId = auth.currentUser?.uid;

  useFocusEffect(
    useCallback(() => {
      setScanned(false);
      return () => setScanned(true);
    }, [])
  );

  const handleBarCodeScanned = ({ type, data }: any) => {
    console.log(data, "data");
    setScanned(true);
    setScannedText(data);
    const encodedData = encodeURIComponent(data);
    data &&
      fetch(`https://world.openfoodfacts.net/api/v2/product/${encodedData}`)
        .then((response) => response.json())
        .then((responseJson) => {
          setScanned(false);
          setScannedText("");
          if (responseJson.status_verbose === "product not found") {
            navigation.push({
              pathname: "/(tabs)/home",
              params: {
                errorMessage:
                  " Produit non trouvé. Veuillez l'ajouter manuellement",
              },
            });
          } else {
            setProduct({
              productName:responseJson.product.product_name_fr,
              productImageUrl: responseJson.product.image_front_thumb_url
            });
            setIsFormVisible(true);
          }
        })
        .catch((error) => {
          console.log(error.message);
        });
  };

  return (
    <View style={styles.container}>
      {isFocused &&
        permission?.granted &&
        !scanned &&
        !isFormVisible && (
          <Camera
            barCodeScannerSettings={{
              barCodeTypes: [BarCodeScanner.Constants.BarCodeType.ean13],
            }}
            onBarCodeScanned={handleBarCodeScanned}
            type={typeCamera}
            style={styles.camera}
          />
        )}
      {isFormVisible ? (
        <QuantiteForm
          onFormClose={() => setIsFormVisible(false)}
          userId={userId}
          product={product}
        />
      ) : (
        <>
          <Button onPress={() => setScanned(false)}>
            <Text>Scan</Text>
          </Button>
          <Text style={{ fontSize: 30 }}>{scannedText}</Text>
        </>
      )}
      {!permission?.granted && (
        <Text onPress={requestPermission} style={{ fontSize: 20 }}>
          Cliquer ici pour activer votre camera{" "}
        </Text>
      )}
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
