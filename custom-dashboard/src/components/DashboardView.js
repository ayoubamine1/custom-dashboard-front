import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  ScatterChart,
  Scatter,
  AreaChart,
  Area,
  Cell,
} from "recharts";
import { Pencil, Trash2, LayoutGrid } from "lucide-react";
import "./DashboardView.css";

const getBlueGradient = (index) => {
  const blueGradient = [
    "#6366F1", // Primary blue
    "#818CF8", // Light blue
    "#A5B4FC", // Softer blue
    "#C7D2FE", // Pale blue
    "#E0E7FF", // Very light blue
  ];
  return blueGradient[index % blueGradient.length];
};



const DashboardView = ({ data, onUpdate, onDelete }) => {
  const renderChart = (chart) => {
    const { type, data: chartData, xAxis, yAxis } = chart;

    switch (type) {
      case "bar":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey={xAxis} label={{ value: xAxis, position: 'insideBottom', offset: 0 }} />
              <YAxis label={{ value: yAxis, angle: -90, position: 'insideLeft', offset: 5 }} />
              <Tooltip />
              <Bar dataKey={yAxis} fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      case "line":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey={xAxis} label={{ value: xAxis, position: 'insideBottom', offset: 0 }} />
              <YAxis label={{ value: yAxis, angle: -90, position: 'insideLeft', offset: 5 }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={yAxis}
                stroke="#6366F1"
                strokeWidth={2}
                dot={{ fill: "#6366F1", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        );
      case "pie":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey={yAxis}
                nameKey={xAxis}
                cx="50%"
                cy="50%"
                outerRadius={100}
                label
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getBlueGradient(index)} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );
      case "scatter":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey={xAxis} label={{ value: xAxis, position: 'insideBottom', offset:0 }} />
              <YAxis label={{ value: yAxis, angle: -90, position: 'insideLeft', offset:5 }} />
              <Tooltip />
              <Scatter data={chartData} fill="#6366F1" />
            </ScatterChart>
          </ResponsiveContainer>
        );
      case "area":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.1} />
              <XAxis dataKey={xAxis} label={{ value: xAxis, position: 'insideBottom', offset: -5 }} />
              <YAxis label={{ value: yAxis, angle: -90, position: 'insideLeft', offset: -5 }} />
              <Tooltip />
              <Area
                type="monotone"
                dataKey={yAxis}
                stroke="#6366F1"
                fill="#6366F1"
              />
            </AreaChart>
          </ResponsiveContainer>
        );
      case "text":
        return (
          <div
            style={{
              width: "100%",
              height: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <p>{chartData}</p>
          </div>
        );
      default:
        return <p>Unsupported chart type: {type}</p>;
    }
  };

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <LayoutGrid className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No dashboards yet
        </h3>
        <p className="text-gray-500 max-w-sm">
          Start by asking the chatbot to create a dashboard for you.
        </p>
      </div>
    );
  }

  return (
    <div className="dashboard-view p-6 space-y-6">
      {data.map((chart, index) => (
        <div
          className="dashboard-card bg-white rounded-lg shadow p-6 space-y-4"
          key={index}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-800">
              {chart.title}
            </h3>
            <div className="flex space-x-2">
              <button
                onClick={() => onUpdate(index, chart)}
                className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition"
                title="Edit Chart"
              >
                <Pencil className="w-5 h-5" />
              </button>
              <button
                onClick={() => onDelete(index)}
                className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition"
                title="Delete Chart"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="mb-6 space-y-2">
            <p className="text-sm">
              <strong>Comment:</strong>{" "}
              <span className="text-gray-600">{chart.metadata.comment}</span>
            </p>
            <p className="text-sm">
              <strong>Unit:</strong>{" "}
              <span className="text-gray-600">{chart.metadata.unit}</span>
            </p>
          </div>
          {renderChart(chart)}
        </div>
      ))}
    </div>
  );
};

export default DashboardView;
