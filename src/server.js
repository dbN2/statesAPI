const express = require('express');
const mongoose = require('mongoose');
const statesRouter = require('./routes/states');
const rootRouter = require('./routes/root.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const app = express();

mongoose.set('strictQuery', false);


// connect to MongoDB
const dbconn = process.env.DATABASE_URI;
mongoose.connect(dbconn
, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// define routes
app.use(cors());

app.use(bodyParser.json());
app.use('/', rootRouter);
app.use('/states', statesRouter);

app.use((req, res, next) => {
    res.status(404);
  
    // respond with HTML if the client accepts text/html

    // respond with JSON if the client accepts application/json
    if (req.accepts('json')) {
      res.json({ error: '404 Not Found' });
      return;
    }
    if (req.accepts('html')) {
      const filePath = path.join(__dirname, '404.html');
      res.sendFile(filePath);
      return;
    }
  
  
    // default to plain text
    res.type('txt').send('404 Not Found');
  });

// start the server
const port =  3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));