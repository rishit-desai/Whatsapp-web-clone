const io = require('socket.io')(5000, {
    cors: {
        origin: "*",

    },
});
const mongo = require('mongodb').MongoClient;
const url = 'mongodb+srv://common:qawsedrftg!23@cluster0.xotdl.mongodb.net';
const dbName = 'chat';
const collectionName = 'messages';
var db;

mongo.connect(url, (err, client) =>
{
    if (err)
    {
        console.log(err);
        return;
    }
    else
    {
        db = client.db(dbName);    
        console.log('Connected to MongoDB');
    }
    
});


io.on('connection', (socket) =>
{
    const id = socket.handshake.query.id;
    socket.join(id);

    socket.on('send-message', ({ recipients, text }) =>
    {
        recipients.forEach(recipient =>
        {
            const newRecipients = recipients.filter(r => r != recipient);
            newRecipients.push(id);
            db.collection(collectionName).insertOne({ recipients: newRecipients, text: text, sender: id }, (err, result) =>
            {
               if (err)
               {
                   console.log(err);
               } 
            });
            socket.broadcast.to(recipient).emit('recieve-message', { recipients: newRecipients, sender: id, text });
        });
    });
});