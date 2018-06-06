import Note from './../model/noteModel.js';

export default class NoteRepo {
    async save(note) {
        return new Promise(async (resolve) => {
            const notes = await this._all();
            if (!note.id) {
                note.id = this._generateId();
                note.dateCreated = moment();
            }
            notes[note.id] = note;
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
        if (sort === 'dateCreated') {
            fn = (a, b) => moment(a.dateCreated).isBefore(moment(b.dateCreated));
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
            let notes = JSON.parse(localStorage.getItem("notes")) || {};
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
