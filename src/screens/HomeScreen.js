import React, {useEffect, useLayoutEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import CustomListItem from '../components/CustomListItem';
import AntDesign from 'react-native-vector-icons/AntDesign';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const HomeScreen = ({navigation}) => {
  const [chats, setChats] = useState([]);

  const signOutUser = () => {
    auth()
      .signOut()
      .then(() => {
        navigation.replace('Login');
      });
  };

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) =>
        setChats(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            data: doc.data(),
          })),
        ),
      );
    return unsubscribe;
  }, [navigation]);

  // SCREEN SETTINGS
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Signal',
      headerStyle: {
        backgroundColor: 'white',
      },
      headerTitleStyle: {
        color: 'black',
      },
      headerTintColor: 'black',
      headerTitleAlign: 'center',
      headerLeft: () => (
        <View style={{marginLeft: 10}}>
          <TouchableOpacity onPress={signOutUser}>
            <Avatar
              rounded
              source={{
                uri: auth()?.currentUser?.photoURL,
              }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: 'row',
            width: 80,
            justifyContent: 'space-around',
            marginRight: 10,
          }}>
          <TouchableOpacity style={styles.camera} activeOpacity={0.5}>
            <AntDesign name="camerao" size={24} color="black" />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.pencil}
            onPress={() => navigation.navigate('AddChat')}
            activeOpacity={0.5}>
            <SimpleLineIcons name="pencil" size={24} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const enterChat = (id, chatName) => {
    navigation.navigate('Chat', {
      id: id,
      chatName: chatName,
    });
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {chats.map(({id, data: {chatName}}) => (
        <CustomListItem
          id={id}
          key={id}
          enterChat={enterChat}
          chatName={chatName}
        />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
  },
  camera: {
    padding: 10,
    backgroundColor: 'lightgray',
    borderRadius: 999,
    marginRight: 10,
  },
  pencil: {
    padding: 10,
    backgroundColor: 'lightgray',
    borderRadius: 999,
  },
});

export default HomeScreen;
