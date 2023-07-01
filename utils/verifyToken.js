import jwt from 'jsonwebtoken';

export const verifiedToken = (token)=>{
    return jwt.verify(token,process.env.JWT_KEY,(err,decoded)=>{
        if(err){
            return 'Token Invalid/Expired'
        }else{
            return decoded
        }
    })
}