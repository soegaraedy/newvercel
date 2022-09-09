const User = require("../models/UserModel");
const argon2 = require("argon2");

module.exports = {
    Login : async(req, res)=>{
        
        const user = await User.findOne(
            {
                email: req.body.email                
            }    
        );
        
        if(!user) return res.status(404).json({msg: "User tidak ditemukan"});
        let match = "";
        try {
            match = await argon2.verify(user.password, req.body.password);
        } catch (error) {
            match = "";            
        }        
        
        if(!match) return res.status(400).json({msg: "Wrong Password"});
        req.session.userId = user._id;
        const _id = user._id;
        const name = user.name;
        const email = user.email;
        const role = user.role;
    
        res.status(200).json({_id, name, email, role});    
    },

    Me: async (req, res)=> {

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
        res.status(200).json(user);
    },

    Logout: async (req, res) => {
        req.session.destroy((err)=>{
            if(err) return res.status(400).json({msg: "Logout Failed"});
            res.status(200).json({msg: "Berhasil Logout"});
        });
    }    
}