const express = require('express')
const db = require('./db')
const cors = require('cors')
const jwt = require('jsonwebtoken')


const app = express()
app.use(express.json())
// app.use(express.urlencoded())


app.use(cors({
    origin: 'http://localhost:3000'
}))

const jwtmiddleware = (req, res, next) => {
    try {

        const token = req.headers["x-access-token"]
        //token=token.split(" ")[1]
        const data = jwt.verify(token, 'secretkey123')
        next()
    }
    catch (err) {
        console.log(err);
        res.json({
            statusCode: 401,
            status: false,
            message: "please login"
        })
    }

}


app.post("/register", (req, res) => {
    const { uname, acno, password } = req.body
    console.log(req.body);
    db.User.findOne({ acno: acno }).then(user => {
        if (user) {
            res.send({ message: "already exist" })
        }
        else {

            const user = new db.User({
                uname,
                acno,
                password,
                balance: 0
            })
            user.save(err => {
                if (err) {
                    res.send(err)
                } else {
                    res.send({ message: "registartion successfull" })
                }
            })
        }
    })

})
// login

app.post("/login", (req, res) => {
    const { acno, password } = req.body
    db.User.findOne({ acno: acno }).then(user => {
        if (user) {
            if (password == user.password) {

                const token = jwt.sign({
                    currentAcc: acno
                }, 'secretkey123')
                console.log(token);

                res.json({
                    Status: 200,
                    message: "login successfull",
                    token
                })

            } else {
                // res.status(402).send({ message: "incorrect password" })
                res.json({
                    Status: 404,
                    message: "incorrect password",
                 })
            }

        } else {
            res.send({ message: "user does not exist" })
        }
    })
})


app.post("/deposit", jwtmiddleware, (req, res) => {

    const { acno, password, amount } = req.body
    var amounts = parseInt(amount)
    console.log(acno);
    db.User.findOne({ acno, password }).then(user => {
        console.log(user)
        if (user) {
            if (password === user.password) {

                user.balance += amounts
                user.save()
                res.send({ message: "your account is credited with" + amount })
            } else {
                res.send({ message: "incorrect password" })
            }
        } else {
            res.send({ message: "user does not exist" })
        }
    })
})


app.post("/deleteacc", jwtmiddleware, (req, res) => {
    const { acno, password } = req.body
    db.User.findOneAndDelete({ acno, password }).then(user => {

        if (user) {
            res.send({ message: "account deleted successfully" })
        } else {
            res.send({ message: "cannot find user" })
        }
    })
})

app.post("/search",(req,res)=>{
     const {acno} =req.body
    db.User.findOne({acno}).then(user=>{
        console.log(user);
        res.send(user)
      })
})

app.post("/view", (req,res)=>{
     const {acno}=req.body
    
     db.User.find().sort({acno}).then(user=>{
            res.send(user)
        })
})
   app.post("/view",(req,res)=>{
    const {uname}=req.body
    
       return db.User.find().sort({uname}).then(user=>{
            res.send(user)
        })
    })
app.listen(4000, () => {
    console.log("server is up and runs at 4000")
})