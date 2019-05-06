let express = require('express')
let app = express();
const TicketsList = new Array();

const ticketsnumber = "A00";
let http = require('http');
let server = http.Server(app);

let socketIO = require('socket.io');
let io = socketIO(server);
/**
* API to handel customet request 
*
*/

app.get("/newTickets", (req, res) => {
    try {
        TicketsList.push(ticketsnumber + (TicketsList.length + 1));

        io.emit("UpadteList", TicketsList);
        //save tickits in Rabbit Message Queue 
        produceTickitsToMQ(TicketsList[TicketsList.length - 1]);
    }
    catch (err) {
        console.log(err);
    }
});
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

    }
    catch (err) {
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
    catch (err) {
        console.log(err);
    }
});



/**
 *produce Tickits To MQ
 *
 */
function produceTickitsToMQ(TickitsNumberMQ) {
    var q = 'Tickets';

    var open = require('amqplib').connect('amqp://localhost');

    // Publisher
    open.then(function (conn) {
        return conn.createChannel();
    }).then(function (ch) {
        return ch.assertQueue(q).then(function (ok) {
            return ch.sendToQueue(q, Buffer.from(TickitsNumberMQ));
        });
    }).catch(console.warn);

}


/**
 *Start up code to read daa from QM service 
 *
 */
function LoadDataFromQM() {
    try {

    }
    catch (err) {

        console.log(err);
    }
}