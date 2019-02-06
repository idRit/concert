let ConcertSchema = require('../models/concert.model.js');

function generateTicketId() {
    let fourDigit = Math.floor(1000 + Math.random() * 9000);
    let timeString = new Date().getMilliseconds();
    return ('${fourDigit}C${timeString}'); 
}

exports.create = (req, res) => {
    // Validate request
    if(!req.body.name || !req.body.contactNo || !req.body.email) {
        return res.status(400).send({
            message: "Some feilds are nessecary"
        });
    }

    if(/^(\+\d{1,3}[- ]?)?\d{10}$/.test(req.body.contactNo)) {
        return res.status(400).send({
            message: "Incorrect Contact Number"
        });
    }

    if(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(req.body.email)) {
        return res.status(400).send({
            message: "Incorrect Contact Number"
        });
    }

    // Create a concert attendee
    const concertObject = new ConcertSchema({
        ticketId: generateTicketId(),
        name: req.body.name,
        contactNo: req.body.contactNo,
        email: req.body.email,
        referencedBy: req.body.referencedBy || 'technical core',
        isScanned: false
    });

    // Save attendee in the database
    concertObject.save()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Note."
        });
    });
};

exports.findAll = (req, res) => {
    ConcertSchema.find()
    .then(data => {
        res.send(data);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving ticket."
        });
    });
};

exports.findOne = (req, res) => {
    ConcertSchema.findById(req.params.ticketId)
    .then(ticket => {
        if(!ticket) {
            return res.status(404).send({
                message: "Ticket not found with id " + req.params.ticketId
            });            
        }
        if(!ticket.isScanned) {
            EventSchema.findOneAndUpdate(req.params.ticketId, {
                isScanned: true
            }, {new: true})
            .then(ticket => {
                if(!ticket) {
                    return res.status(404).send({
                        message: "Event not found with id " + req.params.ticketId
                    });
                }
                res.send(event);
            }).catch(err => {
                if(err.kind === 'ObjectId') {
                    return res.status(404).send({
                        message: "Event not found with id " + req.params.ticketId
                    });                
                }
                return res.status(500).send(
                    {
                    message: "Error updating ticket with id " + req.params.ticketId
                });
            });
            res.send(ticket);
        } else {
            return res.status(406).send({
                message: "Ticket already in use with id: " + req.params.ticketId
            });
        }
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Ticket not found with id " + req.params.ticketId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving Ticket with id " + req.params.ticketId
        });
    });
};

exports.update = (req, res) => {
    // Validate request
    if(!req.body.name || !req.body.contactNo || !req.body.email || !req.body.referencedBy) {
        return res.status(400).send({
            message: "All feilds are nessecary"
        });
    }

    if(/^(\+\d{1,3}[- ]?)?\d{10}$/.test(req.body.contactNo)) {
        return res.status(400).send({
            message: "Incorrect Contact Number"
        });
    }

    if(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/.test(req.body.email)) {
        return res.status(400).send({
            message: "Incorrect Contact Number"
        });
    }

    // Find event and update it with the request body
    EventSchema.findOneAndUpdate(req.params.ticketId, {
        name: req.body.name,
        contactNo: req.body.contactNo,
        email: req.body.email,
        referencedBy: req.body.referencedBy
    }, {new: true})
    .then(ticket => {
        if(!ticket) {
            return res.status(404).send({
                message: "Event not found with id " + req.params.ticketId
            });
        }
        res.send(event);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Event not found with id " + req.params.ticketId
            });                
        }
        return res.status(500).send(
            {
            message: "Error updating ticket with id " + req.params.ticketId
        });
    });
};

exports.delete = (req, res) => {
    ConcertSchema.findOneAndDelete(req.params.ticketId)
    .then(ticket => {
        if(!ticket) {
            return res.status(404).send({
                message: "Ticket not found with id " + req.params.ticketId
            });
        }
        res.send({message: "Ticket deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Ticket not found with id " + req.params.ticketId
            });                
        }
        return res.status(500).send({
            message: "Could not delete ticket with id " + req.params.ticketId
        });
    });
};