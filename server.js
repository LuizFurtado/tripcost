const express = require('express');
const mongo = require('mongodb').MongoClient;

const app = express();

app.use(express.json());

/**
 * Tripcost mongo Atlas
 * Database Tripcost
 * Username: tripcost
 * Password: xe7yIV3Z8GzgAaOa
 */

const mongoURL = "mongodb+srv://tripcost:xe7yIV3Z8GzgAaOa@mongofurtadex-gao43.mongodb.net/tripcost?retryWrites=true&w=majority";

let db, trips, expenses;

mongo.connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, client) => {
    if(err) {console.log(err); return;}

    db = client.db('tripcost');
    trips = db.collection('trips');
    expenses = db.collection('expenses');
});

app.post('/trip', (req, res) => {
    const name = req.body.name;
    trips.insertOne({name: name}, (err, result) => {
        if(err) {
            console.log(err);
            res.status(500).json({err: err});
            return;
        }
        console.log(result);
        res.status(200).json({ok: true});
    });
});

app.get('/trips', (req, res) => {
    trips.find().toArray((err, items) => {
        if(err) {
            console.log(err);
            res.status(500).json({err: err});
            return;
        }
        res.status(200).json({trips: items});
    });
});

app.post('/expense', (req, res) => {
    expenses.insertOne({
        trip: req.body.trip,
        date: req.body.date,
        amount: req.body.amount,
        category: req.body.category,
        description: req.body.description
    },
        (err, result) => {
            if(err) {
                console.log(err);
                res.status(500).json({err: err});
                return
            }
            res.status(200).json({ok: true});
        }
    )
});

app.get('/expenses', (req, res) => {
    expenses.find({trip: req.body.trip}).toArray((err, items) => {
        if(err) {
            console.log(err);
            res.status(500).json({err: err});
            return;
        }
        res.status(200).json({expenses: items});
    });
});

app.listen(3000, () => {
    console.log("Server running at port 3000");
});

