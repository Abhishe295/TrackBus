import jwt from 'jsonwebtoken';

const userAuth = async(req,res,next)=>{
    const {token} = req.cookies;
    if(!token){
        return res.json({success:false, message: "Not authorized. Login again"});
    }
    try{
        const tokenDecode = jwt.verify(token,process.env.JWT_SECRET);
        if(tokenDecode.id){
            req.userId = tokenDecode.id;
        }else{
            return res.json({success:false, message: "Not authorized. Login again"});
        }
        next();
    }catch(e){
        return res.json({success:false, message: e.message});
    }
}

export default userAuth;