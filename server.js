const express = require("express");
const path = require("path");
const app = express();
const db = require("./database.js")
const a2 = require("argon2")
const jwt = require("jsonwebtoken")
const cookieParser = require("cookie-parser");
const ip = require("./ip.js")

// app.use(express.static(path.join(__dirname, "client","style")));



app.use(cookieParser())
app.use(express.json());
app.listen(3000, function () {
    console.log("Server is running on localhost3000");
});


app.get("/style/style.css", function (req, res) {
    res.sendFile(path.join(__dirname, "client", "style/style.css"));
});

function verifyToken(req, res, next) {
    const token = req.cookies.sessionToken
    if (!token) return res.redirect("/login")
    try {
        const decoded = jwt.verify(token, 'secret');
        req.userId = decoded.userId;
        next();
     } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
     }
};

app.get('/', verifyToken, function(req, res){
    return res.redirect("/dashboard")
});

function verifyToken(req, res, next) {
    const token = req.cookies.sessionToken
    if (!token) return res.redirect("/login")
    try {
        const decoded = jwt.verify(token, 'secret');
        req.userId = decoded.userId;
        next();
     } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
     }
};

app.use('/dashboard', verifyToken, express.static(path.join(__dirname, 'client', 'dashboard')))

app.post('/dashboard', verifyToken, async (req, res) => {
    const data = await db.User.findOne({where: { id: req.userId }})
    if (!data || !data.userData) {
        return res.send({userData: ""})
    } else {
        return res.send({userData: data.userData})
    }
})

app.post('/deleteAccount', verifyToken, async (req, res) => {
    const data = await db.User.findOne({where: { id: req.userId }})
    if (await a2.verify(data.password, req.body.password)) {
        data.destroy()
        res.send({ value: 0 })
    } else {
        res.send({ value: -1 })
    }
})

app.post('/save', verifyToken, (req, res) => {
    try {
        db.User.update({ userData: req.body.userData }, { where: { id: req.userId } })
        res.send({ value: 0 })
    } catch (err) {
        res.send({ value: -1 })
    }
})

function verifyLogin(req, res, next) {
    const token = req.cookies.sessionToken
    if (!token) return next()
    try {
        const decoded = jwt.verify(token, 'secret');
        req.userId = decoded.userId;
        return res.redirect("/dashboard")
     } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
     }
};

app.use("/signup", verifyLogin, express.static(path.join(__dirname, 'client', 'signup')));

app.post('/signup', (req, res) => {
    const data = req.body
    db.addUser(data.username, data.email, data.password).then((data) => {
        res.send({ value: data })
    })
});

app.use("/login", verifyLogin, express.static(path.join(__dirname, 'client', 'login')));

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    const user = await db.User.findOne({ where: {username:username} })

    if (!user) {
        return res.send({value: -2})
    }

    if (!(await a2.verify(user.password, password))) {
        return res.send({value: -1})
    }

    const token = jwt.sign({userId:user.id}, 'secret', {
        expiresIn: '1h',
    })
    return res.send({value: token})
});