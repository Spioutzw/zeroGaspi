import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView } from "react-native";
import { Text, Button } from "react-native-paper";
import { db,auth } from "./_layout";
import { ref, onValue, off, remove } from "firebase/database";
import { Link } from "expo-router";
import * as Notifications from 'expo-notifications';
import { Product } from "../types/types";

const List: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  
  useEffect(() => {
    const user = auth.currentUser;
    console.log(user, "user");
    console.log(products, "products");

    if (user) {
      const productsRef = ref(db, "users/" + user.uid + "/products");

      const handleSnapshot = (snapshot: any) => {
        const data = snapshot.val();
        const productsList: Product[] = [];
        for (const id in data) {
          productsList.push({ id, ...data[id] });
        }
        setProducts(productsList);
      };

      const unsubscribe = onValue(productsRef, handleSnapshot);

      return () => off(productsRef, "value", unsubscribe);
    }
  }, []);

  const deleteProduct = (id: string) => {
    const user = auth.currentUser;
    if (user) {
      products.forEach((product) => {
        const { notifications } = product;
        if (notifications && notifications.responsesByDate) {
          Object.keys(notifications.responsesByDate).forEach((date) => {
            const notificationResponses = notifications.responsesByDate[date];
           
            notificationResponses.forEach((response) => {
              Notifications.dismissNotificationAsync(response).then(
                () => console.log("Notification supprimée")
              ).catch((error) => console.log(error));
            });
          });
        }
      });
  
      remove(ref(db, "users/" + user.uid + "/products/" + id));
    }
  };

  if (products && products.length > 0) {
    return (
      <ScrollView>
        <View style={styles.container}>
          {products.map((product:Product, index) => (
            <View key={index} style={styles.productItem}>
              <Text style={styles.productName}>Nom: {product.name}</Text>
              <Text style={styles.productQuantity}>Quantité: {product.quantity}</Text>
              {product.expirationDates?.map((date, index) => {
                return <Text key={index}>Date de péremption: {date as string}</Text>;
              })}
              <Link
                asChild
                href={{
                  pathname: "/pages/EditList",
                  params: { id :product.id },
                }}
                style={{width:"100%"}}
              >
                <Button mode="elevated">
                  Modifier
                </Button>
              </Link>
              <Button
                onPress={() => deleteProduct(product.id)}
                mode="elevated"
                style={styles.button}
              >
                Supprimer
              </Button>
            </View>
          ))}
        </View>
      </ScrollView>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text> Pas de produits dans le frigo </Text>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  productName: {
    fontSize: 16,
  },
  productQuantity: {
    fontSize: 14,
  },
  productItem: {
    borderBottomWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  button: {
    marginTop: 5,
  },
  // Ajoutez d'autres styles au besoin
});

export default List;
