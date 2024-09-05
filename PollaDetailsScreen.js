import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PollaDetailsScreen({ route }) {
  const { polla } = route.params;
  const [selectedOption, setSelectedOption] = useState('Pronósticos');
  const [userAvatar, setUserAvatar] = useState(null); // Agregamos el estado para el avatar
  const navigation = useNavigation();

  // Cargar el avatar almacenado en AsyncStorage
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedAvatar = await AsyncStorage.getItem('userAvatar');
        if (storedAvatar) setUserAvatar(storedAvatar); // Establecer el avatar si está disponible
      } catch (error) {
        console.error('Error al recuperar el avatar del usuario:', error);
      }
    };
    fetchUserData();
  }, []);

  const toggleMenu = () => {
    // Lógica para abrir/cerrar el menú hamburguesa
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <TouchableOpacity onPress={toggleMenu}>
            <Ionicons name="menu" size={28} color="black" />
          </TouchableOpacity>
        </View>

        {/* Aquí añadimos el logo de la polla junto al nombre */}
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

          {/* Mostramos el avatar o un ícono predeterminado si no hay avatar */}
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

      {/* Aquí puedes añadir el contenido de la pantalla basado en la opción seleccionada */}
      {selectedOption === 'Pronósticos' ? (
        <Text>Registrar marcadores de partidos</Text>
      ) : (
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
    flex: 1, // Ajusta el tamaño para que ocupe el espacio restante
    justifyContent: 'center', // Centra el logo y el título
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginLeft: 8, // Agrega un pequeño espacio entre el logo y el título
  },
  logo: {
    width: 30, // Tamaño pequeño del logo
    height: 30,
    borderRadius: 15,
  },
  avatarIcon: {
    marginLeft: 8,
  },
  avatar: {
    width: 35, // Asegúrate de que el avatar tenga un tamaño adecuado
    height: 35,
    borderRadius: 50,
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
});
