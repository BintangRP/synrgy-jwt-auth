import { Sequelize } from "sequelize";

export const db = new Sequelize('ch6_login_auth', 'root', '', {
    host: "localhost",
    dialect: "mysql"
})