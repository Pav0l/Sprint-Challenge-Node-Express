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
  const { actions } = req.query;

  if (actions === "true") {
    try {
      const actionsForProject = await Project.getProjectActions(id);
      if (actionsForProject.length > 0) {
        res.status(200).json(actionsForProject);
      } else {
        next({ status: 404, message: `Project with ID ${id} does not exist or the project doesn't have any actions` })
      }
    } catch {
      next({ status: 500, message: "Server Error. Could not retreive your data" });
    }
  } else {
    try {
      const project = await Project.get(id);
      res.status(200).json(project);
      // if id does not exist, it will return an error, which will go directly to catch {}
    } catch {
      next({ status: 404, message: `Project with ID ${id} does not exist` });
    }
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
