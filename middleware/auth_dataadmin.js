let auth_superadmin = function (req, res, next) {
    req.session.role='Superadmin';
    req.session.username='Sumit Mangal';
    next();
}
module.exports = auth_superadmin;