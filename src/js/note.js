//classes
class Note {
    constructor({id, title, description, importance, dueDate, dateCreated, archived = false}) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.importance = importance;
        this.dueDate = dueDate;
        this.dateCreated = dateCreated;
        this.archived = archived;
    }
}

//noteservices
const noteservices = {
    save: async (note) => {
        return new Promise(async (resolve) => {
            const notes = await noteservices._all();
            if (!note.id) {
                note.id = generator.id();
                note.dateCreated = moment();
            }
            notes[note.id] = note;
            noteservices._set(notes);
            resolve(note);
        });
    },
    get: async (id) => {
        return new Promise(async (resolve) => {
            const notes = await noteservices._all();
            resolve(notes[id]);
        })
    },
    all: async () => {
        return new Promise(async (resolve) => {
            const notesObject = await noteservices._all();
            let notes = Object.values(notesObject);

            noteservices.sortAttribute = 'dueDate';

            notes = noteservices._filter(notes);
            notes = noteservices._sort(notes);

            resolve(notes);
        });
    },
    _sort: (notes) => {
        let fn = () => {};
        if (noteservices.sortAttribute === 'dateCreated') {
            fn = (a, b) => {
                return moment(a.dateCreated).isBefore(moment(b.dateCreated));
            };
        } else if (noteservices.sortAttribute === 'dueDate') {
            fn = (a, b) => {
                return moment(a.dueDate).isAfter(moment(b.dueDate));
            };
        } else if (noteservices.sortAttribute === 'importance') {
            fn = (a, b) => {
                return a.importance < b.importance;
            };
        }
        return notes.sort(fn);
    },
    _filter: (notes) => {
        if (!noteservices.showArchived) {
            return notes.filter(note => !note.archived);
        }
        return notes;
    },
    _all: async () => {
        return new Promise((resolve) => {
            let notes = JSON.parse(localStorage.getItem("notes")) || {};

            resolve(notes);
        })
    },
    _set: async (notes) => {
        return new Promise(async (resolve) => {
            localStorage.setItem("notes", JSON.stringify(notes));
            resolve();
        });
    }
};

const generator = {
    id: () => {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
};
