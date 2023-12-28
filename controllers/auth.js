//Restful API's for registration and login (Authentication)

//Requires model to connect
const User = require('../models/User')

//Load Dependencies
const bcrypt = require('bcrypt');
const salt = 10;
const jwt = require('jsonwebtoken');

// Signing up Using Post (New User)
exports.auth_signup_post = (req, res) => {
    let user = new User(req.body)

    //Declaring the Hash method for the password
    let hash = bcrypt.hashSync(req.body.password, salt);
    console.log(hash);

    //Making the password Hash before saving the User Information
    user.password = hash;

    user.save()
    .then(()=>{
        res.json({"message": "User Created Successfully!"})
    })

    .catch((err)=>{
        res.json({"message": err.message})
    })
}

exports.auth_signin_post = async (req, res) => {
    let {emailAddress, password} = req.body;
    console.log(emailAddress);

    
    try{
        let user = await User.findOne({emailAddress});
        
        if(!user){
            return res.json({"message": "User not found!!"}).status(400);
        }

        //Password Comparison
        const isMatched = await bcrypt.compareSync(password, user.password);
        console.log(password);
        console.log(user.password);

        if(!isMatched){
            return res.json({"message": "Password Not Matched"}).status(400);
        }

        //Generate JWT
        const payload ={
            user: {
                id: user._id
            }
        }

        jwt.sign(
            payload,
            process.env.SECRET,
            {expiresIn: 36000000},
            (err, token) => {
                if (err) throw err;
                res.json({token}).status(200)
            }
        )
    }

    catch(err){
        console.log(err);
        res.json({"message": "You are not LoggedIn!!"}).status(400);

    }
}