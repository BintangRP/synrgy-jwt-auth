import express from "express";
import { db } from "./database/db.js";
import router from "./route/web.js";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from 'cors';
// cookieParser
// import Users from "./models/loginModel.js";
// router
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(router);
app.use(cookieParser());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));

try {
    await db.authenticate();
    console.log('DB Connected...');
    // await Users.sync();
} catch (error) {
    console.log(error.message);
}

app.listen(PORT, () => {
    console.log(`Server is on http://localhost:${PORT}`);
})