// Configure your server here
// Build your actions router in /api/actions/actions-router.js
// Build your projects router in /api/projects/projects-router.js
// Do NOT `server.listen()` inside this file!
const express = require('express');
let helmet = require('helmet');
let projectRoutes = require('./projects/projects-router');
let actionsRoutes = require('./actions/actions-router');

const server = express();
server.use(express.json());
server.use(helmet());
server.use(logger);

// Router Endpoints
server.use('/api/projects', projectRoutes);
server.use('/api/actions', actionsRoutes);

server.use('/',(req, res) => {
    res.json({ message: 'Could not serve' })
})

function logger(req, res, next) {
    console.log(
      `[${new Date().toISOString()}] ${req.method} to ${req.url} from ${req.get(
        'Origin'
      )}`
    );
  
    next();
  }


module.exports = server;
