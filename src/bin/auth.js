var admin = require("firebase-admin");

const serviceAccount = process.env.FIREBASE
admin.initializeApp({
  credential: admin.credential.cert(JSON.parse(serviceAccount)),
  databaseURL: "https://bgames-b350b-default-rtdb.firebaseio.com"
});
  
export default admin;

//https://firebase.google.com/docs/firestore/security/get-started#auth-required