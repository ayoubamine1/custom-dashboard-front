import { getFirestore, collection, doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
require('dotenv').config()


const BASE_API = process.env.BASE_API
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.AUTH_DOMAIN,
  databaseURL: process.env.DATABASE_URL,
  projectId: process.env.PROJECT_ID,
  storageBucket: process.env.STORAGE_BUCKET,
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Mock API logic to simulate generating dashboard data
const generateDashboardData = async (query, threadId) => {
  try {
    const response = await axios.post(`${BASE_API}/generate-graphs-data`, {
      question: query,
      thread_id: threadId
    });

    if (response.status === 200) {
      return response.data.graphs_data;
    } else {
      throw new Error(`Failed to fetch data: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error generating dashboard data:", error.message);
    throw error;
  }
  // return [
  //   {
  //     title: "Global Electric Vehicle Sales Volume (2023)",
  //     type: "bar",
  //     data: [{ year: "2023", value: 24.8 }],
  //     xAxis: "year",
  //     yAxis: "value",
  //     metadata: {
  //       unit: "million units",
  //       comment: "Total global sales volume of electric vehicles in 2023.",
  //     },
  //   },
  //   {
  //     title: "Revenue Growth Over Time",
  //     type: "line",
  //     data: [
  //       { year: "2020", value: 50 },
  //       { year: "2021", value: 75 },
  //       { year: "2022", value: 100 },
  //     ],
  //     xAxis: "year",
  //     yAxis: "value",
  //     metadata: {
  //       unit: "USD (Millions)",
  //       comment: "Revenue growth of the company from 2020 to 2022.",
  //     },
  //   },
  //   {
  //     title: "Global Electric Vehicle Sales Volume (2023)",
  //     type: "pie",
  //     data: [{ year: "2023", value: 24.8 }],
  //     xAxis: "year",
  //     yAxis: "value",
  //     metadata: {
  //       unit: "million units",
  //       comment: "Total global sales volume of electric vehicles in 2023.",
  //     },
  //   },
  // ];
};

// Handle user query
const handleQuery = async (req, res) => {
  const { query, threadId } = req.body;

  if (!query || !threadId) {
    return res.status(400).json({ error: "Query and threadId are required." });
  }

  try {
    // Simulate dashboard data generation
    const dashboardData = await generateDashboardData(query, threadId);

    // Save discussion to the 'discussions' collection with a unique ID
    const discussionsRef = collection(db, "discussions");
    const discussionId = uuidv4(); // Generate a unique ID for the discussion
    await setDoc(doc(discussionsRef, discussionId), {
      query,
      thread_id: threadId,
      timestamp: new Date(),
      dashboardData: dashboardData,
    });

    // Check and update the 'dashboard' collection
    const dashboardRef = doc(db, "dashboard", threadId);
    const dashboardDoc = await getDoc(dashboardRef);

    if (dashboardDoc.exists()) {
      // If thread exists, append to the `dashboardData` array
      const existingData = dashboardDoc.data();
      const updatedDashboardData = Array.isArray(existingData.dashboardData)
        ? [...existingData.dashboardData, ...dashboardData]
        : dashboardData;

      await updateDoc(dashboardRef, { dashboardData: updatedDashboardData });
    } else {
      // If thread doesn't exist, create a new document
      await setDoc(dashboardRef, {
        threadId,
        dashboardData: dashboardData,
      });
    }

    // Return the generated dashboard data
    res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Error handling query:", error.message);
    console.error("Stack trace:", error.stack);
    res.status(500).json({ error: "An error occurred while handling the query." });
  }
};

export { handleQuery };
