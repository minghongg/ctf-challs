const User  = require('../models/user');
const Product = require('../models/product');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const validator = require('validator').default;
const sanitize = require('mongo-sanitize');
const { doTypesOverlap } = require('graphql');

module.exports = {

    register : async({userInput}, req) => {
        const errors = [];
        const email = sanitize(userInput.email.toString());
        const password = sanitize(userInput.password.toString());
        const name = sanitize(userInput.name.toString());
        
        if(!validator.isEmail(email)){
            errors.push({message : 'Email is invalid'});
        }
        if(validator.isEmpty(password)){
            errors.push({message : 'Password cannot be empty'});
        }
        if(!validator.isLength(password, {max : 20})){
            errors.push({message: 'Maximum password length is 20 characters'});
        }
        if(validator.isEmpty(name)){
            errors.push({message : 'Name cannot be empty'});
        }
        if(!validator.isLength(name, {max : 20})){
            errors.push({message: 'Maximum name length is 20 characters'});
        }

        if(errors.length > 0){
            const error = new Error("Invalid input");
            error.data = errors;
            error.code = 422;
            throw error;
        }

        try{
            const existingUser = await User.findOne({email : email});

            if(existingUser){
                const error = new Error('User already exists!');
                error.code = 422;
                throw error;
            }
    
            const hashedPw = await bcrypt.hash(password,12);
    
            const user = new User({
                email : email,
                name : name,
                password : hashedPw,
                isVip : false,
                balance : 100,
                cart: { items: [] }
            });
    
            const createdUser = await user.save();
    
            return {
                _id : createdUser._id.toString(), 
                name : createdUser.name,
                email : createdUser.email, 
                isVip : createdUser.isVip, 
                balance : createdUser.balance 
            };
        }

        catch(error){
            if(!error.code){
                error.code = 500;
            }
            throw error;
        }
    },

    login : async({email,password}, req) => {
        const sanitizedEmail = sanitize(email.toString());
        const sanitizedPassword = sanitize(password.toString());

        try{
            const user = await User.findOne({email : sanitizedEmail});
            if(!user){
                const error = new Error('Invalid email or password');
                error.code = 401;
                throw error;
            }
            const isEqual = await bcrypt.compare(sanitizedPassword,user.password);
            if(!isEqual){
                const error = new Error('Invalid email or password');
                error.code = 401;
                throw error;
            }
            const token = jwt.sign({
                userId:  user._id.toString(),
                email : user.email,
                isVip : user.isVip
            }, 'wIovdcKerNT4jejhrkY', {expiresIn : '1h'});

            return {token : token, userId : user._id.toString()};
        }
        
        catch(error){
            if(!error.code){
                error.code = 500;
            }
            throw error;
        }
    },

    products : async(args, req)=>{
        if(!req.isAuth){
            const error = new Error("Not authenticated");
            error.code = 401;
            throw error;
        }
        try{
            const products = await Product.find({isVip : req.isVip}).sort({'title' : 1});
            return {products : products.map(p => {
                return {
                    ...p._doc,
                    _id : p._id.toString()
                }
            })};
        }
        catch(error){
            if(!error.code){
                error.code = 500;
            }
            throw error;
        }
    },

    getProduct: async({productInput}, req) => {
        if(!req.isAuth){
            const error = new Error("Not authenticated");
            error.code = 401;
            throw error;
        }
        const regex = /[\!\@\#\$\%\^\&\*\(\)\-\_\+\=\~\`\[\]\|]/g;
        if(productInput.product.match(regex) != null){
            console.log(productInput.product.match(regex));
            const error = new Error("Illegal character found");
            error.code = 401;
            throw error;
        }
        const obj = JSON.parse(productInput.product);
        const title = sanitize(obj.title);
        if(title){
            const criteria = sanitize(`this.title == '${title}'`);
            try{
                const getResult = async() => {
                    return Product.find({
                        $where : criteria
                    })
                    .exec();
                }
                const result = await getResult();
                console.log(result);
                return "";
            }
            catch(error){
                if(!error.code){
                    error.code = 500;
                }
                throw error;
            }
        }
        else{
            const error = new Error("Invalid JSON Body");
            error.code = 401;
            throw error;
        }
    },

    addToCart : async({_id}, req) => {
        if(!req.isAuth){
            const error = new Error("Not authenticated");
            error.code = 401;
            throw error;
        }        
        try{
            const prodId = sanitize(_id.toString());
            const user = await User.findOne({_id : req.userId});
            const product = await Product.findOne({_id : prodId});

            if(!product){
                const error = new Error("Product not found");
                error.code = 404;
                throw error;
            }

            if(req.isVip === false && product.isVip === true){
                const error = new Error("Exclusive products are available only to VIP members");
                error.code = 403;
                throw error;
            }
            
            await user.addToCart(product);
            return "Item successfully added to cart";
        }

        catch(error){
            if(!error.code){
                error.code = 500;
            }
            throw error;
        }
    },

    removeItemFromCart : async({_id}, req) => {
        if(!req.isAuth){
            const error = new Error("Not authenticated");
            error.code = 401;
            throw error;
        }
        try{
            const prodId = sanitize(_id.toString());
            const user = await User.findOne({_id : req.userId});
            
            let isExistsIncart = false;
            user.cart.items.forEach((prod,index) => {
                if(prod.productId.toString() === prodId){
                    isExistsIncart = true;
                }
            })
            
            if(isExistsIncart === false){
                const error = new Error("Product not found in your cart");
                error.code = 404;
                throw error;
            }
            await user.removeFromCart(prodId);
            return "Item successfully removed from cart";
        }
        catch(error){
            if(!error.code){
                error.code = 500;
            }
            throw error;
        }
    },

    clearAllItemsFromCart : async(args, req) => {
        if(!req.isAuth){
            const error = new Error("Not authenticated");
            error.code = 401;
            throw error;
        }
        try{
            const user = await User.findOne({_id : req.userId});
            await user.clearCart();
            return "Successfully removed all items from your cart";
        }
        catch(error){
            if(!error.code){
                error.code = 500;
            }
            throw error;
        }
    },

    getCart : async(args,req) => {
        if(!req.isAuth){
            const error = new Error("Not authenticated");
            error.code = 401;
            throw error;
        }
        try{
            const user = await User.findOne({_id : req.userId});
            products = await user.populate('cart.items.productId').execPopulate();
            return {products : products.cart.items.map(p => {
                return {
                    ...p.productId._doc,
                    _id : p.productId._id.toString(),
                    quantity : p.quantity
                }
            })};
        }
        catch(error){
            if(!error.code){
                error.code = 500;
            }
            throw error;
        }
    }
}