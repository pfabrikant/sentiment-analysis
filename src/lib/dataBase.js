// a module that exports communication methods between server and postgreSQL database.

var spicedPg = require("spiced-pg");
var db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/sentimapp"
);

exports.insertUser = function(username, email, password) {
    return db.query(
        "INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING id",
        [username, email, password]
    );
};
exports.getPassword = function(username) {
    return db.query(`SELECT id, password FROM users WHERE username=$1`, [username]);
};
exports.updateHistory = function(userId, text, score) {
    return db.query(
        `INSERT INTO history (userId, input_text, sentiment) VALUES ($1, $2, $3) RETURNING created_at`,
        [userId, text, score]
    );
};
exports.getHistory = function(id) {
    return db.query(
        `SELECT id, input_text,sentiment FROM history WHERE userId=${id}`
    );
};
