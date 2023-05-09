require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const statesRouter = require('./routes/states');
const rootRouter = require('./routes/root.js');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const corsOptions = require('./config/corsOptions');

const app = express();

// connect to MongoDB
const dbconn = process.env.DATABASE_URI;
mongoose.connect(dbconn
)
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// define routes
app.use(cors());
app.use(bodyParser.json());
app.use('/', rootRouter);
app.use('/states', statesRouter);

app.use((req, res, next) => {
    res.status(404);
  
    if (req.accepts('json')) {
      res.json({ error: '404 Not Found' });
      return;
    }

    else if (req.accepts('html')) {
      const filePath = path.join(__dirname, '404.html');
      res.sendFile(filePath);
      return;
    }
  
    else{
      res.type('txt').send('404 Not Found');
    }
  });

// start the server
const port =  3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
