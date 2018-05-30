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
    const listActionFilter = document.querySelector('.list__action__filter');
    const listActionSort = document.querySelector('.list__action__sort');

    let archiveToggles = [];
    let unarchiveToggles = [];
    let editButtons = [];

    //controller
    const controller = {
        render: async ({notes, filter, sort}) => {
            controller._renderNoteList(notes);
            controller._renderFilterAction(filter);
            controller._renderSortAction(sort);

            controller._findNoteTemplateElements();
            controller._applyNoteTemplateListeners();
        },
        _renderNoteList: (notes) => {
            const noteTemplate = document.getElementById('note-template').innerHTML;
            const createNoteHTML = Handlebars.compile(noteTemplate);
            listEntities.innerHTML = createNoteHTML(notes);
        },
        _renderFilterAction: (filter) => {
            const listActionFilterTemplate = document.getElementById('list-action-filter').innerHTML;
            const createNoteHTML = Handlebars.compile(listActionFilterTemplate);
            listActionFilter.innerHTML = createNoteHTML(filter);
        },
        _renderSortAction: (sort) => {
            Array.from(listActionSort.children).forEach(child => {
                const childsort = child.dataset.sort;
                child.classList.toggle('button--active', sort === childsort);
            });
        },
        _findNoteTemplateElements: () => {
            archiveToggles = document.querySelectorAll('.action__toggle__archive');
            unarchiveToggles = document.querySelectorAll('.action__toggle__unarchive');
            editButtons = document.querySelectorAll('.action__edit');
        },
        _applyNoteTemplateListeners: () => {
            archiveToggles.forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.closest('.note').dataset.id;
                    const note = await noteservices.get(id);
                    note.archive();
                    await noteservices.save(note);
                    controller.updateView();
                });
            });
            unarchiveToggles.forEach(button => {
                button.addEventListener('click', async (e) => {
                    const id = e.target.closest('.note').dataset.id;
                    const note = await noteservices.get(id);
                    note.unarchive();
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
            listActionHider.addEventListener('click', () => {
                listActionHider.classList.toggle('list__action--active');
                listActionContainer.classList.toggle('hide');
            });
            listActionFilter.addEventListener('click', () => {
                noteservices.toggleFilter();
                controller.updateView();
            });
            listActionSort.addEventListener('click', (e) => {
                const sort = e.target.dataset.sort;
                noteservices.setSort(sort);
                controller.updateView();
            });
        },
        updateView: async () => {
            const notes = await noteservices.all();
            const filter = noteservices.getFilter();
            const sort = noteservices.getSort();
            controller.render({notes, filter, sort});
        }
    };


    controller.applyListeners();
    controller.updateView();

})();
