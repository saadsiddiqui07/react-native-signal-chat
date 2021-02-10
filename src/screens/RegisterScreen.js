import React, {useState, useLayoutEffect} from 'react';
import {StyleSheet, KeyboardAvoidingView, StatusBar, View} from 'react-native';
import {Text, Input, Button} from 'react-native-elements';
import auth from '@react-native-firebase/auth';

const RegisterScreen = ({navigation}) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  const registerUser = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        console.log('User signed in successfully');
        authUser.user.updateProfile({
          displayName: name,
          photoURL: imageUrl || '../assets/user.png',
        });
        navigation.replace('Home');
      })
      .catch((err) => {
        console.log(err.message);
        alert(err);
      });
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar backgroundColor="#2C6BED" />
      <Text h4 style={{color: 'gray'}}>
        Create an account
      </Text>
      <View style={styles.inputContainer}>
        <Input
          placeholder="Full name"
          autoFocus
          autoCorrect={true}
          value={name}
          onChangeText={(text) => setName(text)}
        />
        <Input
          placeholder="Email"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
        <Input
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(text) => setPassword(text)}
        />
        <Input
          placeholder="Profile picture Url: (Optional)"
          value={imageUrl}
          onChangeText={(text) => setImageUrl(text)}
          onSubmitEditing={registerUser}
        />
      </View>
      <Button
        raised
        onPress={registerUser}
        containerStyle={styles.button}
        title="Register"
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputContainer: {
    width: 300,
  },
  button: {
    width: 200,
  },
});

export default RegisterScreen;
