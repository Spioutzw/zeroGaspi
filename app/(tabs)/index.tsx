import { StyleSheet } from "react-native";
import { Image } from "expo-image";
import { Button, Text } from "react-native-paper";
import { Link } from "expo-router";
import { View } from "../../components/Themed";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function TabOneScreen() {
  return (
      <View style={styles.container}>
        <Image
          style={styles.image}
          source={"/assets/images/logo.png"}
          alt="Logo"
          placeholder={blurhash}
        />
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <View style={styles.containerText}>
          <Text style={styles.title}>👋 Bienvenue sur zeroGaspi !</Text>
          <Text style={styles.textHome}>
            🥦 L'objectif de zeroGaspi a pour objectif de réduire le gaspillage
            alimentaire en vous aidant à gérer les produits que vous stockez
            dans votre réfrigérateur. Scannez les codes-barres de vos produits
            alimentaires et nous vous informerons avant qu'ils n'expirent !
          </Text>
          <Text style={styles.textHome}>
            🚀 Prêt à commencer ? Connectez-vous ou inscrivez-vous maintenant
            pour faire un pas de plus vers un monde sans gaspillage alimentaire
            !
          </Text>
          <Link style={styles.button} href={"/(tabs)/Login"}>
            <Button buttonColor="white" textColor="#83B39F" mode="contained">Get Starded</Button>
          </Link>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6E9047"
  },
  containerText: {
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    backgroundColor: "#6E9047"
    
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 20,
    height: 1,
    width: "80%",
  },
  image: {
    width: 200,
    height: 200,
  },
  textHome: {
    fontSize: 18,
    textAlign: "justify",
    margin: 10,
    
  },
  button:{
    margin: 10,
  }
});
