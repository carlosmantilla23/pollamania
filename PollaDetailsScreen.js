import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, FlatList, Image, ActivityIndicator } from 'react-native';
import { Ionicons } from 'react-native-vector-icons';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import moment from 'moment';

export default function PollaDetailsScreen({ route }) {
  const { polla } = route.params;
  const [selectedOption, setSelectedOption] = useState('Pronósticos');
  const [matches, setMatches] = useState([]); // Estado para almacenar los partidos
  const [groupedMatches, setGroupedMatches] = useState({}); // Estado para los partidos agrupados por fecha
  const [loading, setLoading] = useState(true); // Estado para manejar el spinner de carga
  const [avatar, setAvatar] = useState(null); // Estado para el avatar del usuario
  const navigation = useNavigation();

  // Clave de la API
  const API_KEY = 'a7dc71a764834be39770af7534b83db9';

  useEffect(() => {
    // Recuperar el avatar del usuario desde AsyncStorage
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
        setLoading(true); // Inicia el spinner
        const leagueID = getLeagueID(polla.league);
        if (!leagueID) return;

        const response = await axios.get(`https://api.football-data.org/v4/competitions/${leagueID}/matches?season=2024`, {
          headers: { 'X-Auth-Token': API_KEY },
        });

        // Filtrar partidos que no estén en estado 'FINISHED' ni 'SCHEDULED'
        const remainingMatches = response.data.matches.filter(match => match.status !== 'FINISHED' && match.status !== 'SCHEDULED');
        setMatches(remainingMatches);

        // Agrupar partidos por fecha
        const grouped = groupMatchesByDate(remainingMatches);
        setGroupedMatches(grouped);
      } catch (error) {
        console.error('Error al obtener los partidos:', error);
      } finally {
        setLoading(false); // Detiene el spinner
      }
    };

    fetchMatches();
  }, [polla.league]);

  // Función para agrupar partidos por fecha
  const groupMatchesByDate = (matches) => {
    return matches.reduce((groups, match) => {
      const date = moment(match.utcDate).format('DD/MM/YYYY');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(match);
      return groups;
    }, {});
  };

  const getLeagueID = (leagueName) => {
    const leagueIDs = {
      'UEFA Champions League': 2001,
      'La Liga': 2014,
      'Premier League': 2021,
      'Serie A': 2019,
    };
    return leagueIDs[leagueName];
  };

  const renderMatch = (match) => (
    <View key={match.id} style={styles.matchContainer}>
      <View style={styles.teamContainer}>
        <Image source={{ uri: match.homeTeam.crest }} style={styles.teamLogo} />
        <Text style={styles.teamName}>{match.homeTeam.shortName}</Text>
      </View>
      <Text style={styles.vsText}>vs</Text>
      <View style={styles.teamContainer}>
        <Image source={{ uri: match.awayTeam.crest }} style={styles.teamLogo} />
        <Text style={styles.teamName}>{match.awayTeam.shortName}</Text>
      </View>
      <Text style={styles.matchDate}>Hora: {moment(match.utcDate).format('HH:mm')}</Text>
    </View>
  );

  const renderGroupedMatches = ({ item: date }) => (
    <View key={date}>
      <Text style={styles.dateHeader}>Fecha: {date}</Text>
      {groupedMatches[date].map((match) => renderMatch(match))}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <TouchableOpacity>
            <Ionicons name="menu" size={28} color="black" />
          </TouchableOpacity>
        </View>

        <View style={styles.titleContainer}>
          {polla.logo && (
            <Image source={{ uri: polla.logo }} style={styles.logo} />
          )}
          <Text style={styles.title}>{polla.pollaName}</Text>
        </View>

        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => {/* Acción para la lupa */}}>
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
            data={Object.keys(groupedMatches)} // Las fechas agrupadas son las claves
            renderItem={renderGroupedMatches}
            keyExtractor={(item) => item} // Clave única para las fechas
          />
        )
      )}

      {selectedOption === 'Clasificación' && (
        <Text>Clasificación de los usuarios</Text>
      )}
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
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 8,
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
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  teamContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  teamLogo: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    flexShrink: 1, // Ajuste para que los nombres largos no rompan el diseño
  },
  vsText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  matchDate: {
    fontSize: 14,
    color: '#555',
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
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
});
