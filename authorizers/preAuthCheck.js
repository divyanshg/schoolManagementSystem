module.exports = function (req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/console')
    } else {
        return next()
    }
}