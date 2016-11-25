var mongodb = require('mongodb');
var ObjectID = mongodb.ObjectID;
var MONGODB_URI = 'mongodb://localhost:27017/notesdb';
var notes;

mongodb.MongoClient.connect(MONGODB_URI, function(err, database) {
    if(err){
        throw err;
    } else {
        console.log('Connected to database: '+ MONGODB_URI);
    }
    db = database;
    notes = db.collection('notes');
});

exports.findAll = function(req, res) {
    console.log('Retrieving All Notes');
    notes.find().toArray(function(err, items) {
        res.status(200);
        res.send(items);
    });
};

exports.deleteAll = function(req, res) {
    console.log('Deleting All Notes');
    notes.remove(
        {},
        function(err, data) {
            if (err){
                console.log("Failed to Delete");
                throw err;
            }
            res.status(200);
            res.send(
                {'Deleted': data}
            );
        });
};

exports.findAllUserNotes = function(req, res){
    var userId = req.params.userId;
    console.log('Retrieving All Notes for User: ' + userId);
    notes.find({ '_id': new ObjectID(userId)}).toArray(function(err, items) {
        res.status(200);
        res.send(items);
    });
};

exports.findOneUserNoteByTitle = function(req, res){
    var userId = req.params.userId;
    var title = req.params.title;
    console.log('Retrieving Note for User "' + userId + '" with Title "' + title +'"');
    notes.find(
        { '_id': new ObjectID(userId), 'notes.title': title},
        { 'notes.notes.$': 1 }).toArray(function(err, doc) {
            matching = JSON.parse(JSON.stringify(doc));
            note = matching[0].notes[0];
            res.status(200);
            res.send(note);
        });
};

exports.addOneUserNote = function(req, res) {
    var userId = req.params.userId;
    console.log('Adding Note');
    console.log(req.body);
    notes.update(
        {'_id': new ObjectID(userId)},
        {$push: { notes: req.body}},
        {w:1},
        function(err, data) {
            if (err) {
                throw err;
            } else {
                res.status(200);
                res.send({'Note Added': data});
            }
        }
    );
};

exports.updateOneUserNote = function(req, res){
    var userId = req.params.userId;
    var title = req.params.title;
    var newDoc = req.body;
    console.log('Updating Note for User: ' + userId + ' with Title: ' + title);
    notes.update(
        {'_id': new ObjectID(userId), 'notes.title': title},
        {$set: {'notes.$': newDoc}},
        {w:1},
        function(err, data) {
            if(err) {
                throw err;
            } else {
                res.status(200);
                res.send({'Updated': data});
            }
        }
    );
};

exports.deleteOneUserNote = function(req, res) {
    var userId = req.params.userId;
    var title = req.params.title;
    var newDoc = req.body.notes;
    console.log('Updating Notes for User: ' + userId + ' with Title: ' + title);
    notes.update(
        {'_id': new ObjectID(userId), 'notes.title': title},
        {$pull: {notes: {title: title}}},
        function(err, data){
            if(err) {
                throw err;
            } else {
                res.status(200);
                res.send({'Deleted': data});
            }
        });
};