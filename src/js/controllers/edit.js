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

    //ui elements
    const form = document.querySelector('form');
    const title = document.getElementById('title');
    const description = document.getElementById('description');
    const importance = document.getElementById('importance');
    const dueDate = document.getElementById('dueDate');
    const radioButtons = document.querySelectorAll('.form__radio');

    const RADIO_ACTIVE_CLASS = "form__radio--active";

    //controller
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const note = new Note({
            title: title.value,
            description: description.value,
            importance: importance.dataset.value,
            dueDate: dueDate.value
        });

        form.reset();

        dataservices.save(note);
    });

    form.addEventListener('reset', () => {
        delete importance.dataset.value;
        radioButtons.forEach((radioButton) => {
            radioButton.classList.remove(RADIO_ACTIVE_CLASS);
        })
    });

    importance.addEventListener('click', (e) => {
        const value = e.target.dataset.value;
        const radiogroup = e.target.closest('.form__radiogroup');

        radiogroup.dataset.value = value;
        Array.from(radiogroup.children).forEach((radiobutton) => {
            radiobutton.classList.toggle(RADIO_ACTIVE_CLASS, radiobutton.dataset.value <= value);
        })
    });

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
})();
