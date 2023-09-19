import { StyleSheet, View } from "react-native";
import React from "react";
import { signInWithGoogle } from "../../auth/auth";
import { Button, TextInput, Text } from "react-native-paper";
import { GoogleSigninButton } from "@react-native-google-signin/google-signin";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { FormDataLogin } from "../types/types";
import { signIn } from "../../auth/auth";
import { Stack } from "expo-router";

const schema = yup.object().shape({
  email: yup.string().email().required("l'email est requis"),
  password: yup.string().min(4).max(15).required("le mot de passe est requis"),
});

const Login = () => {
  const [error, setError] = React.useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataLogin>({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data: FormDataLogin) => {
    signIn(data.email, data.password, setError);
    setError(null);
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Connexion',
        }}
      />
      <Text variant="headlineSmall">Login</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Renseignez votre email"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.input}
          />
        )}
        name="email"
        defaultValue=""
      />
      <Text style={styles.errorInput}>{errors.email?.message}</Text>
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Renseignez votre mot de passe"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.input}
          />
        )}
        name="password"
        defaultValue=""
      />
      <Text style={styles.errorInput}>{errors.password?.message}</Text>
      <Button
        style={styles.button}
        mode="contained"
        onPress={handleSubmit(onSubmit)}
      >
        Envoyer
      </Button>

      {error && <Text style={styles.errorInput}>{error}</Text>}

      <GoogleSigninButton
        size={GoogleSigninButton.Size.Icon}
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
  button: {
    backgroundColor: "#83B39F",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    margin: 10,
    width: "70%",
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width: "70%",
  },
  errorInput: {
    color: "red",
  },
});
