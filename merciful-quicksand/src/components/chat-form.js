import React from 'react';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

let message;
let textField

export default function ChatForm({ currentUser, room }) {   
  return (
      <form id="chatForm" onSubmit={addMessage({ currentUser, room })}>
        <TextField className={'chatInput'} onChange={e => message = e.target.value} label="Type your message here... " style={{fontSize: '1.25rem'}} />
        <Button className={'chatButton'} type="submit" label="Send" color="primary" variant="raised" >Send</Button>
      </form>
    );
}

const firebase = window.firebase;

function addMessage({ currentUser, room }) {
  const { uid, email, displayName, photoURL } = currentUser;
  return e => {
    const ref = firebase
      .database()
      .ref(`authenticated/react-chat/${room}`);
    
    e.preventDefault();
    e.target.querySelector('input').value = '';
    
    console.log('adding a message', message);
    
    ref.push({ uid, email, displayName, photoURL, message });
    return false;
  }
}