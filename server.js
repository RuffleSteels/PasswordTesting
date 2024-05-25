const express = require("express");
const path = require("path");
const app = express();
const db = require("./database.js")

app.use(express.static(path.join(__dirname, "client")));
app.use(express.json());

app.get("/file/:filename", function (req, res) {
    const fileName = req.params.filename;
    const filePath = path.join(__dirname, "client", fileName);

    res.sendFile(filePath, function (err) {
        if (err) {
            console.error("File failed to send:", err);
            res.status(err.status).end();
        } else {
            console.log("Sent:", fileName);
        }
    });
});

app.listen(3000, function () {
    console.log("Server is running on localhost3000");
});

app.post('/sign-up', (req, res) => {
    const data = req.body
    db.addUser(data.username, data.email, data.password).then((data) => {
        if (data < 0) res.send({ value: data })
    })
});

app.post('/log-in', (req, res) => {
    const data = req.body
    db.logIn(data.username, data.password).then((data) => {
        if (Number.isInteger(data)) res.send({ value: data })
        else {
            res.send({ value: "login successful"})
        }
    })
});