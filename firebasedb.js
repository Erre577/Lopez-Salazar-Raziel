import firebase from 'firebase';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyCcvZSzTOy0KH-48dq3JLmqv9IqQM5SjU0",
    authDomain: "pw602-d587e.firebaseapp.com",
    databaseURL: "https://pw602-d587e.firebaseio.com",
    projectId: "pw602-d587e",
    storageBucket: "pw602-d587e.appspot.com",
    messagingSenderId: "1060222146801",
    appId: "1:1060222146801:web:08dd4d062c2c0742f53150",
    measurementId: "G-L3HDSLP178"
};
firebase.initializeApp(config);


export default firebase;