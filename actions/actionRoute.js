const express = require('express');
const Action = require('../data/helpers/actionModel');


const routes = express.Router();
routes.use(express.json());


routes.get('/', async (req, res, next) => {
  try {
    const actions = await Action.get();
    res.status(200).json(actions);
  } catch {
    next({ status: 500, message: "Server Error. Could not retreive your data" });
  }
});

routes.get('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const actions = await Action.get(id);
    if (actions) {
      res.status(200).json(actions);
    } else {
      next({ status: 404, message: `Action with ID ${id} does not exist` })
    }
  } catch {
    next({ status: 500, message: "ID Error. Could not retreive your data" });
  }
});

routes.post('/', async (req, res, next) => {
  const { notes, description, project_id } = req.body;
  if (description.length > 128) {
    next({ status: 400, message: "Maximum description length is 128 characters." })
  } else {
    if (notes && description && project_id) {
      try {
        const newAction = await Action.insert(req.body);
        res.status(200).json(newAction);
      } catch {
        next({ status: 500, message: "Server Error. Could not retreive your data" });
      }
    } else {
      next({ status: 400, message: "Please provide notes, description and project_id for the action" })
    }
  }
});

routes.delete('/:id', async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleteAction = await Action.remove(id);
    if (deleteAction > 0) {
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
  const { notes, description, project_id } = req.body;

  if (description.length > 128) {
    next({ status: 400, message: "Maximum description length is 128 characters." })
  } else {
    if (notes && description && project_id) {
      try {
        const updatedAction = await Action.update(id, req.body);
        if (updatedAction) {
          res.status(200).json(updatedAction);
        } else {
          next({ status: 404, message: `Action with ID ${id} does not exist`  })
        }
      } catch {
        next({ status: 500, message: "Server Error. Could not retreive your data" });
      }
    } else {
      next({ status: 400, message: "Please provide notes, description and project_id for the action" });
    }
  }
})

module.exports = routes;
