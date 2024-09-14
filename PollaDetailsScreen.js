import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, FlatList, Image, ActivityIndicator, TextInput, Alert, Keyboard, InputAccessoryView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; 
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export default function PollaDetailsScreen({ route }) {
  const { polla } = route.params;
  const [selectedOption, setSelectedOption] = useState('Pronósticos');
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [predictions, setPredictions] = useState({});
  const navigation = useNavigation();

  const API_KEY = 'a7dc71a764834be39770af7534b83db9';
  const inputAccessoryViewID = 'inputAccessoryView1';

  const inputRefs = useRef([]);

  useEffect(() => {
    const fetchUserAvatar = async () => {
      try {
        const storedAvatar = await AsyncStorage.getItem('userAvatar');
        if (storedAvatar) {
          setAvatar(storedAvatar);
        }
      } catch (error) {
        console.error('Error al recuperar el avatar:', error);
      }
    };

    fetchUserAvatar();
  }, []);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const leagueID = getLeagueID(polla.league);
        if (!leagueID) return;

        const response = await axios.get(`https://api.football-data.org/v4/competitions/${leagueID}/matches?season=2024`, {
          headers: { 'X-Auth-Token': API_KEY },
        });

        const remainingMatches = response.data.matches.filter(match => match.status !== 'FINISHED' && match.status !== 'SCHEDULED');
        setMatches(remainingMatches);
      } catch (error) {
        console.error('Error al obtener los partidos:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMatches();
  }, [polla.league]);

  const getLeagueID = (leagueName) => {
    const leagueIDs = {
      'UEFA Champions League': 2001,
      'La Liga': 2014,
      'Premier League': 2021,
      'Serie A': 2019,
    };
    return leagueIDs[leagueName];
  };

  const handlePredictionChange = (matchId, team, value) => {
    setPredictions(prevState => ({
      ...prevState,
      [matchId]: {
        ...prevState[matchId],
        [team]: value,
      },
    }));
  };

  const renderMatch = (match, index) => (
    <View key={match.id} style={styles.matchContainer}>
      <Text style={styles.matchDate}>{moment(match.utcDate).format('DD/MM/YYYY, HH:mm')}</Text>

      <View style={styles.matchRow}>
        <View style={styles.teamSection}>
          <Image source={{ uri: match.homeTeam.crest }} style={styles.teamLogoLarge} />
          <Text style={styles.teamNameLarge}>{match.homeTeam.shortName}</Text>
        </View>

        <View style={styles.scoreSection}>
          <TextInput
            style={styles.inputLarge}
            placeholder="0"
            keyboardType="numeric"
            value={predictions[match.id]?.home || ''}
            onChangeText={(value) => handlePredictionChange(match.id, 'home', value)}
            returnKeyType="next"
            ref={(el) => (inputRefs.current[index * 2] = el)}
            inputAccessoryViewID={inputAccessoryViewID}
          />
          <Text style={styles.vsTextLarge}>-</Text>
          <TextInput
            style={styles.inputLarge}
            placeholder="0"
            keyboardType="numeric"
            value={predictions[match.id]?.away || ''}
            onChangeText={(value) => handlePredictionChange(match.id, 'away', value)}
            returnKeyType={index === matches.length - 1 ? 'done' : 'next'}
            ref={(el) => (inputRefs.current[index * 2 + 1] = el)}
            inputAccessoryViewID={inputAccessoryViewID}
          />
        </View>

        <View style={styles.teamSection}>
          <Image source={{ uri: match.awayTeam.crest }} style={styles.teamLogoLarge} />
          <Text style={styles.teamNameLarge}>{match.awayTeam.shortName}</Text>
        </View>
      </View>

      {/* InputAccessoryView para cerrar el teclado solo en iOS */}
      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={inputAccessoryViewID}>
          <View style={styles.accessory}>
            <TouchableOpacity onPress={Keyboard.dismiss}>
              <Text style={styles.doneButtonText}>Cerrar Teclado</Text>
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
      )}
    </View>
  );

  const handleSavePredictions = () => {
    Alert.alert('Éxito', 'Pronósticos registrados con éxito.');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* Icono de flecha para regresar */}
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={28} color="black" />
        </TouchableOpacity>

        <View style={styles.titleContainer}>
          {polla.logo && (
            <Image source={{ uri: polla.logo }} style={styles.logo} />
          )}
          <Text style={styles.title}>{polla.pollaName}</Text>
        </View>

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="search" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatarIcon}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <Ionicons name="person-circle" size={35} color="black" />
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.toggleContainer}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedOption === 'Pronósticos' ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => setSelectedOption('Pronósticos')}
        >
          <Text style={[
            styles.toggleText,
            selectedOption === 'Pronósticos' ? styles.activeText : styles.inactiveText,
          ]}>Pronósticos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedOption === 'Clasificación' ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => setSelectedOption('Clasificación')}
        >
          <Text style={[
            styles.toggleText,
            selectedOption === 'Clasificación' ? styles.activeText : styles.inactiveText,
          ]}>Clasificación</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Cargando partidos...</Text>
        </View>
      ) : (
        selectedOption === 'Pronósticos' && (
          <FlatList
            data={matches}
            renderItem={({ item, index }) => renderMatch(item, index)}
            keyExtractor={(item) => item.id.toString()}
          />
        )
      )}

      {selectedOption === 'Pronósticos' && (
        <TouchableOpacity style={styles.saveButton} onPress={handleSavePredictions}>
          <Text style={styles.saveButtonText}>Registrar Pronósticos</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: '#f4f4f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 10,
    paddingHorizontal: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    justifyContent: 'space-between',
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 8,
    color: '#333',
  },
  logo: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
  },
  toggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    borderRadius: 20,
    padding: 2,
    marginHorizontal: 16,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#4CAF50',
  },
  inactiveButton: {
    backgroundColor: 'transparent',
  },
  toggleText: {
    fontSize: 16,
    fontWeight: '600',
  },
  activeText: {
    color: '#fff',
  },
  inactiveText: {
    color: '#808080',
  },
  matchContainer: {
    backgroundColor: '#ffffff',
    padding: 16,
    marginVertical: 8,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  matchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamSection: {
    alignItems: 'center',
    flex: 1,
  },
  teamLogoLarge: {
    width: 50,
    height: 50,
    marginTop: -10,
  },
  teamNameLarge: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputLarge: {
    width: 50,
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    textAlign: 'center',
    borderRadius: 12,
    fontSize: 18,
    backgroundColor: '#f9f9f9',
    marginHorizontal: 10,

  },
  vsTextLarge: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
  },
  matchDate: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'gray',
  },
  saveButton: {
    backgroundColor: '#DB143C',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: Platform.OS === 'android' ? 20 : 16,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  accessory: {
    backgroundColor: '#f4f4f8',
    padding: 8,
    borderTopColor: '#ddd',
    borderTopWidth: 1,
    alignItems: 'flex-end',
  },
  doneButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 10,
  },
});
