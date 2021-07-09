// add middlewares here related to projects
function verifyBody(req, res, next) {
    if (!req.body.name || !req.body.description) {
        res.status(400).json({ message: "Name and Description required" })
    } else {
        next();
    }
}

module.exports = {
    verifyBody
}