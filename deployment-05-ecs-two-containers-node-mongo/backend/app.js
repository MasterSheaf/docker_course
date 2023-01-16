const fs = require('fs');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const Goal = require('./models/goal');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', (req, res) => {
  console.log("Root");
  res.send('Hello World!')
});

app.get('/goals', async (req, res) => {
  console.log('TRYING TO FETCH GOALS!');
  try {
    const goals = await Goal.find();
    res.status(200).json({
      goals: goals.map((goal) => ({
        id: goal.id,
        text: goal.text,
      })),
    });
    console.log('FETCHED GOALS');
  } catch (err) {
    console.error('ERROR FETCHING GOALS');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to load goals.' });
  }
});

app.post('/goals', async (req, res) => {
  console.log('TRYING TO STORE GOAL');
  const goalText = req.body.text;

  if (!goalText || goalText.trim().length === 0) {
    console.log('INVALID INPUT - NO TEXT');
    return res.status(422).json({ message: 'Invalid goal text.' });
  }

  const goal = new Goal({
    text: goalText,
  });

  try {
    await goal.save();
    res
      .status(201)
      .json({ message: 'Goal saved', goal: { id: goal.id, text: goalText } });
    console.log('STORED NEW GOAL');
  } catch (err) {
    console.error('ERROR FETCHING GOALS');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to save goal.' });
  }
});

app.delete('/goals/:id', async (req, res) => {
  console.log('TRYING TO DELETE GOAL');
  try {
    await Goal.deleteOne({ _id: req.params.id });
    res.status(200).json({ message: 'Deleted goal!' });
    console.log('DELETED GOAL');
  } catch (err) {
    console.error('ERROR FETCHING GOALS');
    console.error(err.message);
    res.status(500).json({ message: 'Failed to delete goal.' });
  }
});

app.get('/connect', (req, res) => {
  
  console.log("/connect route");
  console.log("Connecting to MongoDB");
  console.log(`user=${process.env.MONGODB_USERNAME} password=${process.env.MONGODB_PASSWORD} url=${process.env.MONGODB_URL}`);
  
  mongoose.connect(
    //`mongodb://root:secret@localhost:27017/course-goals?authSource=admin`,
    //`mongodb://root:secret@18.222.52.95:27017/course-goals?authSource=admin`,
    `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}:27017/course-goals?authSource=admin`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    },
    (err) => {
      if (err) {
        console.error('FAILED TO CONNECT TO MONGODB');
        res.send('Failed to connect to MongoDB');
        console.error(err);
      } else {
        console.log('CONNECTED TO MONGODB!!');
        res.send('Connected to MongoDB');
      }
    }
  )

});

app.listen(80, () => {
  console.log("Server Running on Port 80");
});

// console.log("Connecting to MongoDB");
// console.log(`user=${process.env.MONGODB_USERNAME} password=${process.env.MONGODB_PASSWORD} url=${process.env.MONGODB_URL}`);
// console.log("Waiting 60 seconds for MongoDB to come up...");

// setTimeout( () => {

//   mongoose.connect(
//     //`mongodb://root:secret@localhost:27017/course-goals?authSource=admin`,
//     //`mongodb://root:secret@18.222.52.95:27017/course-goals?authSource=admin`,
//     `mongodb://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@${process.env.MONGODB_URL}:27017/course-goals?authSource=admin`,
//     {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     },
//     (err) => {
//       if (err) {
//         console.error('FAILED TO CONNECT TO MONGODB');
//         console.error(err);
//       } else {
//         console.log('CONNECTED TO MONGODB!!');
//         app.listen(80);
//       }
//     }
//   )

// }, 60000);

