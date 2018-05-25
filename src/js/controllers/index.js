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

            controller._findTemplateElements();
            controller._applyListeners();
        },
        _findTemplateElements: () => {
            archiveToggles = document.querySelectorAll('.action__toggle__archive');
            editButtons = document.querySelectorAll('.action__edit');
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
