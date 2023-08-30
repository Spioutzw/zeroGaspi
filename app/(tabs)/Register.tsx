import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import React from "react";
import { GoogleSigninButton} from '@react-native-google-signin/google-signin';
import { signInWithGoogle } from "../../auth/auth";
import { useRouter } from "expo-router";
const Register = () => {
  const navigation = useRouter();

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => navigation.push("/(tabs)/FormLogin")}
      >
        Login with
      </Button>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signInWithGoogle}
      />
    </View>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
  googleButton: {
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
  facebookButton: {
    padding: 10,
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
  },
});
