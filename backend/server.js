const express = require("express");
const routes = require("./routes");
const requestLogger = require("./middleware/logger");

const app = express();

// Add Request Logging middleware
app.use(requestLogger);

// Add body parsing middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Add request routing
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
