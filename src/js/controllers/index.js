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
    const listEntities = document.querySelector('.list__entities');
    const sortButton = document.getElementById('action__sort');
    const sortContainer = document.querySelector('.list__sort');
    const filterButton = document.getElementById('action__filter');
    const filterContainer = document.querySelector('.list__filter');
    let archiveButtons = [];
    let unarchiveButtons = [];
    let editButtons = [];

    //controller
    const controller = {
        render: async (notes) => {
            const noteTemplate = document.getElementById('note-template').innerHTML;
            const createNoteHTML = Handlebars.compile(noteTemplate);
            listEntities.innerHTML = createNoteHTML(notes);

            archiveButtons = document.querySelectorAll('.action__archive');
            unarchiveButtons = document.querySelectorAll('.action__unarchive');
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
            archiveButtons.forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.closest('.note').dataset.id;
                    await noteservices.archive(id);
                    controller.init();
                });
            });
            unarchiveButtons.forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.closest('.note').dataset.id;
                    await noteservices.unarchive(id);
                    controller.init();
                });
            });
            editButtons.forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.closest('.note').dataset.id;
                    window.location.href = `edit.html?id=${id}`;
                });
            });
        },
        init: async () => {
            const notes = await noteservices.all();
            controller.render(notes);
        }
    };

    //init
    controller.init();

})();
