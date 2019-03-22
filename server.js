const express = require('express');
const projectRoutes = require('./projects/projectRoute');
const actionRoutes = require('./actions/actionRoute');
const errorHandler = require('./middleware/errorHandler');

const app = express();

const projectUrl = "/api/projects";
const actionUrl = "/api/actions";

app.use(express.json());
app.use(projectUrl, projectRoutes);
app.use(actionUrl, actionRoutes);

app.get('/', (req, res) => {
  res.json('Hello from home page.');
})


app.use(errorHandler);
module.exports = app;