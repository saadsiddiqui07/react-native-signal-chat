import React, {useEffect, useLayoutEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Image,
  StatusBar,
} from 'react-native';
import {Input, Button} from 'react-native-elements';
import auth from '@react-native-firebase/auth';

const LoginScreen = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginUser = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User logged in successfully !!');
      })
      .catch((err) => alert(err));
  };

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((authUser) => {
      if (authUser) {
        navigation.replace('Home');
      }
    });
    return unsubscribe;
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Login',
      headerTitleStyle: {
        textAlign: 'center',
      },
    });
  }, [navigation]);

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar backgroundColor="#2C6BED" />
      <Image
        style={{height: 150, width: 150}}
        source={require('../assets/app-logo.png')}
      />
      <View style={styles.inputContainer}>
        <Input
          value={email}
          onChangeText={(text) => setEmail(text)}
          autoFocus
          type="email"
          placeholder="Email"
        />
        <Input
          value={password}
          onChangeText={(text) => setPassword(text)}
          secureTextEntry
          placeholder="Password"
        />
      </View>
      <Button
        disabled={!email || !password}
        title="Login"
        containerStyle={styles.button}
        onPress={loginUser}
      />
      <Button
        onPress={() => navigation.navigate('Register')}
        title="Register"
        type="outline"
        containerStyle={styles.button}
      />
      <View style={{height: 50}} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 200,
    margin: 5,
  },
});

export default LoginScreen;
