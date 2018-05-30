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

    archive() {
        this.archived = true;
    }

    unarchive() {
        this.archived = false;
    }
}

//noteservices
const noteservices = (() => {
    let filter = true;
    let sort = 'dueDate';

    function _generateId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    function _sort(notes) {
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

    function _filter(notes) {
        if (!filter) {
            return notes.filter(note => !note.archived);
        }
        return notes;
    }

    async function _all() {
        return new Promise((resolve) => {
            let notes = JSON.parse(localStorage.getItem("notes")) || {};
            resolve(notes);
        })
    }

    async function _write(notes) {
        return new Promise(async (resolve) => {
            localStorage.setItem("notes", JSON.stringify(notes));
            resolve();
        });
    }

    async function save(note) {
        return new Promise(async (resolve) => {
            const notes = await _all();
            if (!note.id) {
                note.id = _generateId();
                note.dateCreated = moment();
            }
            notes[note.id] = note;
            _write(notes);
            resolve(note);
        });
    }

    async function get(id) {
        return new Promise(async (resolve) => {
            const notes = await _all();
            resolve(new Note(notes[id]));
        })
    }

    async function all() {
        return new Promise(async (resolve) => {
            const notesObject = await _all();
            let notes = Object.values(notesObject);
            notes = notes.map(note => new Note(note));

            notes = _filter(notes);
            notes = _sort(notes);

            resolve(notes);
        });
    }

    function isFiltred() {
        return filter;
    }

    function toggleFilter() {
        filter = !filter;
    }

    function setSort(sort) {
        this.sort = sort;
    }

    function getSort() {
        return sort;
    }

    return {
        save,
        get,
        all,
        isFiltred,
        toggleFilter,
        setSort,
        getSort
    }
})();
