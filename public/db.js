// create variable for later use 
let db;

// 
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

request.onsuccess = function (event) {
  db = event.target.result;

  // check if app is online before reading from db
  if (navigator.onLine) {
    checkDatabase();
  }
};

request.onerror = function (event) {
  console.log("Woops! " + event.target.errorCode);
};

function saveRecord(record) {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");

  store.add(record);
}

function checkDatabase() {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending");
  const getAll = store.getAll();

  getAll.onsuccess = function () {
    if (getAll.result.length > 0) {
      fetch("/api/transaction/bulk", {
        method: "POST",
        body: JSON.stringify(getAll.result),
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json"
        }
      })
        .then(response => response.json())
        .then(() => {
          const transaction = db.transaction(["pending"], "readwrite");
          const store = transaction.objectStore("pending");
          store.clear();
        });
    }
  };
}
// function deletePending() {
//   const transaction = db.transaction(["pending"], "readwrite");
//   const store = transaction.objectStore("pending");
//   store.clear();
// }

// listen for app coming back online
window.addEventListener("online", checkDatabase);
// // creating db variable to access for later use 
// var db;

// // create a new request for a database that will be named budget 
// const request = indexedDB.open("budget", 1);

// // this event will handle the update database structure
// request.onupgradeneeded = function(event) {

// // here we create an object store named "pending" and set the autoIncrement to true
// const db = event.target.result;
// db.createObjectStore("pending", { autoIncrement: true });
// };
// // handles the success event once result of request is returned 
// request.onsuccess = function(event) {
//   db = event.target.result;

// // test to see that the app is online before reading from db
//   if (navigator.onLine) {
//     checkDatabase();
//   }
// };
// // handles the event of an error 
// request.onerror = function(event) {
//   console.log("Alert! " + event.target.errorCode);
// };

// function saveRecord(record) {
// // create a transaction on the pending db with "readwrite" access
// const transaction = db.transaction(["pending"], "readwrite");

// // access the pending object store 
// const store = transaction.objectStore("pending");

// // add a record to the store with the add method.
// store.add(record);
// }

// function checkDatabase() {
// // open the transaction on the pending db
//   const transaction = db.transaction(["pending"], "readwrite");
// // access the pending object store
//   const store = transaction.objectStore("pending");
// // get all records from store and set them to a variable
//   const getAll = store.getAll();

//   getAll.onsuccess = function() {
//     if (getAll.result.length > 0) {
//       fetch("/api/transaction/bulk", {
//         method: "POST",
//         body: JSON.stringify(getAll.result),
//         headers: {
//           Accept: "application/json, text/plain, */*",
//           "Content-Type": "application/json"
//         }
//       })
//       .then(response => response.json())
//       .then(() => {
// // if all executes successfully then open a transaction on the pending db
//         const transaction = db.transaction(["pending"], "readwrite");

// // access the pending object store
//         const store = transaction.objectStore("pending");

// // clear all items in the store
//         store.clear();
//       });
//     }
//   };
// }
// // listener event for when the application connects online 
// window.addEventListener("online", checkDatabase);

