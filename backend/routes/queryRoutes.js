const express = require("express");
const { handleQuery } = require("../controllers/queryController");

const router = express.Router();

// Route to handle user queries
router.post("/query", handleQuery);

module.exports = router;
