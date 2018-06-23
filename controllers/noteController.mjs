import nodeRepo from './../repo/noteRepo.mjs';
import noteRepo from "../repo/noteRepo";

const noteController = (() => {
    async function get(req, res) {
        const _id = req.params.id;
        const note = await nodeRepo.get(_id);
        res.send(note);
    }

    async function all(req, res) {
        const {filterArchived, sort} = req.query;
        let notes = await nodeRepo.all(filterArchived, sort);
        res.send(notes);
    }

    async function create(req, res) {
        const notesProps = req.body;
        const note = await noteRepo.create(notesProps);
        res.send(note);
    }
    async function update(req, res) {
        const notesProps = req.body;
        await noteRepo.update(notesProps);
        res.send(notesProps);

    }
    async function remove(req, res) {
        const _id = req.params.id;
        await noteRepo.remove(_id);
        res.send();
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
