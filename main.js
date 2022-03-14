const express = require("express");
const res = require("express/lib/response");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

const connect = () =>{
    mongoose.connect("mongodb://127.0.0.1:27017/Unit_4_C2");
}

const userschema = mongoose.Schema({
    firstName : {type : String, required : true},
    middleName : {type : String},
    lastName : {type : String, required : true},
    age : {type : Number, required : true},
    email : {type : String, required : true},
    address : {type : String, required : true},
    gender : {type : String},
    createdAt : {type : String, required : true},
    updatedAt : {type : String, required : true},
})

const User = mongoose.Schema("user",userschema);

const branchDetailschema = mongoose.Schema({
    name : {type : String, required : true},
    address : {type : String, required : true},
    IFSC : {type : String, required : true},
    MICR : {type : String, required : true},
    createdAt : {type : String, required : true},
    updatedAt : {type : String, required : true},
})

const BranchDetail = mongoose.model("branchDetail",branchDetailschema);

const masterAccountschema = mongoose.Schema({
    UserId : {type : mongoose.Schema.Types.ObjectId, ref : "user" , required : true, unique : true},
    branch : {type : mongoose.Schema.Types.ObjectId, ref : "branchDetails" , required : true , unique : true},
    balance : {type : Number, required : true},
    createdAt : {type : String, required : true},
    updatedAt : {type : String, required : true},
})

const MasterAccount = mongoose.model("masterAccount", masterAccountschema);

const savingAccountschema = mongoose.Schema({
    UserId : {type : mongoose.Schema.Types.ObjectId, ref : "masterAccount" , required : true},
    account_number : {type : Number, required : true},
    balance : {type : Number, required : true},
    interestRate : {type : String, required : true},
    createdAt : {type : String, required : true},
    updatedAt : {type : String, required : true},
})

const SavingAccount = mongoose.model("savingAccount",savingAccountschema);

const fixedAccountschema = mongoose.Schema({
    UserId : {type : mongoose.Schema.Types.ObjectId, ref : "masterAccount" , required : true}, 
    account_number : {type : Number, required : true},
    balance : {type : Number, required : true},
    interestRate : {type : String, required : true},
    startDate : {type : String, required : true},
    maturityDate : {type : String, required : true},
    createdAt : {type : String, required : true},
    updatedAt : {type : String, required : true},
})
const FixedAccount = mongoose.model("fixedAccount",fixedAccountschema);



app.get("/masterAccount", async (req,res) =>{
    try{
        const master = await MasterAccount.find({}).populate("userId").lean().exec();
        return res.status(200).send(master);
    }catch(err){
        return res.status(500).send({message : err.message});
    }
})

app.post("/savingAccount", async (req,res) =>{
    try{
        const saving = await SavingAccount.create(req.body);
        return res.status(200).send(saving);
    }catch(err){
        return res.status(500).send({message : err.message});
    }
})

app.post("/fixedAccount", async (req,res) =>{
    try{
        const fixed = await FixedAccount.create(req.body);
        return res.status(200).send(fixed);
    }catch(err){
        return res.status(500).send({message : err.message});
    }
})

app.get("/accountDetails/:id", async (req,res) =>{
        try{
            const accounts1 = await SavingAccount.find(req.params.id);
            const accounts2 = await FixedAccount.find(req.params.id);
            return res.status(200).send(accounts1,accounts2);
        }catch(err){
            return res.status(500).send({message : err.message});
        }
})

app.listen(8000,async () =>{
    try{
        await connect();
    }catch(err){
        res.status(500).send("something went wrong");
    }
    console.log("listening at port 8000");
})