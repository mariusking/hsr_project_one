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
        const {filter, sort} = req.query;
        let notes = await db.find({});
        notes = _sort(notes, sort);
        notes = _filter(notes, filter);

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

function _sort(notes, sort) {
    let fn = () => {
    };
    if (sort === 'dateCreated') {
        fn = (a, b) => moment(a.dateCreated).isBefore(moment(b.dateCreated));
    } else if (sort === 'dueDate') {
        fn = (a, b) => moment(a.dueDate).isAfter(moment(b.dueDate))
    } else if (sort === 'importance') {
        fn = (a, b) => a.importance < b.importance
    }
    return notes.sort(fn);
}

function _filter(notes, filter) {
    if (!filter) {
        return notes.filter(note => !note.archived);
    }
    return notes;
}
