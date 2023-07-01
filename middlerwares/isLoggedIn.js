import { getTokenFromHeader } from "../utils/getTokenFromHeader.js"
import { verifiedToken } from "../utils/verifyToken.js"


export const isLoggedIn = (req,res,next)=>{
    //get token from header
    const token = getTokenFromHeader(req)
    //verify token
    const verified = verifiedToken(token)
   
if(!verified){
    throw new Error('Invalid/Expired Token,Login Again')
}else{
     //save the user into request object
    req.userAuthId =verified?.id
    next()
}
}