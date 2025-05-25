import {generateFindUserByUsernameQuery, generateInsertUserQuery} from "./query";
import {ResultSetHeader, RowDataPacket} from "mysql2";
import {DatabaseUser, RegisterRequestBody} from "./types";
import {getDBConnection} from "../db";
import bcrypt from "bcryptjs";

export const registerUser = async (registrationData: RegisterRequestBody) => {
    const hashed = await bcrypt.hash(registrationData.password, 10);
    const conn = await getDBConnection();
    const { sql, values } = generateInsertUserQuery(registrationData.username, registrationData.email, registrationData.phone, hashed);

    return new Promise((resolve, reject) => {
        conn.query(
            sql,
            values,
            (err, results: ResultSetHeader) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results.insertId)
                }

            }
        );
    });

}

export const getUser = async (username: string): Promise<DatabaseUser> => {
    const conn = await getDBConnection();
    const {sql, values} = generateFindUserByUsernameQuery(username)

    return new Promise((resolve, reject) => {
        conn.query(
            sql,
            values,
            async (err, results: RowDataPacket[]) => {
                if (err) {
                    reject(err);
                } else {
                    if (results.length === 0) {
                        resolve(null);
                    } else {
                        const user = results[0] as DatabaseUser;
                        resolve(user);
                    }
                }
            }
        );
    });
}