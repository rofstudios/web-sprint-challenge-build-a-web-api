// Write your "actions" router here!
let express = require('express');
let router = express.Router();

let actionsDB = require('./actions-model');

router.get('/', (req, res) => {
    actionsDB.get()
        .then(response => {
            res.status(200).json(response);
        })
})

router.get("/:id", (req, res) => {
    let id = req.params.id;

    actionsDB.get(id)
        .then(action => {
            if (!action) {
                res.status(404).json({ message: `No data found with ID ${id}` })
            } else {
                res.status(200).json(action)
            }
        })
        .catch(err => res.status(500).json({ err, message: "Could not get action from DB" }))

})

router.post("/", (req, res) => {
    let newA = req.body;

    if (newA) {
        if (!newA.notes || !newA.description || !newA.project_id) {
            res.status(400).json({ message: "Requires description, notes and project_id" })
        } else {
            actionsDB.insert(newA)
                .then(action => {
                    res.status(201).json(action)
                })
                .catch(err => {
                    res.status(500).json({ err, message: "Unable to process request" })
                })
        }
    } else {
        res.status(404).json({ message: "Missing data" })
    }
})


router.put("/:id", (req, res) => {
    let { id } = req.params;
    let changes = req.body;

    if (!changes.notes && !changes.description && !changes.project_id) {
        res.status(400).json({ message: "Requires notes, desciption and project_id properties" })
    } else {
        actionsDB.get(id)
            .then(action => {
                if (action) {
                    actionsDB.update(id, changes)
                        .then(updated => {
                            res.status(200).json(updated);
                        })
                        .catch(err => res.status(500).json({ err, message: "Could not update request" }));
                } else {
                    res.status(404).json({ message: "Could not find action with requested ID" })
                }
            })
            .catch(err => {
                res.status(500).json({ err, message: "Unable to process request" })
            })
    }
})

router.delete('/:id', (req, res) => {
    let id = req.params.id;

    actionsDB.remove(id).then(count => count > 0 ? res.status(204).end() : res.status(404).json({ message: `No action with id ${id} found to be deleted` }))
})
module.exports = router;