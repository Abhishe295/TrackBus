import mongoose  from "mongoose";

const busSchema = new mongoose.Schema({
    busNumber:{
        type:String,
        required: true,
        unique: true,
    },
    routeName: String,
    active:{
        type:Boolean,
        default: true,
    },
},{timestamps: true});

export default mongoose.model("Bus",busSchema);