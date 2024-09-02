import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function CreatePollaScreen() {
  const [pollaName, setPollaName] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [error, setError] = useState('');

  const navigation = useNavigation();

  const handleCreatePolla = () => {
    if (!pollaName || !description || !startDate || !endDate) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    // Aquí iría la lógica para guardar la polla
    console.log('Polla creada:', {
      pollaName,
      description,
      startDate,
      endDate,
    });

    // Redirigir al usuario a la pantalla Home
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Crear Nueva Polla</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la Polla"
        value={pollaName}
        onChangeText={setPollaName}
      />
      <TextInput
        style={styles.input}
        placeholder="Descripción"
        value={description}
        onChangeText={setDescription}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha de Inicio (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Fecha de Fin (YYYY-MM-DD)"
        value={endDate}
        onChangeText={setEndDate}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleCreatePolla}>
        <Text style={styles.buttonText}>Crear Polla</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    color: '#000',
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 8,
  },
  errorText: {
    color: '#DB143C',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#DB143C',
    padding: 12,
    borderRadius: 8,
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});
