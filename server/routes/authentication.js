const jwt = require("jsonwebtoken")
const Utils = require("../utils/utils")

module.exports =  (req,res,next) =>{
	const token = req.cookies.token
	console.log(token)
	    if (!token) {
		return res.status(401).send({ statusCode: "401", message: "Please Login to continue." })
    }
 
    var payload
	try {
		// Parse the JWT string and store the result in `payload`.
		// Note that we are passing the key in this method as well. This method will throw an error
		// if the token is invalid (if it has expired according to the expiry time we set on sign in),
		// or if the signature does not match
		payload = jwt.verify(token, Utils.JWTKEY)

	} catch (e) {
		console.log('invalid token',e)
		return res.status(400).send({ statusCode: "401", message: "Unauthorized Access." })
	}
	req.body.username = payload.username
	console.log('payload',payload)
    next()
}
