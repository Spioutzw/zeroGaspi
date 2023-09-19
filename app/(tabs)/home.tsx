import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { db,auth } from "./_layout";
import { set, ref } from "firebase/database";
import uuid from "react-native-uuid";
import {
  Text,
  TextInput,
  Button,
  HelperText,
  Divider,
} from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, Link, router,useNavigation, Stack } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ProductFormData } from "../types/types";
import { scheduleExpirationNotifications } from "../utils/functions";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { signOut } from "../../auth/auth";
import { getAuth } from "firebase/auth";

const schema = yup.object().shape({
  name: yup.string().required("Le nom du produit est obligatoire"),
  quantity: yup
    .number()
    .min(1, "La quantité doit être au minimum de 1")
    .required("Le nombre de produits est obligatoire"),
});

const Home = () => {
  const params = useLocalSearchParams();
  
  
  
  useEffect(() => {

    const user = getAuth();
    user.onAuthStateChanged((user) => {
      if (user === null) {
        router.push('/(tabs)/Login')
      } 
    });
     
    
     
  },[]);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
  });

  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [show, setShow] = useState(false);
  const [tempQuantity, setTempQuantity] = useState<number | null>();

  const handleDateChange = (index: number, date: Date | undefined) => {
    if (date) {
      setSelectedDates((prevDates) => {
        const newDates = [...prevDates];
        newDates[index] = date;
        // Vérifie si le nombre de dates sélectionnées est égal à tempQuantity
        if (newDates.filter(Boolean).length === tempQuantity) {
          setShow(false); // Ferme automatiquement le sélecteur de date
        }
        return newDates;
      });
    }
  };

  const onSubmit = (data: ProductFormData) => {
    const user = auth.currentUser;
    console.log(data);
    console.log(selectedDates);
    const productId = uuid.v4();
    if (user) {
      set(ref(db, "users/" + user.uid + "/products/" + productId), {
        ...data,
        id: productId,
        expirationDates: selectedDates.map((date) => date.toLocaleDateString()),
      });
    }
    if (selectedDates.length) {
      scheduleExpirationNotifications(data.name, productId, selectedDates);
    }
    setShow(false); // reset the show state
    reset();
    setSelectedDates([]); // <-- Réinitialisez les dates sélectionnées
    setTempQuantity(null);
  };

 

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Home',
        }}
      />
      <Text style={styles.instructions}>
        Pour ajouter un produit, scannez-le ou ajoutez-le manuellement en
        remplissant le formulaire ci-dessous.
      </Text>
      <Controller
        name="name"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Nom du produit"
              onChangeText={onChange}
              value={value}
            />
            <HelperText type={"error"} visible={!!errors.name}>
              {errors.name?.message}
            </HelperText>
          </>
        )}
      />

      <Controller
        name="quantity"
        control={control}
        defaultValue={0}
        render={({ field: { onChange, value } }) => (
          <>
            <TextInput
              style={styles.input}
              placeholder="Quantité"
              onChangeText={(text) => {
                const numberValue = Number(text);
                setTempQuantity(numberValue);
                onChange(numberValue);
              }}
              value={value.toString()}
              keyboardType="numeric"
            />
            <HelperText type={"error"} visible={!!errors.quantity}>
              {errors.quantity?.message}
            </HelperText>
          </>
        )}
      />

      {tempQuantity && tempQuantity >= 1 ? (
        <Button
          style={styles.button}
          mode="elevated"
          onPress={() => {
            if (tempQuantity && tempQuantity > 0) {
              setShow(true);
            }
          }}
        >
          {tempQuantity > 1
            ? `Ajouter les ${tempQuantity} dates`
            : "Ajouter la date"}
        </Button>
      ) : null}

      {tempQuantity && tempQuantity > 0 && show ? (
        <View>
          {Array.from({ length: tempQuantity ?? 0 }).map((_, index) => (
            <DateTimePicker
              key={index}
              testID={`dateTimePicker-${index}`}
              value={selectedDates[index] || new Date()}
              mode="date"
              onChange={(event, date) => {
                if (date) {
                  handleDateChange(index, date);
                }
              }}
            />
          ))}
        </View>
      ) : null}

      {selectedDates.length > 0 ? (
        <Button
          style={styles.button}
          mode="elevated"
          onPress={handleSubmit(onSubmit)}
        >
          <Text>Ajouter le produit</Text>
        </Button>
      ) : null}

      <View style={styles.dividerContainer}>
        <Divider style={styles.divider} />
        <Text> Ou</Text>
        <Divider style={styles.divider} />
      </View>
      <Link asChild href={"/pages/ScanCode"}>
      <Button style={styles.button} mode="elevated">
          <Text>Scanner le produit</Text>
        </Button>
      </Link>

      {params.errorMessage ? (
        <Text style={styles.error}>{params.errorMessage}</Text>
      ) : null}

      <Button style={styles.button} mode="elevated" onPress={signOut}>
        <Text>Se déconnecter</Text>
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  instructions: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 8,
  },
  error: {
    color: "red",
  },
  button: {
    margin: 16,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  divider: {
    width: "45%",
  },
});

export default Home;
