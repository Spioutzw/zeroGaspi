import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import DateTimePicker from '@react-native-community/datetimepicker';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

type FormData = {
  quantite: string;
};

export default function QuantiteForm() {
  const { control, handleSubmit } = useForm<FormData>();
  const [dates, setDates] = useState<Date[]>([]);
  const [showPicker, setShowPicker] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPickerVisible, setIsPickerVisible] = useState(true);

  const router = useRouter();

  const handleDateChange = async (event: any, selectedDate?: Date) => {
    setIsPickerVisible(false);
    if (selectedDate) {
      const newDates = [...dates];
      newDates[currentIndex] = selectedDate;
      setDates(newDates);
      if (currentIndex < newDates.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsPickerVisible(true);
      } else {
        setShowPicker(false);
        try {
          await AsyncStorage.setItem(
            'products',
            JSON.stringify({
              products: {
                quantite: newDates.length,
                dates: newDates,
              },
            })
          );
        } catch (e) {
          console.log(e);
        }

       try{
        const jsonValue = await AsyncStorage.getItem('products');
        console.log(jsonValue);
       }
       catch(e){
        console.log(e);
       }
       
        router.push('/(tabs)/home');
    }

  };
};
  
  const onSubmit = (data: FormData) => {
    const quantite = parseInt(data.quantite, 10);
    if (!isNaN(quantite)) {
      setDates(new Array(quantite).fill(new Date()));
      setCurrentIndex(0);
      setShowPicker(true);
      setIsPickerVisible(true);
    }
  };
  


  return (
    <View>
      <Controller
        control={control}
        render={({ field: { onChange, value } }) => (
          <TextInput
            placeholder="Quantité"
            value={value}
            onChangeText={onChange}
            keyboardType="numeric"
          />
        )}
        name="quantite"
        defaultValue=""
      />
      <Button title="Soumettre" onPress={handleSubmit(onSubmit)} />
      {showPicker && isPickerVisible && (
        <DateTimePicker
          value={dates[currentIndex]}
          onChange={handleDateChange}
          mode="date"
        />
      )}
    </View>
  );
}
