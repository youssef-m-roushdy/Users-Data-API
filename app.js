const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express()
const port = process.env.PORT || 5000;
require('dotenv').config();
app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.urlencoded({extended: true}))
const moment = require('moment');
const methodoOverride = require('method-override');
app.use(methodoOverride('_method'))
//auto refresh
const livereload = require('livereload')
const liveReloadServer = livereload.createServer()
liveReloadServer.watch(path.join(__dirname, 'public')) 
const connectLivereload = require("connect-livereload")
app.use(connectLivereload())
liveReloadServer.server.once("connection", () => 
{
    setTimeout(() =>
    {
        liveReloadServer.refresh("/")
    }, 100)
})

mongoose.connect(process.env.DATABASE_URL).then(() => 
{
    app.listen(port, () =>{
        console.log(`http://localhost:${port}`)
    })
}).catch((err) =>
{
    console.log(err)
})

const Customer = require('./models/customerSchema')

app.get('/', (req, res) => 
{
    Customer.find().then((result) =>{
        console.log(result)
        res.render("index", {arr: result, moment: moment})
    }).catch((err) => {
        console.log(err)
    })
})

app.get('/user/add.html', (req, res) => 
{
    res.render("user/add.ejs")
})



app.post('/user/add.html', (req, res) => 
{
    console.log(req.body)
    Customer.create(req.body).then(() => 
    {res.redirect('/')})
    .catch((err) => {
        console.log(err)
    })
})

app.post('/search', (req, res) => 
{
    Customer.find({$or:[{firstName: req.body.searchText}, {lastName: req.body.searchText}]})
    .then((result) => {
        res.render("user/search", {arr: result})
    }).catch((err) => {
        console.log(err)
    })
})

app.get('/edit/:id', (req, res) => 
{ 
    Customer.findById(req.params.id).then((result) =>
    {
        res.render("user/edit", {obj: result})
    }).catch((err) =>
    {
        console.log(err)
    })
})


app.put('/edit/:id', (req, res) => 
{
   Customer.updateOne({_id: req.params.id}, req.body)
   .then(() => {
    res.redirect("/")
   })
   .catch((err) => {
    console.log(err)
   })
})

app.get('/user/:id', (req, res) => 
{
    Customer.findById(req.params.id).then((result) =>{
        console.log(result)
        res.render("user/view", {obj: result, moment: moment})
    }).catch((err) => {
        console.log(err)
    })
})

app.delete("/delete/:id", (req, res) =>
{
    Customer.deleteOne({_id: req.params.id})
    .then(()=> {
        res.redirect("/")
    }).catch((err) => {
        console.log(err)
    })
})

