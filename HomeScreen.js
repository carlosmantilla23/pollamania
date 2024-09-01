import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const [selectedOption, setSelectedOption] = useState('Activas');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const screenWidth = Dimensions.get('window').width;
  const drawerWidth = screenWidth * 0.5;
  const animatedValue = useState(new Animated.Value(-drawerWidth))[0];
  const navigation = useNavigation(); // Hook para la navegación

  useEffect(() => {
    const fetchUserName = async () => {
      const name = await AsyncStorage.getItem('userName');
      if (name) {
        setUserName(name);
      }
    };

    fetchUserName();
  }, []);

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
          <TouchableOpacity 
            onPress={() => navigation.navigate('Profile')} // Navegación a ProfileScreen
            style={styles.avatarIcon}
          >
            <Ionicons name="person-circle" size={35} color="black" />
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

      {/* Drawer personalizado */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: animatedValue }], width: drawerWidth }]}>
        <View style={styles.drawerContent}>
          <Text style={styles.drawerText}>Bienvenido, {userName}</Text>
          <TouchableOpacity onPress={toggleMenu}>
            <Text style={styles.closeText}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
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
    width: 80, // Ancho fijo para garantizar el centrado
    justifyContent: 'space-between', // Asegura que los íconos estén separados
  },
  avatarIcon: {
    marginLeft: 8, // Espacio entre la lupa y el avatar
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
});
