const sqlite3 = require('sqlite3').verbose();
require('dotenv').config()
const db = new sqlite3.Database(`${process.env.DATABASE_NAME}`);

db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    age INTEGER NOT NULL
)`);

async function getUsers() {
    try {
        const users = await new Promise((res, rej) => {
            db.all(`SELECT * FROM users`, [], (err, rows) => {
                if (err) {
                    rej(err);
                } else {
                    res(rows);
                }
            });
        });
        return users;
    } catch (err) {
        return null;
    }
};

async function addUser(user) {
    const lastID = await new Promise((res, rej) => {
        db.run('INSERT INTO users (name, age) VALUES (?, ?)', [user.name, user.age], function (err) {
            if (err) {
                rej(err);
            } else {
                res(this.lastID);
            }            
        });
    });
    return {id: lastID, ...user};
};

async function updateUser(id, updateUser) {
    const change = await new Promise((res, rej) => {
        db.run('UPDATE users SET name = ?, age = ? WHERE id = ?', [updateUser.name, updateUser.age, id], function (err) {
           if (err) {
            rej(err);
           } else {
            res(this.changes);
           }
        });
    });
    if (change === 0) {
        return null;
    }
    return this.getUserById(id);
};

async function getUserById(id) { 
    const user = await new Promise((res, rej) => {
        db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
            if (err) {
                rej(err);
            } else {
                res(row);
            }
        });
    });
    return user;
};

async function deleteUser(id) {
    const changes = await new Promise((res, rej) => {
        db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
            if (err) {
                rej(err);
            } else {
                res(this.changes);
            }
        });
    });
    return changes > 0;
};

module.exports = {
    getUsers,
    addUser,
    getUserById,
    updateUser,
    deleteUser
};