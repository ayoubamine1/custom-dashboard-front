const {getFirestore, collection, getDoc, doc, setDoc} = require('firebase/firestore');
const { initializeApp } = require('firebase/app');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
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
export { getDataByThreadId, updateDashboardData };
