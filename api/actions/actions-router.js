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
        if(!action){
            res.status(404).json({ message: `No data found with ID ${id}` })
        } else {
        res.status(200).json(action)
        }
    })
    .catch(err => res.status(500).json({ err, message: "Could not get action from DB" }))

})

module.exports = router;