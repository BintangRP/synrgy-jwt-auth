import Users from "../models/loginModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async (req, res) => {
    try {
        // console.log(req.cookies.refreshToken);
        const refreshToken = req.body.refreshToken;
        if (!refreshToken) return res.sendStatus(401); //unauthorize

        const user = await Users.findAll({
            where: {
                refresh_token: refreshToken
            }
        });
        if (!user[0]) return res.sendStatus(403); // forbidden
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, decoded) => {
            if (error) return res.sendStatus(403);
            const userId = user[0].id;
            const name = user[0].name;
            const email = user[0].email;
            const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '1d'
            });
            res.json({ accessToken });
        });
    } catch (error) {
        console.log(error.message);
    }
}