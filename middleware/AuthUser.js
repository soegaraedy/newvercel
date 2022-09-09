const User = require ('../models/UserModel');

module.exports = {
    verifyUser : async(req, res, next)=>{
        if(!req.session.userId) {
            return res.status(401).json({msg: "mohon login ke akun anda"});
        }
    
        const user = await User.findOne(
            {
                _id: req.session.userId
    
            },{
                password: 0
            }
        );
    
        if(!user) return res.status(404).json({msg: "User not found"});
        req._id = user._id;
        req.role = user.role;
        
        next();
    },
    
    //method ini akan dipanggil setelah verifyUser pada endpoint, sehingga user sudah pasti lolos login (verifyUser)
    adminOnly : async(req, res, next)=>{
        
        
        const user = await User.findOne(
            {
                _id: req.session.userId
    
            },{
                password: 0
            }
        );
    
        if(!user) return res.status(404).json({msg: "User not found"});
        if(user.role!=='admin') return res.status(403).json({msg: "Akses Terlarang"});        
        next();
    }
}