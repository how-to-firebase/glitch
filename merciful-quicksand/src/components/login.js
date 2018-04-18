import React from 'react';
import Button from 'material-ui/Button';

export default function Login({ currentUser }) {
  return (currentUser 
    ? <Button className={'logoutButton'} onClick={signOut} variant="raised" >Sign Out</Button>
    : <Button id="loginButton" color="secondary" onClick={signInWithGoogle} variant="raised" >Log In With Google</Button>)
}
     
const firebase = window.firebase;
          
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithPopup(provider);
}
  
function signOut() {
  firebase.auth().signOut(); 
}