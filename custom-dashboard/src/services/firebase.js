const {getFirestore, collection, getDoc, doc, setDoc} = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

// const db = require('../firebase/firebaseConfig');

// console.log('Database initialized:', db);
// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBAC5NTO0XHyoFbLcWwfkaeZYcaA_aVswI",
  authDomain: "magic-dossier-9b03d.firebaseapp.com",
  databaseURL: "https://magic-dossier-9b03d-default-rtdb.firebaseio.com",
  projectId: "magic-dossier-9b03d",
  storageBucket: "magic-dossier-9b03d.firebasestorage.app",
  messagingSenderId: "577437054886",
  appId: "1:577437054886:web:9ec365eae2f82b7d388167"
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getDataByThreadId(thread_id) {
    const dashboardRef = doc(db, "dashboard", thread_id);
    const dashboardDoc = await getDoc(dashboardRef);
    const existingData = dashboardDoc.data();
    const updatedDashboardData = Array.isArray(existingData.dashboardData)
        ? existingData.dashboardData
        : [];
    return updatedDashboardData;
}

async function updateDashboardData(thread_id, newData) {
  const dashboardRef = doc(db, "dashboard", thread_id);
  await setDoc(dashboardRef, { dashboardData: newData }, { merge: false });
}
module.exports = { getDataByThreadId, updateDashboardData };
