import jwt from "jsonwebtoken";
import Users from "../models/loginModel.js";
import bcrypt from "bcrypt";


export const getAllUsers = async (req, res) => {
    try {
        const users = await Users.findAll();
        res.json({ users })
    } catch (error) {
        console.log(error.message);
    }
};

export const Register = async (req, res) => {
    try {
        const { name, email, password, confPassword } = req.body;
        if (password != confPassword) return res.status(400).json({ message: "Password tidak sesuai" });
        const salt = await bcrypt.genSaltSync();
        const hashPassword = await bcrypt.hashSync(password, salt);
        try {
            const data = await Users.create({
                name: name,
                email: email,
                password: hashPassword
            });
            res.json({
                msg: "Register successfully...",
                data: data,
            })
        } catch (error) {
            console.log(error.message);
        }
    } catch (error) {
        console.log(error.message);
    }
};

export const Login = async (req, res) => {
    try {
        const user = await Users.findAll({
            where: {
                email: req.body.email
            }
        });

        const match = await bcrypt.compare(req.body.password, user[0].password);
        if (!match) return res.status(400).json({ msg: "Wrong password.." })

        const userId = user[0].id;
        const name = user[0].name;
        const email = user[0].email;
        const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '1d'
        })
        const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });
        await Users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
        })
        res.json({ accessToken });

    } catch (error) {
        res.status(404).json({ msg: "Email not found.." })
    }
}

export const Logout = async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204); // 204: no content
    const user = await Users.findAll({
        where: {
            refresh_token: refreshToken
        }
    });
    if (!user) return res.sendStatus(204); // 204: no content
    const userId = user[0].id;
    await Users.update({ refresh_token: null }, {
        where: {
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}