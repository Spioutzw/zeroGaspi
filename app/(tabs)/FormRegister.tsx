import { StyleSheet, View } from "react-native";
import { Button, TextInput, Text } from "react-native-paper";
import { useForm, Controller, set } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, { useEffect } from "react";
import { FormDataRegister } from "../types/types";
import { signUp } from "../../auth/auth";
import { db } from "./_layout";
import { GoogleSigninButton} from '@react-native-google-signin/google-signin';
import { Stack } from "expo-router";


const schema = yup.object().shape({
  name: yup.string().required("le nom est requis"),
  email: yup.string().email("L'émail doit être valide").required("l'email est requis"),
  password: yup.string().min(4,"Le mot de passe doit contenir au moins 4 caracteres").max(15,"le mot de passe doit contenir 15 caracteres maximum").required("le mot de passe est requis"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "les mots de passe doivent correspondre")
    .required("la confirmation du mot de passe est requise"),
});

const FormRegister = () => {


    const [error, setError] = React.useState<string | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormDataRegister>({
    resolver: yupResolver(schema),
  });
  const onSubmit = (data: FormDataRegister) => {
    setError(null);
    signUp(data.email,data.password,data.name,setError)
    .catch(error => {
      return error
    })
       
  };

  useEffect(() => {
 console.log(db)
  },[])

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Inscription',
        }}
      />
      <Text variant="headlineSmall">Inscription</Text>
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
            placeholder="Renseignez votre nom"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.input}
          />
        )}
        name="name"
        defaultValue=""
      />
      <Text style={styles.errorInput}>{errors.name?.message}</Text>
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
      <Controller
        control={control}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Confirmez votre mot de passe"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            style={styles.input}
          />
        )}
        name="confirmPassword"
        defaultValue=""
      />
      <Text style={styles.errorInput}>{errors.confirmPassword?.message}</Text>


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
          
        />
    </View>
  );
};

export default FormRegister;

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
    margin: 5,
    borderWidth: 1,
    padding: 10,
    width: "70%",
  },
  errorInput: {
    color: "red",
  },
});
