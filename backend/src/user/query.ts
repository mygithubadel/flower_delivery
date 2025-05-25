export const generateFindUserByUsernameQuery = (username: string) => {
    return {
        sql: 'SELECT * FROM users WHERE username = ? LIMIT 1',
        values: [username]
    };
}

export const generateInsertUserQuery = (username: string, email: string, phone: string, hashedPassword: string) => {
    return {
        sql: 'INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)',
        values: [username, email, phone, hashedPassword],
    };
}
