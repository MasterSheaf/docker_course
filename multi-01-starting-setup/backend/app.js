const fs = require('fs');
const path = require('path');

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const Goal = require('./models/goal');

const app = express();

const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', 'access.log'),
  { flags: 'a' }
);

app.use(morgan('combined', { stream: accessLogStream }));

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.get('/', (req, res) => {
  console.log("Root path called (.)(.)");
  const filePath = path.join(__dirname, 'pages', 'home.html');
  res.sendFile(filePath);
});

app.get('/goals', async (req, res) => {
  console.log('TRYING TO FETCH GOALS');
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

// I had a heck of time getting postman to make a valid post with body.text
// so I changed it to send over a json object.  this code below is that
// the code above is the original body.text version since that is what the react
// frontend client sends over so I need this to be like that above for the 
// course work.

// app.post('/goals', async (req, res) => {
  
//   console.log('TRYING TO STORE GOAL');
//   const goalText = req.body.Goal;
//   //console.log("req.body = " + req.body);

//   console.log("req.body = " + req.body.Goal);

//   console.log("req.body.Goal = " + req.body.Goal);

//   if (!goalText) {
//     console.log('INVALID INPUT - goalText null');
//     return res.status(422).json({ message: 'INVALID INPUT - goalText null' });
//   }


//   if (goalText.trim().length === 0) {
//     console.log('INVALID INPUT - goalText.trim().length = 0');
//     return res.status(422).json({ message: 'INVALID INPUT - goalText.trim().length = 0' });
//   }

//   const goal = new Goal({
//     text: goalText,
//   });

//   try {
//     await goal.save();
//     res
//       .status(201)
//       .json({ message: 'Goal saved', goal: { id: goal.id, text: goalText } });
//     console.log('STORED NEW GOAL');
//   } catch (err) {
//     console.error('ERROR FETCHING GOALS');
//     console.error(err.message);
//     res.status(500).json({ message: 'Failed to save goal.' });
//   }
// });

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

console.log("Backend Server Listening on Port 80")
//app.listen(80);

mongoose.connect(
  'mongodb://mongodb_server:27017/course-goals',
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) {
      console.error('FAILED TO CONNECT TO MONGODB');
      console.error(err);
    } else {
      console.log('CONNECTED TO MONGODB');
      app.listen(80);
    }
  }
);
