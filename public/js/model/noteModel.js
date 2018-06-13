export default class Note {
    constructor({_id, title, description, importance, dueDate, createdAt, archived = false}) {
        this._id = _id;
        this.title = title;
        this.description = description;
        this.importance = importance;
        this.dueDate = dueDate;
        this.createdAt = createdAt;
        this.archived = archived;
    }
}
