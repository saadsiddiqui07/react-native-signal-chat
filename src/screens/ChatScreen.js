import React, {useLayoutEffect, useState} from 'react';
import {
  View,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Keyboard,
} from 'react-native';
import {Avatar, Badge} from 'react-native-elements';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import firestore from '@react-native-firebase/firestore';
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';

const ChatScreen = ({route, navigation}) => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    Keyboard.dismiss();
    firestore()
      .collection('chats')
      .doc(route.params.id)
      .collection('messages')
      .add({
        message: input,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        displayName: auth().currentUser.displayName,
        email: auth().currentUser.email,
        photoURL: auth().currentUser.photoURL,
      });
    setInput('');
  };

  useLayoutEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(route.params.id)
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot((snapshot) =>
        setMessages(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          })),
        ),
      );
    return unsubscribe;
  }, [route]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Chat',
      headerBackTitleVisible: false,
      headerTitleAlign: 'left',
      headerTitle: () => (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginLeft: -20,
          }}>
          <Avatar
            rounded
            source={{
              uri:
                messages?.[0]?.photoURL ||
                'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1200px-Circle-icons-profile.svg.png',
            }}
          />

          <Badge
            status="success"
            containerStyle={{
              marginBottom: 20,
              marginLeft: -5,
              fontSize: 20,
            }}
          />
          <Text
            style={{
              color: 'white',
              marginLeft: 10,
              fontWeight: 'bold',
              fontSize: 16,
              textTransform: 'capitalize',
            }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{
            marginLeft: 10,
          }}
          onPress={() => {
            navigation.goBack();
          }}>
          <AntDesign name="arrowleft" color="white" size={24} />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: 80,
            marginRight: 20,
          }}>
          <TouchableOpacity>
            <FontAwesome name="video-camera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, messages]);

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: 'white',
      }}>
      <StatusBar backgroundColor="#2C6BED" />
      <KeyboardAvoidingView style={styles.container}>
        <>
          <ScrollView contentContainerStyle={{paddingTop: 15}}>
            {messages.map(({id, data}) =>
              data.email === auth().currentUser.email ? (
                <View id={id} key={id} style={styles.sender}>
                  <Avatar
                    size={30}
                    rounded
                    right={-5}
                    bottom={-10}
                    position="absolute"
                    source={{
                      uri: data.photoURL,
                    }}
                  />
                  <Text style={styles.senderText}>{data.message}</Text>
                </View>
              ) : (
                <View id={id} key={id} style={styles.received}>
                  <Avatar
                    size={30}
                    rounded
                    left={-5}
                    bottom={-15}
                    position="absolute"
                    source={{
                      uri: data.photoURL,
                    }}
                  />
                  <Text style={styles.receivedText}>{data.message}</Text>
                  <Text style={styles.receivedName}>{data.displayName}</Text>
                </View>
              ),
            )}
          </ScrollView>
          <View style={styles.footer}>
            <TextInput
              value={input}
              onChangeText={(text) => setInput(text)}
              placeholder="Signal Message"
              style={styles.input}
              onSubmitEditing={sendMessage}
            />
            <TouchableOpacity
              disabled={!input}
              onPress={sendMessage}
              activeOpacity={0.5}>
              <Ionicons
                name="send"
                color={!input ? 'lightgray' : '#2C6BED'}
                size={24}
              />
            </TouchableOpacity>
          </View>
        </>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 15,
  },
  input: {
    flex: 1,
    height: 50,
    bottom: 0,
    marginRight: 15,
    borderColor: 'transparent',
    borderWidth: 1,
    padding: 10,
    borderRadius: 30,
    backgroundColor: '#ECECEC',
    color: 'gray',
  },
  sender: {
    padding: 15,
    backgroundColor: '#ECECEC',
    alignSelf: 'flex-end',
    position: 'relative',
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: '80%',
  },
  senderText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 15,
    fontWeight: '500',
  },
  received: {
    padding: 15,
    backgroundColor: '#2C6BED',
    alignSelf: 'flex-start',
    position: 'relative',
    borderRadius: 20,
    marginLeft: 15,
    marginBottom: 20,
    maxWidth: '80%',
  },
  receivedText: {
    color: 'white',
    fontWeight: '500',
  },
  receivedName: {
    left: 10,
    color: 'lightgray',
    paddingRight: 10,
    fontSize: 10,
  },
});

export default ChatScreen;
