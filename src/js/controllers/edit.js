'use strict';
(function () {
    //classes
    class Note {
        constructor({id, title, description, importance, dueDate}) {
            this.id = id || this._id();
            this.title = title;
            this.description = description;
            this.importance = importance;
            this.dueDate = dueDate;
        }

        _id() {
            return '_' + Math.random().toString(36).substr(2, 9);
        }
    }

    //noteservices
    const noteservices = {
        save: async (note) => {
            return new Promise(async (resolve, reject) => {
                const notes = await noteservices.all();
                notes.push(note);
                localStorage.setItem("notes", JSON.stringify(notes));
                resolve();
            })
        },
        all: async () => {
            return new Promise((resolve, reject) => {
                const notes = JSON.parse(localStorage.getItem("notes")) || [];
                resolve(notes);
            })
        }
    };

    //ui elements
    const form = document.querySelector('form');
    const title = document.getElementById('title');
    const description = document.getElementById('description');
    const importance = document.getElementById('importance');
    const dueDate = document.getElementById('dueDate');
    const radioButtons = document.querySelectorAll('.form__radio');

    const RADIO_ACTIVE_CLASS = "form__radio--active";

    //controller
    const controller = {
        applyListeners: () => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const note = new Note({
                    title: title.value,
                    description: description.value,
                    importance: importance.dataset.value,
                    dueDate: dueDate.value
                });

                form.reset();

                await noteservices.save(note);
                console.log(window.location);
                window.location.href = 'index.html';


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
        }
    };


    //init
    controller.applyListeners();
})();
