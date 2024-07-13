const express = require("express");
const connectDB = require("./src/config/connectDb");
const cors = require("cors");
const authRouter = require("./src/routes/authRoute");

const app = express();
const PORT = process.env.PORT || 8000;
const allowedOrigins = ["http://localhost:3000", "http://localhost:8000"];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Allow the origin in the response if it's in the allowed list
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//ROUTES
app.use("/api/auth", authRouter);

// Connect to the database
connectDB()
  .then(() => {
    console.log("Ready to handle requests!");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to the database:", err);
  });

// Error-handling middleware
app.use((err, req, res, next) => {
  // Log the error internally
  console.error(err);

  // Use the statusCode from the error if it exists, otherwise default to 500
  const statusCode = err.statusCode || 500;

  // Send the error message back to the client
  res.status(statusCode).json({
    status: statusCode >= 500 ? "error" : "fail", // 'error' for server errors, 'fail' for client errors
    message: err.message,
  });
});
