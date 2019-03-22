const express = require('express');
const Project = require('../data/helpers/projectModel');


const routes = express.Router();
routes.use(express.json());


routes.get('/', async (req, res, next) => {
  try {
    const projects = await Project.get();
    res.status(200).json(projects);
  } catch {
    next({ status: 500, message: "Server Error. Could not retreive your data" });
  }
});


routes.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const projects = await Project.getProjectActions(id);
    if (projects.length > 0) {
      res.status(200).json(projects);
    } else {
      next({ status: 404, message: `Project with ID ${id} does not exist or the project doesn't have any actions` })
    }
  } catch {
    next({ status: 500, message: "ID Error. Could not retreive your data" });
  }
});

routes.post('/', async (req, res, next) => {
  const { name, description } = req.body;
  if (name && description) {
    try {
      const newProject = await Project.insert(req.body);
      res.status(200).json(newProject);
    } catch {
      next({ status: 500, message: "Server Error. Could not retreive your data" });
    }
  } else {
    next({ status: 400, message: "Please provide name and description for the project" })
  }
});

routes.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const deletedRecords = await Project.remove(id);
    if (deletedRecords > 0) {
      res.status(200).json(`Action with ID ${id} was deleted.`);
    } else {
      next({ status: 404, message: `Action with ID ${id} was not found`})
    }
  } catch {
    next({ status: 500, message: "Server Error. Could not retreive your data" });
  }
});

routes.put('/:id', async (req, res, next) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (name && description) {
    try {
      // get the object you want to update
      // const actionToUpdate = await Project.get(id);
      // make sure the user can update only proper key:value pairs
      // const actionObj = {
      //   ...actionToUpdate,
      //   name,
      //   description
      // }
      const updatedAction = await Project.update(id, req.body);
      if (updatedAction) {
        res.status(200).json(updatedAction);
      } else {
        next({ status: 404, message: `Action with ID ${id} does not exist`  })
      }
    } catch {
      next({ status: 500, message: "Server Error. Could not retreive your data" });
    }
  } else {
    next({ status: 400, message: "Please provide name and description for the action" });
  }
})

module.exports = routes;
