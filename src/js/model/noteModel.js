export default class Note {
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
