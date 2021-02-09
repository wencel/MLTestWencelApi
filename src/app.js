const express = require('express');
const cors = require('cors');
const itemsRouter = require('./routers/item');

const app = express();

const allowedOrigins = ['http://localhost:3001', 'http://192.168.1.138:3001'];

//Use the CORS library to allow calls from the app URL
app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin
      // (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        var msg =
          'The CORS policy for this site does not ' +
          'allow access from the specified Origin.';
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);
app.use(express.json());

app.use('/api/items', itemsRouter);

module.exports = app;
