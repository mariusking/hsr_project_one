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
            return new Promise(async (resolve, reject) => {
                const notes = await noteservices.all();
                notes.push(note);
                await noteservices._set(notes);
                resolve();
            })
        },
        all: async () => {
            return new Promise((resolve, reject) => {
                let notes = JSON.parse(localStorage.getItem("notes")) || [];

                resolve(notes);
            })
        },
        archive: async (id) => {
            return new Promise(async (resolve, reject) => {
                const notes = await noteservices.all();

                notes.filter(note => note.id === id).forEach(note => {
                    note.archived = true;
                });

                await noteservices._set(notes);
                resolve();
            })
        },
        unarchive: async (id) => {
            return new Promise(async (resolve, reject) => {
                const notes = await noteservices.all();

                notes.filter(note => note.id === id).forEach(note => {
                    note.archived = false;
                });

                await noteservices._set(notes);
                resolve();
            })
        },
        _set: async (notes) => {
            return new Promise(async (resolve, reject) => {
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

    //controller
    const controller = {
        render: async (notes) => {
            const noteTemplate = document.getElementById('note-template').innerHTML;
            const createNoteHTML = Handlebars.compile(noteTemplate);
            listEntities.innerHTML = createNoteHTML(notes);

            archiveButtons = document.querySelectorAll('.action__archive');
            unarchiveButtons = document.querySelectorAll('.action__unarchive');
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
        },
        init: async () => {
            const notes = await noteservices.all();
            controller.render(notes);
        }
    };

    //init
    controller.init();

})();
