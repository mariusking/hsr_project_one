import Note from '../datamodel/noteModel.js';

const someNotes = {
    "_jk3n6nmf0": {
        "__id": "_jk3n6nmf0",
        "title": "i'm a note",
        "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
        "importance": "5",
        "dueDate": "2018-06-30",
        "createdAt": "2018-06-06T12:27:45.026Z",
        "archived": false
    },
    "_0lrilwmsm": {
        "_id": "_0lrilwmsm",
        "title": "wuhuu another note",
        "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
        "importance": "2",
        "dueDate": "2018-06-19",
        "createdAt": "2018-06-06T12:28:50.615Z",
        "archived": false
    },
    "_0lsengfem": {
        "_id": "_0lsengfem",
        "title": "ooh! i'm a note too",
        "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
        "importance": "3",
        "dueDate": "2018-06-22",
        "createdAt": "2018-06-05T12:28:50.615Z",
        "archived": false
    },
    "_a4d0dlair": {
        "_id": "_a4d0dlair",
        "title": "why i'm archived",
        "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
        "importance": "3",
        "dueDate": "2018-04-22",
        "createdAt": "2018-04-05T12:28:50.615Z",
        "archived": true
    }
};

export default class NoteRepo {
    async save(note) {
        return new Promise(async (resolve) => {
            const notes = await this._all();
            if (!note._id) {
                note._id = this._generateId();
                note.createdAt = moment();
            }
            notes[note._id] = note;
            this._write(notes);
            resolve(note);
        });
    }

    async get(id) {
        return new Promise(async (resolve) => {
            const notes = await this._all();
            resolve(new Note(notes[id]));
        })
    }

    async all({filter, sort}) {
        return new Promise(async (resolve) => {
            const notesObject = await this._all();
            let notes = Object.values(notesObject);
            notes = notes.map(note => new Note(note));

            notes = this._filter(notes, filter);
            notes = this._sort(notes, sort);

            resolve(notes);
        });
    }

    _sort(notes, sort) {
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

    _filter(notes, filter) {
        if (!filter) {
            return notes.filter(note => !note.archived);
        }
        return notes;
    }

    async _all() {
        return new Promise((resolve) => {
            let notes = JSON.parse(localStorage.getItem("notes")) || someNotes;
            resolve(notes);
        })
    }

    async _write(notes) {
        return new Promise(async (resolve) => {
            localStorage.setItem("notes", JSON.stringify(notes));
            resolve();
        });
    }

    _generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
}
