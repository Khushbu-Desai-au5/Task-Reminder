const express = require('express')
const router = express.Router();
const Users = require('../Models/users')
const Utils = require('../utils/utils')

const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer");
const crypto = require('crypto')

//-------------------------------------Create User-------------------------------------------------------
router.post("/create", async (req, res) => {
    try {
        const { firstName, lastName, email, password} = req.body;
        let userDtls = await Users.getUserDetails(email)

        if(userDtls){
            console.log('User Exits')
            res.status(206).send({ statusCode: "206", message: "Email is already Registed." })
            return 
        }
        const {salt,passwordHash} = Utils.encryptPassword(password);
        console.log(passwordHash)
        const user = {firstName,lastName,email,passwordHash,salt}
        userDtls = await Users.createUser(user)
        res.status(201).send({ statusCode: "201", message: userDtls })
    }
    catch (error) {
          console.log(error)
        res.status(500).send({ statusCode: "500", message: error })
    }
})


//-------------------------------------Sign In-------------------------------------------------------

router.post('/signin',async(req,res)=>{
	const { username, password } = req.body
    try{
            //check if user exists
            const userDtls = await Users.getUserDetails(username)
            if(!userDtls){
                res.status(202).send({ statusCode: "202", message: "User Name does not Exists in System." })
                return 
            }
            //validate credentials
            const isValid = Utils.validatePassword(password,userDtls.salt,userDtls.password)
            if(!isValid){
                res.status(206).send({ statusCode: "206", message: "Password is incorrect." })
                return 
            }
            console.log('Login successful.')
            //create jwt token and save cookie
            const token = jwt.sign({ username }, Utils.JWTKEY, {
                algorithm: "HS256",
                expiresIn: Utils.JWTEXPTIMEINSECONDS
            })    
            res.cookie("token", token, { maxAge: Utils.JWTEXPTIMEINSECONDS * 1000 })
            res.status(200).send({ statusCode: "200", message: 'Login Successful' })
            //res.end()
    }catch(error){
        res.status(500).send({ statusCode: "500", message: error })

    }
    
})


//------------------------------------get User Detail-------------------------------------------------------
router.get("/:email", async (req, res) => {
    try {
        const {email} = req.params
        const {id,firstName,lastName}  = await Users.getUserDetails(email)
        const user = {id,firstName,lastName,email}
        res.status(200).send({ statusCode: "200", message: user })
    }
    catch (error) {
        res.status(400).send({ statusCode: "400", message: error })
    }
})

//-------------------------------------Modify User-------------------------------------------------------
router.put("/update/", async (req, res) => {
    try {
   
        const {email,firstName,lastName} = req.body
        let userDtls = await Users.getUserDetails(email)

        if(!userDtls){
            console.log('User Not Exits')
            res.status(400).send({ statusCode: "400", message: "User does not Exists." })
            return 
        }
        const updatedTask = await Users.updateUser({email,firstName,lastName})

        res.status(200).send({ statusCode: "200", message: updatedTask })
    }
    catch (error) {
        res.status(400).send({ statusCode: "400", message: error })
    }
})

//-------------------------------------delete User-------------------------------------------------------

router.delete("/delete/:email", async (req, res) => {
    try {
        const { email } = req.params;
        let userDtls = await Users.getUserDetails(email)

        if(!userDtls){
            console.log('User Not Exits')
            res.status(400).send({ statusCode: "400", message: "User does not Exists." })
            return 
        }
        const deleteTask = await Users.deleteUser(email)
        res.status(200).send({ statusCode: "200", message: deleteTask })
    }
    catch (error) {
        res.status(400).send({ statusCode: "400", message: error })
    }
})

router.post("/signout",async (req,res)=>{
    res.cookie("token", '')
    res.status(200).send({ statusCode: "200", message: 'Logout Successful' })


})

router.post("/forget",async (req,res)=>{
   console.log('req',req.headers)
   const {username} = req.body
   let userDtls = await Users.getUserDetails(username)
    //Check if user already Exists
   if(!userDtls){
       console.log('User Does nort Exits')
       res.status(206).send({ statusCode: "206", message: "Invalid User Name." })
       return 
   }
   //Generate and Store Token
   const resetToken = crypto.randomBytes(20).toString('hex');
   const tokenExpiration = Date.now() + 3600000; //expires in an hour

   const updatedTask = await Users.updatePasswordResetDetails({username,resetToken,tokenExpiration})
   //send email

   const  link = req.headers.origin + "/reset/" + resetToken
   const mailOptions = {
    to: username,
    from: process.env.FROM_EMAIL,
    subject: "Password change request",
    text: `Hi ${username} \n 
            Please click on the following link ${link} to reset your password. \n\n 
            If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    const smtpTransport =  nodemailer.createTransport({
        service:process.env.SERVICE || 'Gmail',
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass:process.env.EMAIL_PASSOWRD
        }
   })

   try{
   const info =  await smtpTransport.sendMail(mailOptions)
   console.log('Successfully send mail',info)
    res.status(200).send({statusCode:'200',message:'Successfully send email'})
   }catch(err){
       console.log('Error in sending mail',err)
       res.status(209).send({statusCode:'209',message:'Error in Sending Mail.'})

   }
})


router.get("/reset/:token",async (req,res)=>{
    try{
            console.log(req.params.token)
            const user = await Users.getUserByToken({resetToken:req.params.token})
            if(user){
                res.status('200').send({statusCode:'200',message:'User Token is valid.'})
            }else{
                res.status('205').send({statusCode:'205',message:'User Token has Expired.'})
            }
    }catch(err){
        res.status('205').send({statusCode:'205',message:'User Token has Expired.'})

    }
})

router.post("/reset/:token",async(req,res)=>{
        try{
            const user = await Users.getUserByToken({resetToken:req.params.token})
            if(!user){
                res.status('205').send({statusCode:'205',message:'User Token has Expired.'})
                return
            }
            const username = user.dataValues.email
            console.log('User',user)
            const password = req.body.password;
            console.log('pass',password)
            const {salt,passwordHash} = Utils.encryptPassword(password);
            console.log('token',req.params.token)
            const updatedUser = await Users.updateUserToResetPassword({resetToken:req.params.token,passwordHash:passwordHash,salt:salt})

            console.log('updated user',updatedUser)
            if(updatedUser){
                console.log('in mail')
            const mailOptions = {
                to: username,
                from: process.env.FROM_EMAIL,
                subject: "Password changed Successfully",
                text: `Hello,\n\n' 
                 - This is a confirmation that the password for your account ${username} has just been changed.\n`
                };
                console.log('mailOptions',mailOptions)
                const smtpTransport =  nodemailer.createTransport({
                    service:process.env.SERVICE || 'Gmail',
                    auth:{
                        user: process.env.EMAIL_USERNAME,
                        pass:process.env.EMAIL_PASSOWRD
                    }
               })
               console.log('smtp',smtpTransport)
            
               try{
               const info =  await smtpTransport.sendMail(mailOptions)
               console.log('Successfully send mail',info)
               res.status('201').send({statusCode:'201',message:'Password has successfully Changed.'})
               return
            }catch(err){
                   console.log('Error in sending mail',err)
                   res.status('206').send({statusCode:'206',message:'Could not reset your password.'})
                    return
               }
            }else{
                res.status('206').send({statusCode:'206',message:'Could not reset your password.'})
                return
            }


        }catch(err){
            res.status('206').send({statusCode:'206',message:'Could not reset your password.'})
            return;

        }
})
module.exports = router