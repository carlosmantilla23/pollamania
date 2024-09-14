import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, Dimensions } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    // Resetea el mensaje de error
    setError('');

    // Validaciones básicas antes de llamar a Firebase
    if (!name) {
      setError('Por favor, ingresa tu nombre.');
      return;
    }

    if (!email) {
      setError('Por favor, ingresa un correo electrónico.');
      return;
    }

    if (!password) {
      setError('Por favor, ingresa una contraseña.');
      return;
    }

    const auth = getAuth();
    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Almacena el nombre del usuario localmente
        await AsyncStorage.setItem('userName', name);

        navigation.replace('Home');
      })
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          setError('El correo electrónico ya está en uso.');
        } else if (error.code === 'auth/invalid-email') {
          setError('El formato del correo electrónico no es válido. Por favor, verifica que sea correcto.');
        } else if (error.code === 'auth/weak-password') {
          setError('La contraseña debe contener al menos 6 caracteres.');
        } else {
          setError('Ocurrió un error inesperado. Por favor, inténtalo de nuevo.');
        }
      });
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
      <Text style={styles.subtitle}>¡Bienvenido! Regístrate para comenzar</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre"
        placeholderTextColor="#aaa"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#aaa"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        placeholderTextColor="#aaa"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text style={styles.infoText}>
        Asegúrate de que tu contraseña tenga al menos 8 caracteres y contenga una combinación de letras, números y símbolos.
      </Text>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrarse</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
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
  subtitle: {
    fontSize: 18, // Tamaño moderado
    color: '#ccc', // Color gris claro
    marginBottom: 30,
    textAlign: 'center',
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
  infoText: {
    color: '#aaa', // Color gris claro
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 10, // Reduce el margen inferior para que el mensaje de error esté más cerca
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
