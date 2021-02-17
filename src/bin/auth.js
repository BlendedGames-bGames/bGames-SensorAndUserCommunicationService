var admin = require("firebase-admin");


admin.initializeApp({
  credential: admin.credential.cert(process.env.FIREBASE)
});
  
export default admin;

//https://firebase.google.com/docs/firestore/security/get-started#auth-required