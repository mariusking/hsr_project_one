import moment from 'moment';
import Datastore from 'nedb-promise';


const db = Datastore({filename: 'test.db', autoload: true, timestampData:true});

const noteController = (() => {
    async function get(req, res) {
        const _id = req.params.id;
        const note = await db.findOne({_id});
        res.send(note);
    }

    async function all(req, res) {
        const {filterArchived, sort} = req.query;
        let notes = await db.find({});
        notes = _filter(notes, filterArchived);
        notes = _sort(notes, sort);

        res.send(notes);
    }

    async function create(req, res) {
        const notesProps = req.body;
        const note = await db.insert({...notesProps});
        res.send(note);
    }
    async function update(req, res) {
        const notesProps = req.body;
        await db.update({_id: notesProps._id}, notesProps, {});
        res.send(notesProps);

    }
    async function remove(req, res) {
        const id = req.params.id;
        await db.remove({_id: id}, {});
        res.send();
    }

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

    function _filter(notes, filterArchived) {
        if ('true' === filterArchived) {
            return notes.filter(note => !note.archived);
        }
        return notes;
    }

    return {
        get,
        all,
        create,
        update,
        remove
    }
})();

export default noteController;
