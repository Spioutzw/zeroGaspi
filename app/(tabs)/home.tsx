import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { StyleSheet, View, Text, TextInput, Button, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ProductFormData } from '../types/types';

const Home = () => {
  const navigation = useRouter();
  const { control, handleSubmit, setValue } = useForm<ProductFormData>();
  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const handleScanPress = () => {
    navigation.push('/(tabs)/ScanCode');
  };

  const showDatepicker = () => {
    setShow(true);
  };

  const onSubmit = (data:ProductFormData) => {
    console.log(data);
    // Ajouter le produit manuellement
    // ...
  };

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>
        Pour ajouter un produit, scannez-le ou ajoutez-le manuellement en remplissant le formulaire ci-dessous.
      </Text>

      <Controller
        name="name"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Nom du produit"
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      <Controller
        name="quantity"
        control={control}
        defaultValue=""
        render={({ field: { onChange, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Quantité"
            onChangeText={onChange}
            value={value}
            
          />
        )}
      />
      <Controller
        name="date"
        control={control}
        defaultValue={date}
        render={({ field: { onChange, value } }) => (
          <View>
            <Button title="Sélectionner la date de péremption" onPress={showDatepicker} />
            {show && (
              <DateTimePicker
                testID="dateTimePicker"
                value={new Date(value)}
                mode="date"
                display="default"
                onChange={onChange}
              />
            )}
          </View>
        )}
      />
      <Button title="Ajouter le produit" onPress={handleSubmit(onSubmit)} />
      <Button title="Scanner le produit" onPress={handleScanPress} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  instructions: {
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingLeft: 8,
  },
});

export default Home;
