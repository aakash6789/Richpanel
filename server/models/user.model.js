import mongoose from "mongoose";
import  bcrypt from "bcrypt";
import  jwt  from "jsonwebtoken";

const userSchema=new mongoose.Schema({
    Name:{
        type:String,
        require:true,
        unique:true,
        trim:true,
        index:true
    }, 
    email:{
        type:String,
        require:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true
    },
    password:{
        type:String,
        require:[true, "Password is required"]
    }
},{timestamps:true});

userSchema.pre('save',async function(next) {
    if(this.isModified('password')){
        this.password=await bcrypt.hash(this.password,10);
    }
    next();  
})

userSchema.methods.isPasswordCorrect=async function (password) {
    return await bcrypt.compare(password,this.password);
}

userSchema.methods.generateAccessToken=async function(){
   return await jwt.sign(
        {
            _id:this._id,
            email:this.email,
            Name:this.Name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn:process.env.ACCESS_TOKEN_EXPIRY
        }
    );
}
userSchema.methods.generateRefreshToken=async function(){
    return await jwt.sign(
        {
            _id:this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn:process.env.REFRESH_TOKEN_EXPIRY
        }
    )

}

const User=mongoose.model('User',userSchema);

export {User};
