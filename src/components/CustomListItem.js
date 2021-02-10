import React, {useState, useEffect} from 'react';
import {ListItem, Avatar} from 'react-native-elements';
import firestore from '@react-native-firebase/firestore';

const CustomListItem = ({id, enterChat, chatName}) => {
  const [chatMessages, setChatMessages] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('chats')
      .doc(id)
      .collection('messages')
      .orderBy('timestamp', 'desc')
      .onSnapshot((snapshot) =>
        setChatMessages(snapshot.docs.map((doc) => doc.data())),
      );
    return unsubscribe;
  }, []);

  return (
    <ListItem
      key={id}
      onPress={() => enterChat(id, chatName)}
      id={id}
      bottomDivider>
      <Avatar
        rounded
        source={{
          uri: chatMessages
            ? chatMessages?.[0]?.photoURL
            : 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Circle-icons-profile.svg/1200px-Circle-icons-profile.svg.png',
        }}
      />
      <ListItem.Content>
        <ListItem.Title
          style={{
            fontWeight: 'bold',
            textTransform: 'capitalize',
          }}>
          {chatName}
        </ListItem.Title>
        <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
          {chatMessages?.[0]?.displayName}: {chatMessages?.[0]?.message}
        </ListItem.Subtitle>
      </ListItem.Content>
    </ListItem>
  );
};

export default CustomListItem;
