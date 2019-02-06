module.exports = (app) => {
    const concertDetails = require('../controllers/concert.controller.js');

    // Create a new customer
    app.post('/api/addCustomer', concertDetails.create);

    // Retrieve all events
    app.get('/api/getAllCustomers', concertDetails.findAll);

    // Retrieve a single event with eventId
    app.get('/api/getDetailsById/:ticketId', concertDetails.findOne);

    // Update a event with eventId
    //app.put('/api/putDetailsById/:ticketId', concertDetails.update);

    // Delete a event with eventId
    //app.delete('/api/deleteByTicketId/:ticketId', concertDetails.delete);
}