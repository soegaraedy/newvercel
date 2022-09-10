const User = require("../models/UserModel");
const argon2 = require("argon2");
const session = require("express-session");

module.exports = {

    Login : async(req, res)=>{
        if(req.body.email==="" || req.body.email===null || req.body.password===""||req.body.password===null) {
            console.log("Email Kosong");
            return res.status(400).json({msg: "Empty Email Or Password"});
        };
        console.log("Trying to Login User: " +req.body.email);
        const user = await User.findOne(
            {
                email: req.body.email                
            }    
        );
        
        if(!user) return res.status(404).json({msg: 'User tidak ditemukan' +'\n' +req.body.email});
        let match = "";
        try {
            match = await argon2.verify(user.password, req.body.password);
        } catch (error) {
            match = "";              
        }        
        
        if(match==="") return res.status(400).json({msg: "Can not Verify User, Wrong Password"});
        
        req.session.userId = user._id;
        const _id = user._id;
        const name = user.name;
        const email = user.email;
        const role = user.role;
        
        console.log("User Logged In: " +email +" " +_id);
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
        console.log("Logged in user: " +user._id);
        res.status(200).json(user);
    },

    Logout: async (req, res) => {
        console.log("Request to Logout: " +req.session.userId);
        req.session.destroy((err)=>{
            if(err) return res.status(400).json({msg: "Logout Failed"});            
            res.status(200).json({msg: "Berhasil Logout"});
            console.log("Berhasil Logout");
        });
    }    
}