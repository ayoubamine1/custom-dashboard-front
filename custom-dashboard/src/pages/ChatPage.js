import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import Chatbot from "../components/Chatbot";
import DashboardView from "../components/DashboardView";
import { updateDashboardData } from "../services/firebase";

const ChatPage = () => {
  const [isChatCollapsed, setIsChatCollapsed] = useState(false);
  const [dashboardData, setDashboardData] = useState([]);
  const [threadId, setThreadId] = useState(null);

  const handleGenerateDashboard = (data, threadId) => {
    setDashboardData(data);
    setThreadId(threadId);
  };

  console.log('Current threadId:', threadId);

  // Function to handle chart update
  const handleUpdate = async (index, chart) => {
    const updatedTitle = prompt("Enter a new title for the chart:", chart.title);
    const updatedXAxis = prompt("Enter a new X-axis key:", chart.xAxis);
    const updatedYAxis = prompt("Enter a new Y-axis key:", chart.yAxis);
    const updatedType = prompt("Enter a new type for the chart (line, bar, pie, scatter, area):", chart.type);
    
    if (updatedTitle || updatedXAxis || updatedYAxis) {
      const updatedData = dashboardData.map((item, idx) =>
        idx === index
          ? {
              type: updatedType !== null ? updatedType : item.type,
              title: updatedTitle !== null ? updatedTitle : item.title,
              xAxis: updatedXAxis !== null ? updatedXAxis : item.xAxis,
              yAxis: updatedYAxis !== null ? updatedYAxis : item.yAxis,
              data: item.data,
              metadata: item.metadata,
            }
          : item
      );
      
      setDashboardData(updatedData);

      // Update the document in the dashboard collection
      try {
        await updateDashboardData(threadId, updatedData);
      } catch (error) {
        console.error('Error updating dashboard:', error);
      }
    }
  };

  // Function to handle chart deletion
  const handleDelete = async (index) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chart?"
    );
    if (confirmDelete) {
      const updatedData = dashboardData.filter((_, idx) => idx !== index);
      setDashboardData(updatedData);

      // Update the document in the dashboard collection
      try {
        await updateDashboardData(threadId, updatedData);
      } catch (error) {
        console.error('Error updating dashboard:', error);
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Chatbot Panel */}
      <div
        className={`bg-white border-r border-gray-200 transition-all duration-300 flex flex-col ${
          isChatCollapsed ? "w-0 overflow-hidden" : "w-[400px]"
        }`}
      >
        {!isChatCollapsed && (
          <div className="h-full flex flex-col">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-white">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-semibold text-gray-800">
                  Dashboard Builder
                </h2>
              </div>
              <button
                onClick={() => setIsChatCollapsed(true)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Collapse sidebar"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
            </div>
            <Chatbot onGenerateDashboard={handleGenerateDashboard} />
          </div>
        )}
      </div>

      {/* Dashboard Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6">
          {isChatCollapsed && (
            <button
              onClick={() => setIsChatCollapsed(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors mr-4"
              aria-label="Expand sidebar"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          )}
          <h1 className="text-xl font-semibold text-gray-800">
            Your Dashboards
          </h1>
        </div>
        <div className="flex-1 overflow-auto">
          <DashboardView
            data={dashboardData}
            onUpdate={handleUpdate}
            onDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
