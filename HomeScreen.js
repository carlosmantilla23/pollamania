import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, SafeAreaView, Animated, TouchableWithoutFeedback, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import LottieView from 'lottie-react-native'; // Importa LottieView
import moment from 'moment'; // Para manejar fechas

export default function HomeScreen() {
  const [selectedOption, setSelectedOption] = useState('Activas');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState(null);
  const [pollas, setPollas] = useState([]); // Estado para las pollas
  const screenWidth = Dimensions.get('window').width;
  const drawerWidth = screenWidth * 0.5;
  const animatedValue = useState(new Animated.Value(-drawerWidth))[0];
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        const name = await AsyncStorage.getItem('userName');
        const avatar = await AsyncStorage.getItem('userAvatar');
        const storedPollas = JSON.parse(await AsyncStorage.getItem('pollas')) || [];

        if (name) setUserName(name);
        if (avatar) setUserAvatar(avatar);
        setPollas(storedPollas); // Carga las pollas desde AsyncStorage
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

  // Función para obtener las pollas filtradas según la opción seleccionada (Activas o Finalizadas)
  const getFilteredPollas = () => {
    const today = moment(); // Fecha actual

    if (selectedOption === 'Activas') {
      return pollas.filter(polla => moment(polla.endDate).isSameOrAfter(today)); // Pollas cuya fecha de fin es mayor o igual a la fecha actual
    } else if (selectedOption === 'Finalizadas') {
      return pollas.filter(polla => moment(polla.endDate).isBefore(today)); // Pollas cuya fecha de fin es anterior a la fecha actual
    }
    return pollas;
  };

  const renderPolla = ({ item, index }) => (
    <View style={styles.pollaContainer}>
      <Image source={{ uri: item.logo }} style={styles.logo} />
      <View style={styles.pollaDetails}>
        <Text style={styles.pollaName}>{item.pollaName || 'Nombre no disponible'}</Text>
        <Text style={styles.pollaDate}>Inicio: {item.startDate || 'Fecha no disponible'}</Text>
        <Text style={styles.pollaDate}>Fin: {item.endDate || 'Fecha no disponible'}</Text>
      </View>
      <TouchableOpacity onPress={() => deletePolla(index)}>
        <Ionicons name="trash" size={28} color="red" />
      </TouchableOpacity>
    </View>
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

      {/* Mostrar animación si no hay pollas activas */}
      {getFilteredPollas().length === 0 ? (
        selectedOption === 'Activas' ? (
          <View style={styles.emptyContainer}>
            <LottieView
              source={require('./assets/sad.json')} // Ruta al archivo sad.json
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

      {/* Overlay para cerrar el drawer */}
      {isMenuOpen && (
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      {/* Drawer personalizado */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: animatedValue }], width: drawerWidth }]}>
        <View style={styles.drawerContent}>
          <Text style={styles.drawerText}>Bienvenido, {userName}</Text>
          <TouchableOpacity onPress={toggleMenu}>
            <Text style={styles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Tooltip siempre visible */}
      <View style={styles.tooltip}>
        <Text style={styles.tooltipText}>Crear nueva polla</Text>
      </View>

      {/* Botón flotante */}
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