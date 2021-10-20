const mysql = require('mysql');

const con = mysql.createConnection({
    host: "files-db.chd0jlqwjjwl.us-west-1.rds.amazonaws.com",
    user: "admin",
    password: "qwertyuiop"
});

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    con.end();
});