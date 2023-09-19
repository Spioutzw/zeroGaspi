import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { useRouter } from "expo-router";
import { ref, set } from "firebase/database";
import { db } from "../(tabs)/_layout";
import uuid from "react-native-uuid";

import * as Notifications from "expo-notifications";
import { scheduleExpirationNotifications } from "../utils/functions";

type FormData = {
  quantite: string;
};

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function QuantiteForm({
  onFormClose,
  userId,
  product,
}: {
  product: { productName: string; productImageUrl: string };
  onFormClose: () => void;
  userId: string | undefined;
}) {
  const { control, handleSubmit } = useForm<FormData>();
  const [dates, setDates] = useState<Date[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPickerVisible, setIsPickerVisible] = useState(true);

  const router = useRouter();

  const handleDateChange = async (
    event: DateTimePickerEvent,
    selectedDate?: Date
  ) => {
    setIsPickerVisible(false);
    if (selectedDate) {
      const newDates = [...dates];
      newDates[currentIndex] = selectedDate;
      setDates(newDates);

      if (currentIndex < newDates.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsPickerVisible(true);
      } else {
        setShowPicker(false);
        try {
          if (userId) {
            const formattedDates = newDates.map((date) =>
              date.toLocaleDateString()
            );
            const productId = uuid.v4();

            set(ref(db, "users/" + userId + "/products/" + productId), {
              name: product.productName,
              quantity: newDates.length,
              expirationDates: formattedDates,
              imageUrl: product.productImageUrl,
            });

            // Ajout du code pour programmer les notifications
            console.log(newDates, "newDates");

            scheduleExpirationNotifications(
              product.productName,
              productId,
              newDates
            );

            onFormClose();
          } else {
            console.log("no user");
          }
        } catch (e) {
          console.log(e);
        }
        router.push("/(tabs)/home");
      }
    }
  };

  const onSubmit = (data: FormData) => {
    const quantite = parseInt(data.quantite, 10);
    if (!isNaN(quantite)) {
      setDates(new Array(quantite).fill(new Date()));
      setCurrentIndex(0);
      setShowPicker(true);
      setIsPickerVisible(true);
    }
  };

  useEffect(() => {
    console.log("je suis re-render");
    console.log(userId);
  }, []);

  return (
    <View style={styles.container}>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Quantité"
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
          />
        )}
        name="quantite"
        defaultValue=""
      />
      <Button
        style={styles.button}
        mode="elevated"
        onPress={handleSubmit(onSubmit)}
      >
        <Text> Soumettre</Text>
      </Button>
      {showPicker && isPickerVisible && (
        <DateTimePicker
          value={dates[currentIndex]}
          onChange={handleDateChange}
          mode="date"
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  input: {
    width: "100%",
    marginBottom: 10,
  },
  button: {
    width: "100%",
    marginTop: 10,
  },
});
