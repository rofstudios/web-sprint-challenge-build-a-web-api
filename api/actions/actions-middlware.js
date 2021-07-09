// add middlewares here related to actions
function verifyBody(req, res, next) {
    if (!req.notes || !req.description || !req.project_id) {
        res.status(400).json({ message: "Requires description, notes and project_id" })
    } else {
        next();
    }
}

module.exports = {
    verifyBody
}