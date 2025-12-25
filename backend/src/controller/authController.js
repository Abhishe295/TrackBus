import transporter from "../config/nodemailer.js";
import userModel from "../model/userModel.js";
import bcrypt from 'bcryptjs';
import generateToken from "../utils/generateToken.js";


export const register = async(req,res)=>{
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json({success:false,message: "All fields required"});
    }
    try {
        const existingUser = await userModel.findOne({email});

        if (existingUser){
            return res.status(409).json({success:false,message: "User already exists"});
        }

        const hashedPassword = await bcrypt.hash(password,10);
        const user = new userModel({name,email,password:hashedPassword});
        await user.save();

        const token = generateToken(user._id);
        res.cookie('token',token,{
            httpOnly: true,
            secure: process.env.NODE_ENV ==='production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7*24*60*60*1000

        });

        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: 'Welcome, Yeah buddy',
            text: 'Hi you, Thanks to register on my webstie now enjoy yourself on my site'
        };

        await transporter.sendMail(mailOptions);
        return res.json({success:true});


    } catch (error) {
        res.json({success:false,message: "Internal Server Error"});
        
    }
};

export const login = async(req,res)=>{
    const {email,password} = req.body;
    if (!email||!password){
        return res.status(400).json({success:false,message: "All fields required"});
    }
    try {
        const user = await userModel.findOne({email})
        if(!user){
            return res.json({success:false,message:"Invalid Email"});
        }
        const isMatch = await bcrypt.compare(password,user.password);
        if (!isMatch){
            return res.json({success:false,message:"Invalid Password"});
        }
        const token = generateToken(user._id);

        res.cookie('token',token,{
            httpOnly: true,
            secure :process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7*24*60*60*1000
        });

        return res.status(200).json({success:true, message:"Logged In Succesfully"});


    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal Server Error"});
        
    }
};

export const logout = async(req,res) =>{
    try {
        res.clearCookie('token',{
            httpOnly: true,
            secure :process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',

        });
        return res.status(200).json({success:true,message: "Logged Out Succesfully"});
    } catch (error) {
        console.log(error);
        return res.status(500).json({success:false,message:"Internal Server Error"});
        
    }
}

export const getUserData = async(req,res)=>{
    const user = await userModel.findById(req.userId);
    if(!user){
        return res.json({success:false, message: "User not found"});
    }

    return res.json({
        userData:{
            _id:user._id,
            name: user.name,
            profilePic: user.profilePic
        }
    })
}

// export const sendverifyOtp = async (req,res)=>{
//     try {
//         const user = await userModel.findById(req.userId);

//         if(user.isAccountVerified){
//             return res.json({success:false, message:"User is already Verified"});
//         }

//         const otp =  String( Math.floor(100000 + Math.random()*900000));

//         user.verifyOtp = otp
//         user.verifyOtpExpireAt = Date.now() + 24*60*60*1000;

//         await user.save()

//         const mailOptions = {
//             from: process.env.SENDER_EMAIL,
//             to: user.email,
//             subject: 'Verify your Account',
//             text: `Otp for verifying your account is ${otp}. OTP expires in one day so don't hurry yourself`
//         };

//         await transporter.sendMail(mailOptions);
//         res.json({success:true, message:'Verification OTP is sent Succesfully'});

//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({success:false,message:"Internal Server Error"}); 
//     }
// };

// export const verifyEmail = async(req,res)=>{
//     const{otp} = req.body;

//     try {
//         const user = await userModel.findById(req.userId);
//         if(!user){
//             return res.json({success:false, message:"User not found"});
//         }
//         if(otp==''|| otp != user.verifyOtp){
//             return res.json({success:false, message: "Invalid Otp"});
//         }
//         if(user.verifyOtpExpireAt<Date.now()){
//             return res.json({success:false, message: "Otp expired"});
//         }

//         user.isAccountVerified = true;
//         user.verifyOtp = '';
//         user.verifyOtpExpireAt = 0;

//         await user.save()
//         return res.json({success:true, message:"Account Verified Succesfully"});


//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({success:false,message:"Internal Server Error"});
        
//     }

// };