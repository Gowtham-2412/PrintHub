const isAdmin = async (req, res, next) => {
    if(req.user.role !== 'owner') {
        return res.status(403).json({msg: "Access Denied. Only admins"})
    }
    next()
}
export default isAdmin;