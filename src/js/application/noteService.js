import NoteRepo from '../repo/noteRepo.js';

export default class NoteService {
    constructor() {
        this.filter = true;
        this.sort = 'dueDate';
        this._noteRepo = new NoteRepo();
    }

    async save(note) {
        return await this._noteRepo.save(note);
    }

    async get(id) {
        return await this._noteRepo.get(id);
    }

    async all() {
        return await this._noteRepo.all({filter: this.filter, sort: this.sort});
    }

    async archive(id) {
        const note = await this._noteRepo.get(id);
        note.archived = true;
        await this._noteRepo.save(note);
    }

    async unarchive(id) {
        const note = await this._noteRepo.get(id);
        note.archived = false;
        await this._noteRepo.save(note);
    }

    toggleFilter() {
        this.filter = !this.filter;
    }
}
