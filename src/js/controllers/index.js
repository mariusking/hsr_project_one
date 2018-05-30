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
    const listActionHider = document.getElementById('action__hider');
    const listActionContainer = document.querySelector('.list__action__container');
    const listActionsFilter = document.querySelector('.list__action__filter');

    let archiveToggles = [];
    let editButtons = [];

    //controller
    const controller = {
        render: async (notes) => {
            const noteTemplate = document.getElementById('note-template').innerHTML;
            const createNoteHTML = Handlebars.compile(noteTemplate);
            listEntities.innerHTML = createNoteHTML(notes);

            controller._findTemplateElements();
            controller._applyTemplateListeners();
        },
        _findTemplateElements: () => {
            archiveToggles = document.querySelectorAll('.action__toggle__archive');
            editButtons = document.querySelectorAll('.action__edit');
        },
        _applyTemplateListeners: () => {
            listActionHider.addEventListener('click', () => {
                console.log('test');
                listActionHider.classList.toggle('list__action--active');
                listActionContainer.classList.toggle('hide');
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
        applyListeners: () => {
            listActionsFilter.addEventListener('click', (e) => {
            })
        },
        updateView: async () => {
            const notes = await noteservices.all();
            controller.render(notes);
        }
    };

    controller.applyListeners();

    //updateView
    controller.updateView();

})();
