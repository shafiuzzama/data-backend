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

        const task = await NotesModel.create({note:data});
        res.status(200).send({task});
    }catch(err){
        console.log(err);
        res.status(500).send("Internal Server Error"); 

    }
})


app.patch('/update/:noteID', async (req, res) => {
    try {
        const { noteID } = req.params;
        const {payload} = req.body;

        const getNote = await NotesModel.findOne({ _id: noteID }).lean();
        if (!getNote) {
            return res.status(404).send({ "msg": "Note not found" });
        }

        const updateCount = Number(getNote.updateCount) + 1;

        const note = await NotesModel.findOneAndUpdate({ _id: noteID }, {note:payload,updateCount}, { new: true });
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




app.delete('/deleteAll', async (req, res) => {
    try {
        const deleteResult = await NotesModel.deleteMany({});
        if (deleteResult.deletedCount > 0) {
            res.send({"msg": "Successfully deleted all items"});
        } else {
            res.send({"msg": "No items found to delete"});
        }
    } catch (err) {
        console.log(err);
        res.status(500).send("Internal Server Error"); // Sending an error response if something goes wrong
    }
})



app.listen(3000,async(err)=>{
try{
await connection();
console.log(`server is listining ${3002}`);
}catch(err){
    console.log("err from connect to db");
    console.log(err);
}
})



