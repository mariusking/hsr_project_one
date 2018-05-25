'use strict';
(function () {
    Handlebars.registerHelper('times', function (n, block) {
        let accum = '';
        for (let i = 0; i < n; ++i)
            accum += block.fn(i);
        return accum;
    });
})();


(function () {
    //classes
    class Note {
        constructor({id, title, description, importance, dueDate, archived = false}) {
            this.id = id;
            this.title = title;
            this.description = description;
            this.importance = importance;
            this.dueDate = dueDate;
            this.archived = archived;
        }
    }

    //noteservices
    const noteservices = {
        save: async (note) => {
            return new Promise(async (resolve) => {
                const notes = await noteservices._all();
                if (!note.id) {
                    note.id = generator.id();
                    note.dateCreated = new Date();
                }
                notes[note.id] = note;
                localStorage.setItem("notes", JSON.stringify(notes));
                resolve(note);
            });
        },
        get: async (id) => {
            return new Promise(async (resolve) => {
                const notes = await noteservices._all();

                resolve(notes[id]);
            })
        },
        all: async () => {
            return new Promise(async (resolve) => {
                const notesObject = await noteservices._all();
                let notes = Object.values(notesObject);

                if(!noteservices.showArchived) {
                    notes = notes.filter(note => !note.archived);
                }
                resolve(notes);
            });
        },
        _all: async () => {
            return new Promise((resolve) => {
                let notes = JSON.parse(localStorage.getItem("notes")) || {};

                resolve(notes);
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
    const listEntities = document.querySelector('.list__entities');
    const sortButton = document.getElementById('action__sort');
    const sortContainer = document.querySelector('.list__sort');
    const filterButton = document.getElementById('action__filter');
    const filterContainer = document.querySelector('.list__filter');
    let archiveToggles = [];
    let editButtons = [];

    //controller
    const controller = {
        render: async (notes) => {
            const noteTemplate = document.getElementById('note-template').innerHTML;
            const createNoteHTML = Handlebars.compile(noteTemplate);
            listEntities.innerHTML = createNoteHTML(notes);

            archiveToggles = document.querySelectorAll('.action__toggle__archive');
            editButtons = document.querySelectorAll('.action__edit');
            controller._applyListeners();
        },
        _applyListeners: () => {
            sortButton.addEventListener('click', () => {
                sortButton.classList.toggle('list__action--active');
                sortContainer.classList.toggle('hide');
            });
            filterButton.addEventListener('click', () => {
                filterButton.classList.toggle('list__action--active');
                filterContainer.classList.toggle('hide');
            });
            archiveToggles.forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.closest('.note').dataset.id;
                    const note = await noteservices.get(id);
                    note.archived = !note.archived;
                    await noteservices.save(note);
                    controller.updateView();
                });
            });
            editButtons.forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.closest('.note').dataset.id;
                    window.location.href = `edit.html?id=${id}`;
                });
            });
        },
        updateView: async () => {
            const notes = await noteservices.all();
            controller.render(notes);
        }
    };

    //updateView
    controller.updateView();

})();
