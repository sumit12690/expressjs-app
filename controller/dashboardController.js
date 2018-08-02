exports.dashboard = function (req, res) {
    if (req.session.username) {
        res.render('dashboard', {
            data: { username: req.session.username },
        });
    } else {
        return res.redirect('/login');
    }
}