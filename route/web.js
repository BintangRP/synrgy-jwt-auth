import express from "express";
import { Login, Logout, Register, getAllUsers } from "../controllers/authLoginController.js";
import { verifyToken } from "../middleware/VerifyToken.js";
import { refreshToken } from "../controllers/refreshTokenController.js";
// verifyToken
const router = express.Router();

router.get('/', () => {
    msg: "hello world"
});
router.get('/users', verifyToken, getAllUsers);
router.post('/users', Register);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);

export default router;