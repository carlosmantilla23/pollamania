import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, SafeAreaView, Animated, TouchableWithoutFeedback, FlatList, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native';
import moment from 'moment';
import { collection, onSnapshot } from 'firebase/firestore'; 
import { firestore } from './firebaseConfig'; 

export default function HomeScreen() {
  const [selectedOption, setSelectedOption] = useState('Activas');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState(null);
  const [pollas, setPollas] = useState([]); 
  const screenWidth = Dimensions.get('window').width;
  const drawerWidth = screenWidth * 0.5;
  const animatedValue = useState(new Animated.Value(-drawerWidth))[0];
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        try {
          const name = await AsyncStorage.getItem('userName');
          const avatar = await AsyncStorage.getItem('userAvatar');
          
          // Usar onSnapshot para escuchar cambios en tiempo real en la colección "pollas"
          const unsubscribe = onSnapshot(collection(firestore, 'pollas'), (querySnapshot) => {
            const storedPollas = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setPollas(storedPollas); // Actualiza las pollas en tiempo real
          });

          if (name) setUserName(name);
          if (avatar) setUserAvatar(avatar);

          // Devolver la función de "desuscripción" cuando el componente se desmonte
          return () => unsubscribe();
        } catch (error) {
          console.error('Error al obtener los datos:', error);
        }
      };

      fetchUserData();
    }, [])
  );

  const deletePolla = async (index) => {
    const updatedPollas = [...pollas];
    updatedPollas.splice(index, 1);
    setPollas(updatedPollas);
    await AsyncStorage.setItem('pollas', JSON.stringify(updatedPollas));
  };

  const handleSelectPolla = (item) => {
    const fetchAvatar = async () => {
      const avatar = await AsyncStorage.getItem('userAvatar');
      navigation.navigate('PollaDetails', { polla: item, avatar });
    };
    fetchAvatar();
  };

  const handleSharePolla = async (polla) => {
    try {
      const result = await Share.share({
        message: `¡Participa en mi polla de fútbol "${polla.pollaName}" en ${polla.league}! Comienza el ${polla.startDate} y finaliza el ${polla.endDate}.`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // Compartido con una actividad específica
        } else {
          // Compartido
        }
      } else if (result.action === Share.dismissedAction) {
        // Cancelado
      }
    } catch (error) {
      alert('Error al compartir la polla: ' + error.message);
    }
  };

  const toggleMenu = () => {
    if (isMenuOpen) {
      Animated.timing(animatedValue, {
        toValue: -drawerWidth,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setIsMenuOpen(false));
    } else {
      setIsMenuOpen(true);
      Animated.timing(animatedValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleFloatingButtonPress = () => {
    navigation.navigate('CreatePolla');
  };

  const getFilteredPollas = () => {
    const today = moment();
    if (selectedOption === 'Activas') {
      return pollas.filter(polla => moment(polla.endDate).isSameOrAfter(today));
    } else if (selectedOption === 'Finalizadas') {
      return pollas.filter(polla => moment(polla.endDate).isBefore(today));
    }
    return pollas;
  };

  const renderPolla = ({ item, index }) => (
    <TouchableOpacity onPress={() => handleSelectPolla(item)} style={styles.pollaContainer}>
      <Image source={{ uri: item.logo }} style={styles.logo} />
      <View style={styles.pollaDetails}>
        <Text style={styles.pollaName}>{item.pollaName || 'Nombre no disponible'}</Text>
        <Text style={styles.pollaDate}>Inicio: {item.startDate || 'Fecha no disponible'}</Text>
        <Text style={styles.pollaDate}>Fin: {item.endDate || 'Fecha no disponible'}</Text>
      </View>
      <View style={styles.iconActions}>
        <TouchableOpacity onPress={() => handleSharePolla(item)}>
          <Ionicons name="share-social" size={28} color="blue" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => deletePolla(index)}>
          <Ionicons name="trash" size={28} color="red" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={toggleMenu}>
            <Ionicons name="menu" size={28} color="black" />
          </TouchableOpacity>
        </View>
        <Text style={styles.title}>Mis Pollas</Text>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={() => {/* Acción para la lupa */}}>
            <Ionicons name="search" size={28} color="black" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.avatarIcon}>
            {userAvatar ? (
              <Image source={{ uri: userAvatar }} style={styles.avatar} />
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
            selectedOption === 'Activas' ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => setSelectedOption('Activas')}
        >
          <Text style={[
            styles.toggleText,
            selectedOption === 'Activas' ? styles.activeText : styles.inactiveText,
          ]}>Activas</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            selectedOption === 'Finalizadas' ? styles.activeButton : styles.inactiveButton,
          ]}
          onPress={() => setSelectedOption('Finalizadas')}
        >
          <Text style={[
            styles.toggleText,
            selectedOption === 'Finalizadas' ? styles.activeText : styles.inactiveText,
          ]}>Finalizadas</Text>
        </TouchableOpacity>
      </View>

      {getFilteredPollas().length === 0 ? (
        selectedOption === 'Activas' ? (
          <View style={styles.emptyContainer}>
            <LottieView
              source={require('./assets/sad.json')} 
              autoPlay
              loop
              style={styles.animation}
            />
            <Text style={styles.noPollasText}>No tienes pollas activas.</Text>
          </View>
        ) : (
          <Text style={styles.noPollasText}>No hay pollas finalizadas.</Text>
        )
      ) : (
        <FlatList
          data={getFilteredPollas()}
          renderItem={renderPolla}
          keyExtractor={(item, index) => index.toString()}
        />
      )}

      {isMenuOpen && (
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <Animated.View style={[styles.drawer, { transform: [{ translateX: animatedValue }], width: drawerWidth }]}>
        <View style={styles.drawerContent}>
          <Text style={styles.drawerText}>Bienvenido, {userName}</Text>
          <TouchableOpacity onPress={toggleMenu}>
            <Text style={styles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      <View style={styles.tooltip}>
        <Text style={styles.tooltipText}>Crear nueva polla</Text>
      </View>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={handleFloatingButtonPress}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
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
  avatarIcon: {
    marginLeft: 8,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 50,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
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
  noPollasText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color: '#888',
  },
  pollaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
    padding: 15,
    borderRadius: 10,
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 15,
  },
  pollaDetails: {
    flex: 1,
  },
  pollaName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  pollaDate: {
    fontSize: 16,
    color: '#555',
  },
  iconActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
    zIndex: 1000,
  },
  drawerContent: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  drawerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeText: {
    fontSize: 16,
    color: '#1976d2',
  },
  floatingButton: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#DB143C',
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tooltip: {
    position: 'absolute',
    bottom: 90,
    right: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 5,
  },
  tooltipText: {
    color: 'white',
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animation: {
    width: 200,
    height: 200,
  },
});
