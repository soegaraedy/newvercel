//import mongoose and model
const mongoose =  require("mongoose");
const Product = require("../models/ProductModel");

//list of function to export
module.exports={

    //Get all products
    getProducts : async(req, res) => {  
        if(req.role==='admin'){  
            //user login sebagai admin,  bisa get semua produk                
            try {
                console.log("New Request : Get All Products: ");
                await Product.find()
                    .select("name price _id")
                    .exec()
                    .then(docs => {
                        const response = {
                            count: docs.length,
                            products: docs.map(doc => {
                                return {
                                    name: doc.name,
                                    price: doc.price,
                                    _id: doc._id,
                                    request: {
                                        type: "GET",
                                        url: "http://localhost:5000/api/products/" +doc._id
                                    }
                                };
                            })
                        };
                        res.status(200).json(response);
                    })
                    .catch(err => {
                        console.log(err)
                        res
                        .status(500)
                        .json({message: err});
                    });            
            } catch (error) {
                console.log("Failed to Get All Users: ");
                res.status(500).json({message: error.message});
            }   
        } else {
            //user login bukan sebagai admin, get produk hasil bikinannya saja
            const userId = req._id;
            try {
                console.log("Try Get Some Products Created By This User: " +userId);  
                await Product.find({
                    createdBy: req._id
                }) 
                 .select("name price _id")
                 .exec()
                 .then(docs => {
                    const response = {
                        count: docs.length,
                        products: docs.map(doc => {
                            return {
                                name: doc.name,
                                price: doc.price,
                                _id: doc._id,
                                request: {
                                    description: 'to get view this product',
                                    type: 'GET',
                                    url: 'http://localhost:5000/api/products/' +doc.id
                                }
                            };
                        })
                    };
                    res.status(200).json(response);
                 })
                 .catch(err => {
                    console.log(err)
                    res
                    .status(500)
                    .json({message: err});
                });  

            } catch (error) {
                console.log("Failed to Get All Users: ");
                res.status(500).json({message: error.message});
            }
        }  
    },

//GET Product By Id
    getProductById: async (req, res) => {
        const userId = req._id.toString();
        const role = req.role;
        
        //console.log("user id " +userId);
        try {
            const productId = req.params.id;
            await Product.findById(productId)
             .select("name price _id createdBy")
             .exec()
             .then(doc => {
                //console.log("Got One Product From DB: " +doc);
                if(doc && (role === 'admin' || doc.createdBy === userId)){
                    res
                     .status(200)
                     .json(
                        {
                            product: doc,
                            request: {
                                type: 'GET',
                                description: 'GET all Products',
                                url: 'http://localhost:5000/api/products/'                              
                            }
                        }
                     )

                }else {
                    res
                     .status(404)
                     .json({msg: "product doesnt exist or you dont have access to it"})
                }
             })
             .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });

             });       
        } catch (error) {
            console.log("No Data Matched Your Query");
            res.status(404).json({message: error.message});
        }

    },

//DELETE a Product
    deleteProduct: async(req, res) => {     
        try {
            let isAllowed = false;
            const productId = req.params.id;
            const userId = req._id.toString();
            const role = req.role;

            await Product.findById(productId)
             .select("name price _id createdBy")
             .exec()
             .then(doc => {
                if(doc && (role === 'admin' || doc.createdBy === userId)){
                    isAllowed = true;
                }
             })
             .catch(err => {
                console.log(err);
                res.status(500).json({ error: err });
             });
            
            if(isAllowed) {
                await Product.findByIdAndDelete(productId);
                res.status(200).json({msg: "Deleted Succesfully"});
            }else{
                res
                .status(404)
                .json({msg: "Well... product doesnt exist or you dont have access to it"})
            }
        } catch (error) {
            console.log("No Data Matched Your Query");
            res.status(404).json({message: error.message});
        }        
    }, 

//ADD new Product
    saveProduct : async(req, res)=>{
                
        const product = new Product({
            _id: new mongoose.Types.ObjectId(),
            name: req.body.name, 
            price: req.body.price, 
            createdBy: req._id
        });
        try {
            /*
            const insertedProduct = await product.save();
            res.status(201).json(insertedProduct);
            */
           await product
            .save()
            .then(result => {
                console.log(result);
                res
                 .status(201)
                 .json({
                    msg: 'product created successfully',
                    createdProduct: result,
                    request: {
                        description: 'To view your new created product',
                        type: 'GET',
                        url: 'http://localhost:5000/api/users/' +result._id
                    }
                    
                })
            })
        } catch (error) {
            res.status(401).json({message: error.message});
        }
    },

    //Update A Product
    updateProduct: async(req, res) => {
        try {
            const updatedProduct = await Product.updateOne({_id:req.params.id},
            {$set: req.body});
            res.status(200).json(updatedProduct);
        } catch (error) {
            res.status(400).json({message: error.message});
        }
    },
    
};