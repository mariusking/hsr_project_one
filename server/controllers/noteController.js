const moment = require('moment');
const Datastore = require('nedb-promise');
const db = Datastore({filename: 'test.db', autoload: true, timestampData:true});

module.exports = {
    async get(req, res) {
        const _id = req.params.id;
        const note = await db.findOne({_id});
        res.send(note);
    },
    async all(req, res) {
        const {filter, sort} = req.query;
        let notes = await db.find({});
        notes = _filter(notes, filter);
        notes = _sort(notes, sort);

        res.send(notes);
    },
    async create(req, res) {
        const notesProps = req.body;
        const note = await db.insert({...notesProps});
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
    if (sort === 'createdAt') {
        fn = (a, b) => moment(a.createdAt).isBefore(moment(b.createdAt));
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
