import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Image, Alert, StatusBar, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons'; // Para el botón de regresar

export default function CreatePollaScreen() {
  const [pollaName, setPollaName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [selectedLeague, setSelectedLeague] = useState(null);
  const [leagueLogo, setLeagueLogo] = useState(null);
  const [error, setError] = useState('');

  const navigation = useNavigation();

  // API key de Football-data.org
  const API_KEY = 'a7dc71a764834be39770af7534b83db9';

  const leagueIDs = {
    'UEFA Champions League': 2001,
    'La Liga': 2014,
    'Premier League': 2021,
    'Serie A': 2019,
  };

  const fetchLeagueDetails = async (league) => {
    const leagueID = leagueIDs[league];
    if (!leagueID) return;

    try {
      const response = await axios.get(`https://api.football-data.org/v4/competitions/${leagueID}`, {
        headers: { 'X-Auth-Token': API_KEY },
      });

      const logoUrl = response.data.emblem || response.data.emblemUrl;
      const { startDate, endDate } = response.data.currentSeason;

      setLeagueLogo(logoUrl);
      setStartDate(startDate);
      setEndDate(endDate);

    } catch (error) {
      Alert.alert('Error', 'No se pudo obtener los detalles de la liga seleccionada.');
    }
  };

  const savePolla = async () => {
    try {
      const newPolla = {
        pollaName,
        startDate,
        endDate,
        league: selectedLeague,
        logo: leagueLogo,
      };

      const existingPollas = JSON.parse(await AsyncStorage.getItem('pollas')) || [];
      existingPollas.push(newPolla);

      await AsyncStorage.setItem('pollas', JSON.stringify(existingPollas));
    } catch (error) {
      console.error('Error al guardar la polla:', error);
    }
  };

  const handleCreatePolla = async () => {
    if (!pollaName || !startDate || !endDate || !selectedLeague) {
      setError('Todos los campos son obligatorios.');
      return;
    }

    await savePolla();
    navigation.goBack();
  };

  useEffect(() => {
    if (selectedLeague) {
      fetchLeagueDetails(selectedLeague);
    }
  }, [selectedLeague]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Ajuste para asegurar el espacio debajo de la barra de estado */}
      <StatusBar barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'} />

      {/* Encabezado con botón de regresar */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Crear Nueva Polla</Text>
      </View>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre de la Polla</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de la Polla"
          value={pollaName}
          onChangeText={setPollaName}
        />

        <Text style={styles.label}>Liga</Text>
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={selectedLeague}
            onValueChange={(value) => setSelectedLeague(value)}
          >
            <Picker.Item label="Selecciona una liga" value="" />
            <Picker.Item label="UEFA Champions League" value="UEFA Champions League" />
            <Picker.Item label="La Liga" value="La Liga" />
            <Picker.Item label="Premier League" value="Premier League" />
            <Picker.Item label="Serie A" value="Serie A" />
          </Picker>
        </View>

        {leagueLogo && (
          <View style={styles.logoContainer}>
            <Image source={{ uri: leagueLogo }} style={styles.logo} />
          </View>
        )}

        <Text style={styles.label}>Fecha de Inicio</Text>
        <TextInput style={styles.input} placeholder="Fecha de Inicio" value={startDate} editable={false} />

        <Text style={styles.label}>Fecha de Fin</Text>
        <TextInput style={styles.input} placeholder="Fecha de Fin" value={endDate} editable={false} />

        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleCreatePolla}>
          <Text style={styles.buttonText}>Crear Polla</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    paddingTop: Platform.OS === 'android' ? 30 : 0, // Ajuste para Android
    justifyContent: 'center', // Para centrar el título
  },
  backButton: {
    position: 'absolute', // Posiciona el botón de regreso absolutamente
    left: 10, // Alinea el botón de regreso a la izquierda
    paddingTop: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  formContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  label: {
    fontSize: 12,
    color: '#555',
    alignSelf: 'flex-start',
    marginLeft: '10%',
    marginBottom: 4,
  },
  input: {
    height: 50,
    borderColor: '#D3D3D3',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 12,
    color: '#000',
    width: '80%',
    backgroundColor: '#F9F9F9',
    borderRadius: 10,
  },
  dropdownContainer: {
    width: '80%',
    borderColor: '#D3D3D3',
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 12,
    paddingHorizontal: 12,
    backgroundColor: '#F9F9F9',
  },
  logoContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  logo: {
    width: 100,
    height: 100,
  },
  errorText: {
    color: '#DB143C',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#DB143C',
    padding: 14,
    borderRadius: 10,
    width: '80%',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
});