const db = require('../database')
const sequelize = require('sequelize')
const { Op } = require('sequelize')

const Task = require('./task')
const Users = db.define('users', {
    firstName: {
        type: sequelize.STRING(50)
    },
    lastName: {
        type: sequelize.STRING(50)
    },
    email: {
        type: sequelize.STRING(50),
        primaryKey: true,
    },
    password: {
        type: sequelize.STRING(1024)
    },
    salt:{
        type: sequelize.STRING(50)
    },
    resetToken:{
        type: sequelize.STRING(50)
    },
    tokenExpiration:{
        type: sequelize.DATE
    }

},
    {
        timestamps: true
    }
)




db.sync().then(res => {

})
const createUser = async (user) =>{
    try{
        const userCreate = await Users.create({
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.passwordHash,
            salt:user.salt
        })
        console.log(userCreate.dataValues.email)
        return userCreate.dataValues.email
    }catch(error){
        return error
    }
}

const getUserDetails = async (email) =>{
    try{
    const userDtls = await Users.findOne({ where:{email:email} })
    if(userDtls){
        return {
            id:userDtls.dataValues.id,
            email:userDtls.dataValues.email,
            firstName:userDtls.dataValues.firstName,
            lastName:userDtls.dataValues.lastName,
            salt : userDtls.dataValues.salt,
            password:userDtls.dataValues.password
        }
    }else{
        return null
    }
    }catch(error){
        return error
    }
}

const updateUser = async (user) =>{
    try{
    const userDtls = await Users.update(
        {
            firstName:user.firstName,
            lastName:user.lastName
        }, { where: { email: user.email } })
     return userDtls;

    }catch(error){
        return error
    }

}

const updatePasswordResetDetails = async (user) =>{
    try{
        const userDtls = await Users.update(
            {
                resetToken:user.resetToken,
                tokenExpiration:user.tokenExpiration
            }, { where: { email: user.username } })
         return userDtls;
    
        }catch(error){
            return error
        }
}

const updateUserToResetPassword = async (user) =>{
    try{
        console.log('in update password start')
    const userDtls = await Users.update(
        {
            resetToken:null,
            tokenExpiration:null,
            password: user.passwordHash,
            salt:user.salt
        }, { where:{resetToken:user.resetToken} })
        console.log('in update password',userDtls)
     return userDtls;

    }catch(error){
        console.log('in update password err',userDtls)

        return error
    }
}

const getUserByToken = async (user) =>{
    try{
        const userDtls = await Users.findOne({ where:{resetToken:user.resetToken,tokenExpiration:{[Op.gte]:Date.now()}} })
         return userDtls;
    
        }catch(error){
            return error
        }
}
const deleteUser = async (email) =>{
    try{
        const userDtls = await Users.destroy(
            { where: { email: email } })
        return userDtls;

    }catch(error){
        return error
    }

}

module.exports = {Users,getUserDetails,createUser,updateUser,deleteUser,updatePasswordResetDetails,getUserByToken,updateUserToResetPassword}
