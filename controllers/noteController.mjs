import nodeRepo from './../repo/noteRepo.mjs';
import noteRepo from "../repo/noteRepo";

const noteController = (() => {
    async function get(req, res, next) {
        const _id = req.params.id;
        try {
            const note = await nodeRepo.get(_id);
            res.send(note);
        } catch(e) {
            next(e);
        }
    }

    async function all(req, res, next) {
        const {filterArchived, sort} = req.query;

        try {
            let notes = await nodeRepo.all(filterArchived, sort);
            res.send(notes);
        } catch (e) {
            next(e);
        }
    }

    async function create(req, res, next) {
        const notesProps = req.body;

        try {
            const note = await noteRepo.create(notesProps);
            res.send(note);
        } catch (e) {
            next(e);
        }
    }
    async function update(req, res, next) {
        const notesProps = req.body;

        try {
            await noteRepo.update(notesProps);
            res.send(notesProps);
        } catch (e) {
            next(e);
        }

    }
    async function remove(req, res, next) {
        const _id = req.params.id;

        try {
            await noteRepo.remove(_id);
            res.send();
        } catch (e) {
            next(e);
        }
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
