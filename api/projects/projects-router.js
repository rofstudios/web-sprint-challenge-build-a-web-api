// Write your "projects" router here!
let express = require('express');
let router = express.Router();

let projectDB = require('./projects-model');

router.get('/', (req, res) => {
    projectDB.get()
        .then(projects => {
            if (!projects) {
                res.status(404).json({ message: 'No projects found' })
            } else {
                res.status(200).json(projects);
            }
        })
        .catch(err => {
            res.status(500).json({ err, message: 'Could not process request' })
        })
})

router.get('/:id', (req, res) => {
    let id = req.params.id;
    projectDB.get(id)
        .then(project => {
            if (!project) {
                res.status(404).json({ message: `No project found under id: ${id}` });
            } else {
                res.status(200).json(project);
            }
        })
        .catch(err => {
            res.status(500).json({ err, message: "Unable to process request" });
        })
})

function verifyBody(req, res, next) {
    if (!req.body.name || !req.body.description) {
        res.status(400).json({ message: "Name and Description required" })
    } else {
        next();
    }
}

router.post('/', verifyBody, (req, res) => {
    let newP = req.body;
    // requires name and description
    // if (newP) {
        // if (!newP.name || !newP.description) {
            // res.status(400).json({ message: 'Name and Description required' })
        // } else {
            projectDB.insert(newP)
                .then(project => {
                    // res.status(201).json({ message: 'Successfully added new project', project });
                    res.status(201).json(project); // to pass the test
                })
                .catch(err => {
                    res.status(500).json({ err, message: 'Unable to process request' });
                })
        })
    // } else {
        // res.status(400).json({ message: "No new project data found" });
    // }

// })

// router.put('/:id', (req, res) => {
//     let newP = req.body;
//     let id = req.params.id;
//     if (newP) {
//         projectDB.get(id)
//             .then(project => {
//                 if (!project) {
//                     res.status(404).json({ message: `No project with id${id} was found` });
//                 } else {
//                     projectDB.update(id, newP)
//                         .then(updateProject => {
//                             res.status(200).json(updateProject);
//                         })
//                 }
//             })
//             .catch(err => {
//                 res.status(500).json({ err, message: "Unable to process request" });
//             })
//     } else {
//         res.status(400).json({message: "Requires name and description"})
//     }
// })

router.put('/:id', (req, res) => {
    let newP = req.body;
    let id = req.params.id;

    if (!newP.name && !newP.description && !newP.completed) {
        res.status(400).json({ message: "Missing name description and completed" })
    } else {
        projectDB.get(id)
            .then(project => {
                if (!project) {
                    res.status(404).json({ message: `No project with id${id} was found` });
                } else {
                    projectDB.update(id, newP)
                        .then(updateProject => {
                            res.status(200).json(updateProject);
                        })
                }
            })
            .catch(err => {
                res.status(500).json({ err, message: "Unable to process request" });
            })
    }

    // if (newP.name && newP.description) {

    //     if (!newP.name || !newP.description) {
    //         res.status(400).json({ message: "Requires name and description" })
    //     } else {
    //         projectDB.get(id)
    //             .then(project => {
    //                 if (!project) {
    //                     res.status(404).json({ message: `No project with id${id} was found` });
    //                 } else {
    //                     projectDB.update(id, newP)
    //                         .then(updateProject => {
    //                             res.status(200).json(updateProject);
    //                         })
    //                 }
    //             })
    //             .catch(err => {
    //                 res.status(500).json({ err, message: "Unable to process request" });
    //             })
    //     }


    // } else {
    //     res.status(400).json({ message: "Missing data" })
    // }

    router.delete("/:id", (req, res) => {
        let { id } = req.params;
        projectDB.remove(id)
            .then(count => {
                if (count > 0) {
                    res.status(200).json({ message: `Successfully deleted action with ID ${id}` })
                } else {
                    res.status(404).json({ message: `Could not find project to delete with ID ${id}` })
                }
            })
            .catch(err => res.status(500).json({ err, message: "Could not process delete request" }))
    })
})

router.get("/:id/actions", (req, res) => {
    let { id } = req.params;

    projectDB.getProjectActions(id)
        .then(actions => {
            if (!actions) {
                res.status(404).json({ message: "No data found with that ID" })
            } else {
                res.status(200).json(actions)
            }
        })
        .catch(err => res.status(500).json({ err, message: "Could not get actions from DB" }))

})

module.exports = router;