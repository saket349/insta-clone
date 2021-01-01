import firebase from 'firebase';
//import auth from 'firebase/app';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional

const firebaseApp = firebase.initializeApp(

    {
        apiKey: "AIzaSyAYhHfGuNhnoDejbCKwLZwsBtwyY6HOvis",
        authDomain: "instagram-clone-react-df0c7.firebaseapp.com",
        databaseURL: "https://instagram-clone-react-df0c7-default-rtdb.firebaseio.com",
        projectId: "instagram-clone-react-df0c7",
        storageBucket: "instagram-clone-react-df0c7.appspot.com",
        messagingSenderId: "41848029353",
        appId: "1:41848029353:web:76cfb9383c4635fda669b8",
        measurementId: "G-1N90HLYH3J"
      }

);

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export {db,auth,storage}