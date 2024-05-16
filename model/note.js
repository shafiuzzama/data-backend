const mongoose = require('mongoose');


const noteSchema = mongoose.Schema({
    note:String,
    count:Number,
})

const NotesModel = mongoose.model('note',noteSchema);



module.exports={NotesModel};