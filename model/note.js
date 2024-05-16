const mongoose = require('mongoose');

const noteSchema = mongoose.Schema({
    note: String,
    updateCount: {
        type: Number,
        default: 0 
    }
});

const NotesModel = mongoose.model('note',noteSchema);


module.exports={NotesModel};