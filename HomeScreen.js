import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, SafeAreaView, Animated, TouchableWithoutFeedback } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
  const [selectedOption, setSelectedOption] = useState('Activas');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userAvatar, setUserAvatar] = useState(null);
  const [showTooltip, setShowTooltip] = useState(true);
  const screenWidth = Dimensions.get('window').width;
  const drawerWidth = screenWidth * 0.5;
  const animatedValue = useState(new Animated.Value(-drawerWidth))[0];
  const navigation = useNavigation();

  useFocusEffect(
    React.useCallback(() => {
      const fetchUserData = async () => {
        const name = await AsyncStorage.getItem('userName');
        const avatar = await AsyncStorage.getItem('userAvatar');
        if (name) {
          setUserName(name);
        }
        if (avatar) {
          setUserAvatar(avatar);
        }
      };

      fetchUserData();
    }, [])
  );

  useEffect(() => {
    const tooltipTimer = setTimeout(() => setShowTooltip(false), 3000); // Oculta el tooltip después de 3 segundos
    return () => clearTimeout(tooltipTimer); // Limpia el temporizador si el componente se desmonta
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

  const handleFloatingButtonPress = () => {
    setShowTooltip(false); // Oculta el tooltip si el usuario presiona el botón
    navigation.navigate('CreatePolla');
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

      {/* Tooltip temporal */}
      {showTooltip && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>Crear nueva polla</Text>
        </View>
      )}

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
    width: 80, // Ancho fijo para garantizar el centrado
    justifyContent: 'space-between', // Asegura que los íconos estén separados
  },
  avatarIcon: {
    marginLeft: 8, // Espacio entre la lupa y el avatar
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
    backgroundColor: '#DB143C', // Color del botón flotante
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
    bottom: 90, // Colocado justo encima del botón flotante
    right: 30, // Ajustado a la derecha del botón flotante
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: 8,
    borderRadius: 5,
  },
  tooltipText: {
    color: 'white',
    fontSize: 14,
  },
});
