import logo from './logo.svg';
import './App.css';

import {useState, useRef, useEffect} from 'react';

import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

import {useAuthState} from 'react-firebase-hooks/auth';
import {useCollectionData} from 'react-firebase-hooks/firestore';

firebase.initializeApp({
  apiKey: "AIzaSyAjlV-0tNXCGude1ABLl7LZgR0QkapyiQs",
    authDomain: "chatapp-f9604.firebaseapp.com",
    projectId: "chatapp-f9604",
    storageBucket: "chatapp-f9604.appspot.com",
    messagingSenderId: "657504072937",
    appId: "1:657504072937:web:61cde7df806c876f262c78",
    measurementId: "G-7GZ3LP2728"
})

const auth = firebase.auth();
const store = firebase.firestore();

function App() {

  const [user] = useAuthState(auth);
  
  return (
    <div className = 'App'>
      <header>
        <section>
          {user?<Chatroom/>:<Signin/>}
        </section>
      </header>
    </div>
  );
}

function Signin(){

  function signInWithGoogle(){
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
    
  }

  return(
    <button onClick={signInWithGoogle}>SIGN IN WITH GOOGLE</button>
  );
} 

function SignOut(){
  return auth.currentUser && (
    <button className= 'btn signout' onClick={() => auth.signOut()}>SIGN OUT</button>
  )
}

function Chatroom(){
  const messageRef = store.collection('messages');
  const query = messageRef.orderBy('createdAt','desc').limit(10);

  const dummy = useRef();

  const [messages] = useCollectionData(query, {idField: 'id'});

  const [formValue, setFormValue] = useState('');

  useEffect(() => 
  dummy.current.scrollIntoView({behavior:'smooth'}));

  async function sendMessage (e){
    e.preventDefault();

    const text = formValue;

    const {uid, displayName} = auth.currentUser;

    setFormValue('');

    await messageRef.add({
      text:text,
      createdAt:firebase.firestore.FieldValue.serverTimestamp(),
      uid,
      Sender:displayName
    });
    dummy.current.scrollIntoView({behavior:'smooth'});
  }

  return(
    <>
      <div className = 'container'>
        {messages && messages.slice(0).reverse().map(msg => <ChatMessage key = {msg.id} message={msg} />)}
      <div className = 'form'>
        <textarea className= 'input' id= 'msg' value = {formValue} onChange = {e => setFormValue(e.target.value)}/>
      </div>
      <button className= 'btn send' onClick = {sendMessage}>SEND</button>
      <SignOut />
      </div>
      <div ref = {dummy} onLoad={()=>
    dummy.current.scrollIntoView({behavior:'smooth'})}></div>
    </>
  );
}

function ChatMessage(props){
  const { text, uid, Sender } = props.message;

  const messageClass = uid === auth.currentUser.uid?'sent':'received';
  
  return (
    <div className = {'message'+' '+messageClass}>
      <p className = {'contact'+ ' '+messageClass}>{Sender}</p>
      <p className = 'text'>{text}</p>
    </div>
  );
}

export default App;
