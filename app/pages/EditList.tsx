import React, { useEffect, useState } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button, TextInput } from "react-native-paper";
import { db,auth } from "../(tabs)/_layout"; 
import { ref, onValue, off, update, remove } from "firebase/database";
import { router, useLocalSearchParams } from "expo-router";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { convertStringToDate } from "../utils/functions";
import * as Notifications from "expo-notifications";
import { Product } from "../types/types";

const EditProduct: React.FC = () => {
  
  const params = useLocalSearchParams();

  const user = auth.currentUser;

  useEffect(() => {
    const id = params.id;
    if (user && id) {
      const productsRef = ref(db, "users/" + user.uid + "/products/" + id);
      ref(db, `products/${id}`);
      onValue(productsRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data.expirationDates);
        if (data && data.expirationDates) {
          const datesAsDate = data.expirationDates.map((dateStr: string) => {
            return convertStringToDate(dateStr);
          });
          data.expirationDates = datesAsDate;
        }
        setEditedProduct(data);
      });
      return () => {
        off(productsRef);
      };
    }
  }, []);

  const [editedProduct, setEditedProduct] = useState<Product | null>(null);
  const [selectedDateIndex, setSelectedDateIndex] = useState<number | null>(
    null
  );

  console.log(editedProduct?.expirationDates, "editedProduct.expirationDates");

  const handleUpdateProduct = () => {
    
    const formatedExpirationDates = editedProduct?.expirationDates.map(
      (date) => {
        if (date instanceof Date) return date.toLocaleDateString();
      }
    );
    console.log(formatedExpirationDates, "formatedExpirationDates");
    if (user) {
      update(ref(db, "users/" + user.uid + "/products/" + editedProduct?.id), {
        name: editedProduct?.name,
        quantity: editedProduct?.quantity,
        expirationDates: formatedExpirationDates,
      });
    }
    router.back();
  };

  const handleDeleteDates = (id: string, index: number) => {
    if (user) {
      if (editedProduct) {
        // Supprimer la date du tableau d'expirationDates
        const updatedDates = [...editedProduct.expirationDates];
        updatedDates.splice(index, 1);

        // Mettre à jour la quantité du produit (soustraire 1)
        const updatedQuantity = String(parseInt(editedProduct.quantity) - 1);

        // Mettre à jour l'objet editedProduct avec les nouvelles données
        setEditedProduct({
          ...editedProduct,
          expirationDates: updatedDates,
          quantity: updatedQuantity,
        });

        // Supprimer la notification associée à cette date
        editedProduct.notifications.responsesByDate[index].map((notif) => {
          console.log(notif, "notif");
          Notifications.dismissNotificationAsync(notif)
            .then(() => {
              console.log("Notification dismissed successfully");
              remove(
                ref(
                  db,
                  "users/" +
                    user.uid +
                    "/products/" +
                    id +
                    "/notifications/responsesByDate/" +
                    index
                )
              );
            })
            .catch((error) => {
              console.error("Error dismissing notification:", error);
            });
        });
      }
      // Supprimer la date du Firebase
      remove(
        ref(
          db,
          "users/" + user.uid + "/products/" + id + "/expirationDates/" + index
        )
      );
    }
  };

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate: Date | undefined
  ) => {
    if (
      selectedDate !== undefined &&
      editedProduct !== null &&
      selectedDateIndex !== null
    ) {
      const newDates = [...editedProduct.expirationDates];
      newDates[selectedDateIndex] = selectedDate; // Mettez à jour la date sélectionnée
      setEditedProduct({ ...editedProduct, expirationDates: newDates });
      setSelectedDateIndex(null);
    }
  };

  const handleAddQuantity = () => {
    if (editedProduct !== null) {
      // Vérifiez si la quantité actuelle est inférieure à un maximum souhaité (par exemple, 10)
      if (parseInt(editedProduct.quantity || "0") < 20) {
        const updatedQuantity = String(
          parseInt(editedProduct.quantity || "0") + 1
        );
        setEditedProduct(
          (prevProduct) =>
            ({
              ...prevProduct,
              quantity: updatedQuantity,
            } as Product)
        ); // Utilisation de l'assertion de type
        // Ajoutez une nouvelle date (à personnaliser avec la date souhaitée)
        const newDates = [...editedProduct.expirationDates, new Date()];
        setEditedProduct(
          (prevProduct) =>
            ({
              ...prevProduct,
              expirationDates: newDates,
            } as Product)
        ); // Utilisation de l'assertion de type
      }
    }
  };

  const handleSubtractQuantity = () => {
    if (editedProduct !== null) {
      // Vérifiez si la quantité actuelle est supérieure à un minimum souhaité (par exemple, "0")
      if (
        parseInt(editedProduct.quantity || "0") > 1 &&
        editedProduct.expirationDates.length > 0
      ) {
        const updatedQuantity = String(
          parseInt(editedProduct.quantity || "0") - 1
        );
        setEditedProduct(
          (prevProduct) =>
            ({
              ...prevProduct,
              quantity: updatedQuantity,
            } as Product)
        ); // Utilisation de l'assertion de type
        // Supprimez la dernière date
        const newDates = [...editedProduct.expirationDates];
        newDates.pop();
        setEditedProduct(
          (prevProduct) =>
            ({
              ...prevProduct,
              expirationDates: newDates,
            } as Product)
        ); // Utilisation de l'assertion de type
      }
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        {editedProduct ? (
          <>
            <TextInput
              value={editedProduct.name}
              placeholder="Nom du produit"
              onChangeText={(text) =>
                setEditedProduct({ ...editedProduct, name: text })
              }
            />
            <View style={styles.quantityContainer}>
              <Button
                mode="contained"
                onPress={handleSubtractQuantity}
                style={styles.quantityButton}
              >
                -
              </Button>
              <TextInput
                value={String(editedProduct?.quantity)}
                placeholder="Quantité"
                keyboardType="numeric"
                onChangeText={(text) =>
                  setEditedProduct({ ...editedProduct, quantity: text })
                }
                style={styles.quantityInput}
                disabled
              />
              <Button
                mode="contained"
                onPress={handleAddQuantity}
                style={styles.quantityButton}
              >
                +
              </Button>
            </View>
            {editedProduct.expirationDates.map((date, index) => (
              <View key={index} style={styles.row}>
                <Text>
                  {typeof date === "string"
                    ? date 
                    : date.toLocaleDateString()}
                </Text>
                <Button
                  mode="elevated"
                  onPress={() => {
                    setSelectedDateIndex(index);
                  }}
                >
                  Modifier
                </Button>
                <Button
                  mode="elevated"
                  onPress={() => handleDeleteDates(editedProduct.id, index)}
                >
                  Supprimer
                </Button>
                {selectedDateIndex === index && (
                  <DateTimePicker
                    value={date as Date}
                    mode="date"
                    onChange={handleDateChange}
                  />
                )}
              </View>
            ))}

            <Button
              mode="elevated"
              onPress={handleUpdateProduct}
              style={styles.button}
            >
              Mettre à jour
            </Button>
          </>
        ) : (
          <Text>Loading...</Text>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: 8,
  },
  productName: {
    fontSize: 16,
  },
  productQuantity: {
    fontSize: 14,
  },
  button: {
    marginTop: 16,
  },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  quantityButton: {
    width: 40,
  },
  quantityInput: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
  },
});

export default EditProduct;
