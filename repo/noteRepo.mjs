import moment from 'moment';
import Datastore from 'nedb-promise';

const db = Datastore({filename: 'test.db', autoload: true, timestampData: true});

const noteRepo = (() => {
    async function get(_id) {
        return await db.findOne({_id});
    }

    async function all(filterArchived, sort) {
        let notes = await db.find({});
        notes = _filter(notes, filterArchived);
        notes = _sort(notes, sort);
        return notes;
    }

    async function create(note) {
        return await db.insert(note);
    }

    async function update(note) {
        return await db.update({_id: note._id}, note, {});

    }

    async function remove(_id) {
        await db.remove({_id}, {});
    }

    function _sort(notes, sort) {
        let fn = () => {
        };
        if (sort === 'createdAt') {
            fn = (a, b) => moment(a.createdAt).isBefore(moment(b.createdAt));
        } else if (sort === 'dueDate') {
            fn = (a, b) => {
                if (a.dueDate === '') {
                    return true;
                }
                return moment(a.dueDate).isAfter(moment(b.dueDate))
            }
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

export default noteRepo;
