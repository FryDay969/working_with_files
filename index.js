const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const phonesSchema = require('./db.schemas.js')
const bodyParser = require('body-parser')
const xlsx = require('node-xlsx')
const fs = require('fs');
const express = require('express');
const app = express();
const mongoose = require('mongoose');
require("dotenv").config()
const PORT = process.env.PORT;

app.use(bodyParser.urlencoded({extended:true}));

const phone = mongoose.model("phone", phonesSchema);

app.post('/api/save', (req,res) => {
        const file = xlsx.parse(`./${req.body.filename}.xlsx`);
        if(err){
            throw err
        }
        if(file === null){
            res.status('200').send(`Upload fail. File is empty`)
        }else{
            for (let i=1;(file[0].data.length-1); i++){
                let [name, model, price] = file[0].data[i];
                phone.create({name,model,price}, (err, doc) =>{
                    if(err) console.log(err);
                    console.log(doc);
                })
                res.status('200').send(`Data uploaded`)
            }
        }

    });




app.get('/api/data', (req,res) =>{
    const dbName = 'newphones';
    async function main() {
        const client = new MongoClient("mongodb://localhost:27017/newphones");
        await client.connect();
        const db = client.db(dbName);
        const collection = db.collection('phones');
        const findResult = await collection.find({}).toArray();
        res.send(findResult)
    }
    main()
})

mongoose.connect("mongodb://localhost:27017/newphones", function (err) {
    if(err)  return console.log(err)
    app.listen(PORT, function(){
        console.log(`Port is ${PORT}`)
    })
});