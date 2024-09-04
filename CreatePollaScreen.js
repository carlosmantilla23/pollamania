import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, SafeAreaView, Image, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Importa AsyncStorage
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';

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
      <Text style={styles.title}>Crear Nueva Polla</Text>

      <Text style={styles.label}>Nombre de la Polla</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre de la Polla"
        value={pollaName}
        onChangeText={setPollaName}
      />

      <Text style={styles.label}>Liga</Text>
      <View style={styles.dropdownContainer}>
        <RNPickerSelect
          onValueChange={(value) => setSelectedLeague(value)}
          items={[
            { label: 'UEFA Champions League', value: 'UEFA Champions League' },
            { label: 'La Liga', value: 'La Liga' },
            { label: 'Premier League', value: 'Premier League' },
            { label: 'Serie A', value: 'Serie A' },
          ]}
          placeholder={{ label: 'Seleccionar Liga...', value: null }}
          style={{ inputIOS: styles.dropdown, inputAndroid: styles.dropdown, iconContainer: styles.iconContainer }}
          Icon={() => <Ionicons name="chevron-down" size={24} color="gray" />}
        />
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
  label: {
    fontSize: 12, // Tamaño pequeño
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
  dropdown: {
    height: 50,
    color: '#000',
    paddingRight: 30,
  },
  iconContainer: {
    top: 15,
    right: 10,
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
