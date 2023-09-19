require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const routes = require("./routes");
const requestLogger = require("./middleware/logger");

const app = express();

// Add Request Logging middleware
app.use(requestLogger);

// Add cookie parsing middleware
app.use(cookieParser());

// Add body parsing middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Add request routing
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
