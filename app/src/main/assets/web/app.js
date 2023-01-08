// UI elements
const list_container = document.querySelector("#list-container");

// Main program
const main = () => {
  // Initialize Firebase and gets users data
  const app = firebase.initializeApp(firebaseConfig);
  const db = firebase.firestore();
  const users = firebase.firestore().collection('users');

  // Updates UI elements
  updateUI(users, list_container)

  // Update test
  // db.collection("users").add({firstName: "John", lastName: "Doe", addresses: "USA" })
}

