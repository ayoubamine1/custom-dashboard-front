import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

export const sendQuery = async (query, threadId) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/query`, { query, threadId });
    return response.data; // List of dashboard data
  } catch (error) {
    console.error("Error sending query:", error);
    throw error;
  }
};
