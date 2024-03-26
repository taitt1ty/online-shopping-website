import express from "express";
import connectDB from "./config/connectDB";
import http from 'http';
require('dotenv').config();
let app = express();

const server = http.createServer(app);
let port = process.env.PORT || 8888;

server.listen(port, () => {
    console.log("Backend Nodejs is running on the port: " + port)
});