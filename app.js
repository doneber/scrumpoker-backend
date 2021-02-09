const express = require('express')
const roomsRouter = require('./routes/rooms')
const app = express()

// Middlewares:
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Endpoints:
app.get('/', (req, res) => res.send('The server is running OK'))
app.use('/rooms', roomsRouter);

module.exports = app;
