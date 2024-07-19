const express = require("express");
const path = require('path');
const connectDB = require("./src/config/connectDb");
const cors = require("cors");
const authRouter = require("./src/routes/authRoute");

const app = express();
const PORT = process.env.PORT || 8000;
const allowedOrigins = ["http://localhost:3000", "http://localhost:8000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Static Files from React App
app.use(express.static(path.join(__dirname, '..', 'movie-app', 'build')));

//ROUTES
app.use("/api/auth", authRouter);

// Connect to the database
connectDB()
    .then(() => {
      console.log("Ready to handle requests!");

      // All remaining requests return the React app, so it can handle routing.
      app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '..', 'movie-app', 'build', 'index.html'));
      });

      app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error("Failed to connect to the database:", err);
    });

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail",
    message: err.message,
  });
});
