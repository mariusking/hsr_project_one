'use strict';
(function () {


    //webcomponents
    class PersonalNote extends HTMLElement {
        constructor(note) {
            super();
            this.attachShadow({mode: 'open'});

            const noteTemplate = document.getElementById('note-template').innerHTML;
            const createNoteHTML = Handlebars.compile(noteTemplate);
            this.shadowRoot.innerHTML = createNoteHTML(note);

            console.log(note);
        }
    }

    window.customElements.define('personal-note', PersonalNote);

    //classes
    class Note {
        constructor({title, description, importance, dueDate}) {
            this.title = title;
            this.description = description;
            this.importance = importance;
            this.dueDate = dueDate;
        }
    }

    //ui elements
    const listEntities = document.querySelector('.list__entities');

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


    const notes = dataservices.all();

    notes.forEach(note => {
        const noteElement = new PersonalNote(note);
        listEntities.appendChild(noteElement);
    });

})();
