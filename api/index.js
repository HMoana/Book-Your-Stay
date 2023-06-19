import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import hotelsRoute from "./routes/hotels.js";
import roomsRoute from "./routes/rooms.js";
import cookieParser from "cookie-parser";
import cors from "cors";
const app = express();
dotenv.config();

// INITIAL MONGO CONNECTION
const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGO);
        console.log("Connected to mongoDB")
      } catch (error) {
        handleError(error);
      } 
};

// IF INITIAL CONNECTION FAILS 
mongoose.connection.on("disconnected", () => {
    console.log("mongoDB disconnected!")
})

// IF INITIAL CONNECTION FAILS AND RETRIES
mongoose.connection.on("connected", () => {
    console.log("mongoDB connected!")
})

// MIDDLE WARES
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
    return res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack,
    })
});

// LISTEN PORT
const port = process.env.PORT || 8800;
app.listen(port, () => {
    connect()
    console.log(`Connected to backend on port ${port}`)
})
