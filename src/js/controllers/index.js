'use strict';
(function () {
    //classes
    class Note {
        constructor({title, description, importance, dueDate}) {
            this.title = title;
            this.description = description;
            this.importance = importance;
            this.dueDate = dueDate;
        }
    }

    //dataservices
    const dataservices = {
        save: (note) => {
            const notes = dataservices.all();
            notes.push(note);
            localStorage.setItem("notes", JSON.stringify(notes));
        },
        all: () => {
            return JSON.parse(localStorage.getItem("notes")) || [];
        }
    };

    //ui elements
    const listEntities = document.querySelector('.list__entities');

    //controller
    function render() {
        const notes = dataservices.all();
        const noteTemplate = document.getElementById('note-template').innerHTML;
        const createNoteHTML = Handlebars.compile(noteTemplate);
        listEntities.innerHTML = createNoteHTML(notes);
    }

    render();

})();
