// Firebase Configuration
const firebaseConfig = {
    apiKey: "YOUR-FIREBASE-API-KEY-HERE",
    authDomain: "your-project-id.firebaseapp.com",
    databaseURL: "https://your-project-id-default-rtdb.firebaseio.com",
    projectId: "your-project-id",
    storageBucket: "your-project-id.appspot.com",
    messagingSenderId: "your-messaging-sender-id",
    appId: "your-app-id"
  };
  
  // No need to modify below this line
  // This makes the config available to your HTML files
  // For older browsers without module support
  if (typeof module !== 'undefined') {
    module.exports = firebaseConfig;
  } else {
    // For direct script inclusion in browser
    var firebaseConfig = firebaseConfig;
  }