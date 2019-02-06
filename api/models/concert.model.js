const mongoose = require('mongoose');

const concertSchema = new mongoose.Schema({
    ticketId: String,
    name: String,
    contactNo: String,
    email: String,
    referencedBy: String,
    isScanned: Boolean
}, {
    timestamps: true    
});

module.exports = mongoose.model('ConcertSchema', concertSchema);