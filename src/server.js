const express = require('express');
const mongoose = require('mongoose');
const statesRouter = require('./routes/states');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();


// connect to MongoDB
mongoose.connect("mongodb+srv://kshields9911:Loveless1@cluster0.uq6dgqa.mongodb.net/States?retryWrites=true&w=majority"
, { useNewUrlParser: true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// define routes
app.use(bodyParser.json());

app.use('/states', statesRouter);

app.use((req, res, next) => {
    res.status(404);
  
    // respond with HTML if the client accepts text/html
    if (req.accepts('html')) {
      res.send('<h1>404 Not Found</h1>');
      return;
    }
  
    // respond with JSON if the client accepts application/json
    if (req.accepts('json')) {
      res.json({ error: '404 Not Found' });
      return;
    }
  
    // default to plain text
    res.type('txt').send('404 Not Found');
  });

// start the server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));