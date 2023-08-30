import { StyleSheet, View } from "react-native";
import { Button } from "react-native-paper";
import React from "react";
import { signInWithGoogle } from "../../auth/auth";
import { GoogleSigninButton} from '@react-native-google-signin/google-signin';
import { useRouter } from "expo-router";
const Login = () => {
  const navigation = useRouter();

  return (
    <View style={styles.container}>
      <Button
        mode="contained"
        onPress={() => navigation.push("/(tabs)/FormLogin")}
      >
        Login with Form
      </Button>
      <GoogleSigninButton
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Dark}
        onPress={signInWithGoogle}
      />
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF",
  },
});
