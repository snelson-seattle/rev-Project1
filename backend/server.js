const express = require("express");
const routes = require("./routes");

const app = express();

// Add body parsing middleware
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// Add request routing
app.use(routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
