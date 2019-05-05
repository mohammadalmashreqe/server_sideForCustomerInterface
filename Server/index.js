let express = require('express')
let app = express();
const TicketsList = new Array();
TicketsList.push("A001");
const ticketsnumber = "A00";
let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);

/**
 *Port Number
 *
 */
const port = process.env.PORT || 3000;
/**
 *event fires when user connect 
 *
 */
io.on('connection', (socket) => {
    try {
    console.log('user connected');
    io.emit("UpadteList", TicketsList);
    socket.on('new-Tickets', () => {

        TicketsList.push(ticketsnumber + (TicketsList.length + 1));
        //here i want to tell rabbit q about what happens .

        updateTickitsList();
    });
    }
    catch(err)
    {
        console.log(err.message);
    }

});

/**
 *listen to the request  
 *
 */
server.listen(port, () => {
    try {
    console.log(`started on port: ${port}`);
    }
    catch(err)
    {
        console.log(err);
    }
});




/**
 *update tickets List and notify all connected user 
 *
 */
function updateTickitsList() {
    try {
    //notify all about update 
    io.emit("UpadteList", TicketsList);
    //to do :
    // sent to rabit  to store ticket in MQ
    }
    catch (err)
    {
        console.log(err);
    }
}