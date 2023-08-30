import React from "react";
import { useForm, Controller } from "react-hook-form";
import { ProductFormData } from "../types/types";
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  View,
  TextInput,
  Button,
  Image,
} from "react-native";



const ProductFormScreen = () => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormData>({
  });
  const onSubmit = (data:ProductFormData) => {
    console.log(data); // Les données du formulaire sont stockées dans "data"
  };

  const handleDateSelection = async () => {
    // Gérez la sélection de la date ici
  };

  const handleTakePhoto = async () => {
    // Gérez la prise de photo ici
  };

  return (
    <View>
        <Controller
      name="quantity"
      control={control}
      render={({ field: {onChange,onBlur,value} }) => (
        <TextInput
         placeholder="Quantité"
         onBlur={onBlur}
         value={value}
         onChangeText={onChange}
          />
      )}
    />
    <Controller
      name="date"
      control={control}
      render={({ field: {onChange,value} }) => (
        <DateTimePicker
          testID="dateTimePicker"
          value={new Date(value)}
          mode="datetime"
          display="default"
          onChange={onChange}
        />
      )}
      />
    </View>
  );
};

export default ProductFormScreen;
