let express = require('express')
let app = express();
const TicketsList = new Array();

const ticketsnumber = "A00";
let http = require('http');
let server = http.Server(app);
var amqp = require('amqplib/callback_api');

let socketIO = require('socket.io');
let io = socketIO(server);
/**
* API to handel customet request 
*
*/

app.get("/newTickets", (req, res) => {
    try {



        amqp.connect('amqp://localhost', function (error0, connection) {
            if (error0) {
                throw error0;
            }
            connection.createChannel(function (error1, channel) {
                if (error1) {
                    throw error1;
                }
                var exchange = 'Tickets';
                var msg = ticketsnumber + (TicketsList.length + 1);

                channel.assertExchange(exchange, 'fanout', {
                    durable: false
                });
                channel.publish(exchange, 'Mqueue', Buffer.from(msg));
                console.log(" [x] Sent %s", msg);
            });

            setTimeout(function () {
                connection.close();
                process.exit(0);
            }, 500);
        });

        io.emit("UpadteList", TicketsList);








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
       
        
        amqp.connect('amqp://localhost', function(error0, connection) {
            if (error0) {
              throw error0;
            }
            connection.createChannel(function(error1, channel) {
              if (error1) {
                throw error1;
              }
              var exchange = 'Tickets';
          
              channel.assertExchange(exchange, 'fanout', {
                durable: false
              });
          
              channel.assertQueue('', {
                exclusive: true
              }, function(error2, q) {
                if (error2) {
                  throw error2;
                }
                console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", q.queue);
                channel.bindQueue(q.queue, exchange, '');
             
          
                channel.consume(q.queue, function(msg) {
                  if(msg.content) {
                      console.log(" [x] %s", msg.content.toString());
                      TicketsList.push(msg);
                    }
                }, {
                  noAck: true
                });
              });
            });
          });


    }
    catch (err) {
        console.log(err);
    }
});



