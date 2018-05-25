'use strict';
(async function () {
    //classes
    class Note {
        constructor({id, title, description, importance, dueDate}) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.importance = importance;
            this.dueDate = dueDate;
        }
    }

    //noteservices
    const noteservices = {
        save: async (note) => {
            return new Promise(async (resolve) => {
                const notes = await noteservices.all();
                if (!note.id) {
                    note.id = generator.id();
                }
                notes[note.id] = note;
                localStorage.setItem("notes", JSON.stringify(notes));
                resolve();
            });
        },
        get: async (id) => {
            return new Promise(async (resolve) => {
                const notes = await noteservices.all();

                resolve(notes[id]);
            })
        },
        all: async () => {
            return new Promise((resolve) => {
                let notes = JSON.parse(localStorage.getItem("notes")) || {};

                resolve(notes);
            })
        },
        archive: async (id) => {
            return new Promise(async (resolve) => {
                const notes = await noteservices.all();

                notes[id].archived = true;

                await noteservices._set(notes);
                resolve();
            })
        },
        unarchive: async (id) => {
            return new Promise(async (resolve) => {
                const notes = await noteservices.all();

                notes[id].archived = false;

                await noteservices._set(notes);
                resolve();
            })
        },
        _set: async (notes) => {
            return new Promise(async (resolve) => {
                localStorage.setItem("notes", JSON.stringify(notes));
                resolve();
            });
        }
    };

    //ui elements
    const main = document.querySelector('main');
    let form = {};
    let title = {};
    let description = {};
    let importance = {};
    let dueDate = {};
    let radioButtons = [];

    const RADIO_ACTIVE_CLASS = "form__radio--active";

    //controller
    const generator = {
        id: () => {
            return '_' + Math.random().toString(36).substr(2, 9);
        }
    };

    const controller = {
        render: async (note) => {
            const noteTemplate = document.getElementById('note-form').innerHTML;
            const createNoteHTML = Handlebars.compile(noteTemplate);
            main.innerHTML = createNoteHTML(note);

            form = document.querySelector('form');
            title = document.getElementById('title');
            description = document.getElementById('description');
            importance = document.getElementById('importance');
            dueDate = document.getElementById('dueDate');
            radioButtons = document.querySelectorAll('.form__radio');

            controller._applyListeners();
        },
        _applyListeners: () => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const note = new Note({
                    id: form.dataset.id,
                    title: title.value,
                    description: description.value,
                    importance: importance.dataset.value,
                    dueDate: dueDate.value
                });


                await noteservices.save(note);

                form.reset();
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
        },
        init: async () => {
            const id = controller.idFromUrl();
            let note = new Note({});

            if (id) {
                note = await noteservices.get(id);
            }
            controller.render(note);
        },
        idFromUrl: () => {
            const url = new URLSearchParams(window.location.search);
            return url.get('id');
        }
    };


    //init
    controller.init();
})();
