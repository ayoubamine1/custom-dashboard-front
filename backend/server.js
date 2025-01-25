const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const queryRoutes = require("./routes/queryRoutes");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api", queryRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
