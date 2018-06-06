export default class NoteRepo {
    async save(note) {
        console.log(note);
        if (note._id) {
            return this._update(note);
        } else {
            return this._create(note);
        }
    }

    async get(id) {
        const res = await fetch(`/api/notes/${id}`, {
            method: 'GET'
        });
        return await res.json();
    }

    async all({filter, sort}) {
        const res = await fetch(`/api/notes`, {
            method: 'GET'
        });
        return await res.json();
    }

    async _update(note) {
        const res = await fetch(`/api/notes/${note._id}`, {
            body: JSON.stringify(note),
            headers: {
                'content-type': 'application/json'
            },
            method: 'PUT'
        });
        return res.json();
    }

    async _create(note) {
        const res = await fetch('/api/notes', {
            body: JSON.stringify(note),
            headers: {
                'content-type': 'application/json'
            },
            method: 'POST'
        });
        return res.json();
    }
}
