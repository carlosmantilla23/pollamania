import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { getAuth, updatePassword, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import LottieView from 'lottie-react-native'; // Importa Lottie

export default function ProfileScreen() {
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [avatar, setAvatar] = useState(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false); // Estado para manejar el spinner de carga

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const name = await AsyncStorage.getItem('userName');
        const email = await AsyncStorage.getItem('userEmail');
        const storedAvatar = await AsyncStorage.getItem('userAvatar');
        const storedAddress = await AsyncStorage.getItem('userAddress');

        if (name) setUserName(name);
        if (email) setUserEmail(email);
        if (storedAvatar) setAvatar(storedAvatar);
        if (storedAddress) setAddress(storedAddress);
      } catch (error) {
        console.error('Error al recuperar los datos del usuario:', error);
      }
    };

    fetchUserData();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Se necesita permiso para acceder a la cámara.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const selectedImageUri = result.assets[0].uri;
      setAvatar(selectedImageUri);

      // Almacena la URI de la imagen localmente
      await AsyncStorage.setItem('userAvatar', selectedImageUri);
    }
  };

  const handlePickLocation = async () => {
    try {
      setLoading(true); // Inicia el spinner de carga
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false); // Detiene el spinner si hay un error
        Alert.alert('Permiso denegado', 'Se necesita permiso para acceder a la ubicación.');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let geocode = await Location.reverseGeocodeAsync(location.coords);
      let address = `${geocode[0].street}, ${geocode[0].city}, ${geocode[0].region}, ${geocode[0].postalCode}, ${geocode[0].country}`;
      
      setAddress(address);
      await AsyncStorage.setItem('userAddress', address);

      Alert.alert('Ubicación guardada', `Dirección seleccionada: ${address}`);
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al obtener la ubicación.');
      console.error('Error al obtener la ubicación:', error);
    } finally {
      setLoading(false); // Detiene el spinner después de que la operación se completa
    }
  };

  const handleChangePassword = async () => {
    setError('');

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden. Por favor, verifica e intenta nuevamente.');
      return;
    }

    try {
      const auth = getAuth();
      const user = auth.currentUser;

      await updatePassword(user, newPassword);
      Alert.alert('Éxito', 'La contraseña ha sido actualizada correctamente.');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      setError('Hubo un problema al cambiar la contraseña. Por favor, intenta nuevamente.');
      console.error('Error al cambiar la contraseña:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      const auth = getAuth();
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', 'Hubo un problema al cerrar sesión.');
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <View style={styles.loadingContainer}>
          <LottieView
            source={require('./assets/loading.json')} // Asegúrate de que la ruta sea correcta
            autoPlay
            loop
            style={styles.loading}
          />
          <Text style={styles.loadingText}>Obteniendo dirección...</Text>
        </View>
      )}
      {!loading && (
        <>
          <Text style={styles.greeting}>Hola, {userName}</Text>
          <Text style={styles.email}>Email: {userEmail}</Text>
          <TouchableOpacity onPress={pickImage} style={styles.avatarContainer}>
            {avatar ? (
              <Image source={{ uri: avatar }} style={styles.avatar} />
            ) : (
              <Ionicons name="camera" size={50} color="gray" />
            )}
          </TouchableOpacity>

          {/* Sección de dirección */}
          <View style={styles.locationContainer}>
            <Text style={styles.addressText}>Agregar dirección</Text>
            <TouchableOpacity onPress={handlePickLocation} style={styles.locationIcon}>
              <Ionicons name="location-sharp" size={30} color="green" />
            </TouchableOpacity>
          </View>
          {address ? <Text style={styles.addressText}>Dirección: {address}</Text> : null}

          {/* Sección para cambiar la contraseña */}
          <TextInput
            style={styles.input}
            placeholder="Nueva Contraseña"
            placeholderTextColor="#aaa"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
          />
          <TextInput
            style={styles.input}
            placeholder="Repetir Nueva Contraseña"
            placeholderTextColor="#aaa"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          {error ? <Text style={styles.errorText}>{error}</Text> : null}
          <TouchableOpacity style={[styles.button, styles.changePasswordButton]} onPress={handleChangePassword}>
            <Text style={styles.changePasswordButtonText}>Cambiar Contraseña</Text>
          </TouchableOpacity>

          {/* Botón para cerrar sesión */}
          <TouchableOpacity style={styles.button} onPress={handleSignOut}>
            <Text style={styles.buttonText}>Cerrar Sesión</Text>
          </TouchableOpacity>

          {/* Label de la versión */}
          <Text style={styles.versionLabel}>Versión: beta 0.1</Text>
        </>
      )}
    </View>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    height: '100%',
  },
  loading: {
    width: 100,
    height: 100,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: 'gray',
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    paddingTop: 40,
    marginBottom: 10,
  },
  email: {
    fontSize: 18,
    color: 'gray',
    marginBottom: 30,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 20,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: 50,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addressText: {
    fontSize: 12,
    color: '#555',
    paddingBottom: 5,
    textAlign: 'center',
  },
  locationIcon: {
    marginLeft: 10,
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
  changePasswordButton: {
    backgroundColor: '#FFD900',
  },
  changePasswordButtonText: {
    color: '#454545',
    textAlign: 'center',
  },
  versionLabel: {
    marginTop: 20,
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    paddingTop: 180,
  },
});
