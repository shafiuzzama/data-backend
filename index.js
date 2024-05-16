const express = require('express');
require('dotenv').config();
const cors = require('cors');
const {connection}=require('./config/db.js');
const {NotesModel}= require('./model/note');
const app = express();
app.use(express.json());
app.use(cors());



app.get('/', async (req, res) => {
    try {
        const tasks = await NotesModel.find();
        const totalTasks = await NotesModel.countDocuments()
        res.status(200).send({tasks,totalTasks});
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error"); 
    }
});

    


app.post('/create',async(req,res)=>{
    try{
        const {data} = req.body;
        const task = await NotesModel.create(data);
        res.send({task});
    }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error"); 

    }
})
app.patch('/update/:noteID', async (req, res) => {
    try {
        const { noteID } = req.params;
        const payload = req.body;

        const getNote = await NotesModel.findOne({ _id: noteID }).lean();
        if (!getNote) {
            return res.status(404).send({ "msg": "Note not found" });
        }

        payload.updateCount = Number(getNote.updateCount) + 1;

        const note = await NotesModel.findOneAndUpdate({ _id: noteID }, payload, { new: true });
        if (note) {
            res.send({ "msg": "Successfully updated", note: note });
        } else {
            res.send({ "msg": "Not authorized to update" });
        }
    } catch (err) {
        console.error("Error from user routes update request");
        console.error(err);
        res.status(500).send("Internal Server Error"); // Sending an error response if something goes wrong
    }
});


app.delete('/delete/:noteID',async(req,res)=>{
    try{
        const {noteID}= req.params;
        if(noteID){
            const note = await NotesModel.findOneAndDelete({_id:noteID});
            if(note){
                res.send({"msg":"succesfully deleted"})
            }else{
            res.send({"msg":"try after some time"});
            }
        }else{
           res.send ({"msg":"enter notes id"});
        }
    }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error"); // Sending an error response if something goes wrong

    }
})


app.listen(3000,async(err)=>{
try{
await connection();
console.log(`server is listining ${3000}`);
}catch(err){
    console.log("err from connect to db");
    console.log(err);
}
})



