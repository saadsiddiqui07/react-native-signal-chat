import React, {useLayoutEffect, useState} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import {Button, Icon, Input} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';

const AddChatScreen = ({navigation}) => {
  const [input, setInput] = useState('');

  const createNewChat = () => {
    firestore()
      .collection('chats')
      .add({
        chatName: input,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        navigation.goBack();
      })
      .catch((err) => alert(err.message));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Add a new chat',
      headerTitleAlign: 'center',
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#2C6BED" />
      <Input
        placeholder="Enter new chat name"
        value={input}
        onChangeText={(text) => setInput(text)}
        leftIcon={
          <Icon type="antdesign" name="wechat" size={25} color="#2C6BED" />
        }
      />
      <Button
        disabled={!input}
        title="Create new chat"
        onPress={createNewChat}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
});

export default AddChatScreen;
