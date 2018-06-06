export default class Note {
    constructor({_id, title, description, importance, dueDate, dateCreated, archived = false}) {
        this._id = _id;
        this.title = title;
        this.description = description;
        this.importance = importance;
        this.dueDate = dueDate;
        this.dateCreated = dateCreated;
        this.archived = archived;
    }
}
