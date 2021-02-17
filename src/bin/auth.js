var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
  
export default admin;

//https://firebase.google.com/docs/firestore/security/get-started#auth-required