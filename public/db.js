// create empty variable for later use 
let db;

// create a new request for a database that will be named budget 
const request = indexedDB.open("budget", 1);

// function for the onupgradeneeded event which will handle the update database structure
request.onupgradeneeded = function (event) {
  const db = event.target.result;
  db.createObjectStore("pending", { autoIncrement: true });
};

// function for the onsuccess event -- handles the event once result of request is returned 
request.onsuccess = function (event) {
  db = event.target.result;

// confirm that the app is active prior to reading db
  if (navigator.onLine) {
    checkDatabase();
  }
};

// function to handle event of an error 
request.onerror = function (event) {
  console.log("Woops! " + event.target.errorCode);
};
// function to save to database and then create a transaction on the pending db with "readwrite" access
function saveRecord(record) {
  const transaction = db.transaction(["pending"], "readwrite");
  const store = transaction.objectStore("pending"); // access the pending object store 

  store.add(record); // add record to the store 
}
// function to check database 
function checkDatabase() {
  const transaction = db.transaction(["pending"], "readwrite"); // opening transaction on pending db 
  const store = transaction.objectStore("pending"); // accessing pending object 
  const getAll = store.getAll(); // getting all records from store and saving to getAll variable 

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
          const transaction = db.transaction(["pending"], "readwrite"); // opening transaction on pending db
          const store = transaction.objectStore("pending"); // access pending object 
          store.clear(); // clear all items in store 
        });
    }
  };
}

