import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    // Resetea el mensaje de error
    setError('');

    // Validaciones básicas antes de llamar a Firebase
    if (!email) {
      setError('Por favor, ingresa un correo electrónico.');
      return;
    }

    if (!password) {
      setError('Por favor, ingresa una contraseña.');
      return;
    }

    const auth = getAuth();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Almacenar el correo electrónico en AsyncStorage
      await AsyncStorage.setItem('userEmail', user.email);

      // Navegar a la pantalla Home
      navigation.replace('Home');
    } catch (error) {
      // Manejo de errores específicos de Firebase
      if (error.code === 'auth/invalid-email') {
        setError('El formato del correo electrónico no es válido. Por favor, verifica que sea correcto.');
      } else if (error.code === 'auth/user-disabled') {
        setError('Esta cuenta ha sido deshabilitada. Contacta con soporte para más información.');
      } else if (error.code === 'auth/user-not-found') {
        setError('No se encontró ninguna cuenta con este correo electrónico.');
      } else if (error.code === 'auth/wrong-password') {
        setError('La contraseña es incorrecta. Por favor, intenta nuevamente.');
      } else {
        setError(error.message);
      }
    }
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('./assets/logotipo.json')}
        autoPlay
        loop
        style={styles.logo}
      />
      <Text style={styles.title}>POLLAMANÍA</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Iniciar Sesión</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.linkText}>¿No tienes cuenta? Regístrate</Text>
      </TouchableOpacity>
    </View>
  );
}

const { height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Fondo negro
    padding: 16,
  },
  logo: {
    width: '100%',
    height: height * 0.15, // Ocupa el 15% de la pantalla en altura, más pequeño
    marginBottom: 20,
  },
  title: {
    fontSize: 32, // Tamaño grande
    fontWeight: 'bold', // Negrita
    color: '#fff', // Color blanco
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#555',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    color: '#000', // Color de texto negro para contraste con el fondo blanco
    width: '100%',
    backgroundColor: '#fff', // Fondo blanco
    borderRadius: 8, // Bordes ligeramente curvados
  },
  errorText: {
    color: '#DB143C', // Color rojo para el mensaje de error
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20, // Espacio debajo del mensaje de error
  },
  button: {
    backgroundColor: '#DB143C', // Color rojo
    padding: 12,
    borderRadius: 8, // Mismo bordeado que los cuadros de texto
    width: '100%',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 16,
  },
  linkText: {
    color: '#fff', // Color blanco
    textAlign: 'center',
    marginTop: 16,
    fontSize: 17, // Aumentado un punto
  },
});
