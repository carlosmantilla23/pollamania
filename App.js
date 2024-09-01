import React from 'react';
import { StyleSheet, Text, View, Button, Alert } from 'react-native';
import LottieView from 'lottie-react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './HomeScreen';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import ProfileScreen from './ProfileScreen';
import { auth } from './firebaseConfig';

const Stack = createStackNavigator();

function UnderConstructionScreen({ navigation }) {
  const handlePress = () => {
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      <LottieView
        source={require('./assets/underConstruction.json')}
        autoPlay
        loop
        style={styles.animation}
      />
      <Text style={styles.text}>Pollamanía es un sitio que se encuentra en construcción</Text>
      <Button title="Ok" onPress={handlePress} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="UnderConstruction">
        <Stack.Screen name="UnderConstruction" component={UnderConstructionScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Perfil' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 20,
  },
  animation: {
    width: 300,
    height: 300,
  },
  text: {
    fontSize: 22,
    fontWeight: '600',
    color: '#333',
    marginVertical: 20,
    textAlign: 'center',
    textShadowColor: '#aaa',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
    paddingHorizontal: 20,
  },
});
