const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const app = express();

const collectionRoutes = require('./routes/collections');

app.use(bodyParser.json());

app.use(morgan('combined'));

app.use('/collections', collectionRoutes);

app.get('/',(req, res, next) => {
    res.json('Welcome');
});

app.use((err, req, res, next) => {
    const { message } = err;
    res.json({ status: 'ERROR', message });
});

app.listen(8080);