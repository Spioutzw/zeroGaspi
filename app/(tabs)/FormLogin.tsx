import { StyleSheet, View } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { useForm, Controller, set } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React from "react";
import { Link, useRouter } from "expo-router";
import { FormDataLogin } from "../types/types";
import { signIn } from "../../auth/auth";

const schema = yup.object().shape({
  email: yup.string().email().required("l'email est requis"),
  password: yup.string().min(4).max(15).required("le mot de passe est requis"),
});



const FormLogin = () => {
  // form with react hook form and yup

  const [error, setError] = React.useState<string | null>(null);
  const navigation = useRouter()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataLogin>({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data: FormDataLogin) => {
    setError(null);
   
  };

  return (
    <View style={styles.container}>
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
        Submit
      </Button>

      {error && <Text style={styles.errorInput}>{error}</Text>}

      <Link style={styles.button} href={"/(tabs)/Register"}>
        Pas de compte ? Inscrivez-vous
        </Link>
    </View>

  );
};

export default FormLogin;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#6E9047",
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
