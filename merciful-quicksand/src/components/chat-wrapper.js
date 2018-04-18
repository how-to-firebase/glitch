import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

import ChatList from './chat-list';
import ChatForm from './chat-form';
import Login from './login';


const firebase = window.firebase;

export default class ChatWrapper extends React.Component {
  constructor(props) {
    super(props);
    
    const room = 'Default Chat Room';
    
    this.state = {
      currentUser: null,
      room,
      messages: []
    };
    
    this.messagesQuery = firebase
      .database()
      .ref(`authenticated/react-chat/${room}`)
      .limitToLast(50);
  }
  
  componentWillMount() {
    firebase.auth().onAuthStateChanged(currentUser => {
      this.setState({ currentUser });
      
      if (!currentUser) {
        this.stopListeningToMessages();
      } else {
        this.listenToMessages();
      }
    });
  }
  
  listenToMessages() {
    this.messagesHandler = this.messagesQuery.on('child_added', snapshot => {
      const message = snapshot.val();
      console.log('message received', message);
      const messages = this.state.messages.slice(0);
      messages.push(message);
      this.setState({ messages });
    });
  }
  
  stopListeningToMessages() {
    if (this.messagesHandler) {
      this.setState({ messages: [] });
      this.messagesQuery.off('child_added', this.messagesHandler); 
    }
  }
  
  render() {
   return (
       <div id="chatWrapper">
         {this.state.currentUser && <Login currentUser={this.state.currentUser} />}
           
         <Paper id="chatPaper"  ref={ref => this.chatPaper = ref}>
           {this.state.currentUser ?
             [
               <ChatList key="chat list" {...this.state} />,
               <Divider key="divider" />,
               <ChatForm key="chat form" currentUser={this.state.currentUser} room={this.state.room} />
             ]
           : <Login />
           }
         </Paper>
       </div>
     );
   }
}