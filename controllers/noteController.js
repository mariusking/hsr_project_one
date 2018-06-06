const moment = require('moment');
const Datastore = require('nedb-promise');
const db = Datastore({filename: 'test.db', autoload: true});

module.exports = {
    async get(req, res) {
        const _id = req.params.id;
        const note = await db.findOne({_id});
        res.send(note);
    },
    async all(req, res) {
        const notes = await db.find({});
        res.send(notes);
    },
    async create(req, res) {
        const notesProps = req.body;
        const note = await db.insert({...notesProps, dateCreated: new Date()});
        res.send(note);
    },
    async update(req, res) {
        const notesProps = req.body;
        await db.update({_id: notesProps._id}, notesProps, {});
        res.send(notesProps);

    },
    async delete(req, res) {
        const id = req.params.id;
        await db.remove({_id: id}, {});
        res.send();
    }
};
