import NoteService from './../application/noteService.js';

class IndexController {
    constructor() {
        this._noteService = new NoteService();

        this._listEntities = document.querySelector('.list__entities');
        this._listActionHider = document.getElementById('action__hider');
        this._listActionContainer = document.querySelector('.list__action__container');
        this._listActionFilter = document.querySelector('.list__action__filter');
        this._listActionSort = document.querySelector('.list__action__sort');

        this._archiveToggles = [];
        this._unarchiveToggles = [];
        this._editButtons = [];

        this._applyListeners();
    }

    _render(notes) {
        this._renderNoteList(notes);
        this._renderFilterAction();
        this._renderSortAction();

        this._findNoteTemplateElements();
        this._applyNoteTemplateListeners();
    }


    _renderNoteList(notes) {
        const noteTemplate = document.getElementById('note-template').innerHTML;
        const createNoteHTML = Handlebars.compile(noteTemplate);
        this._listEntities.innerHTML = createNoteHTML(notes);
    }

    _renderFilterAction() {
        const icon = this._listActionFilter.querySelector('i');
        if (this._noteService.filter) {
            icon.innerHTML = 'check_box';
        } else {
            icon.innerHTML = 'check_box_outline_blank';
        }
    }

    _renderSortAction() {
        Array.from(this._listActionSort.children).forEach(child => {
            const childsort = child.dataset.sort;
            child.classList.toggle('button--active', this._noteService.sort === childsort);
        });
    }

    _findNoteTemplateElements() {
        this._archiveToggles = document.querySelectorAll('.action__toggle__archive');
        this._unarchiveToggles = document.querySelectorAll('.action__toggle__unarchive');
        this._editButtons = document.querySelectorAll('.action__edit');
    }

    _applyNoteTemplateListeners() {
        this._archiveToggles.forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = e.target.closest('.note').dataset.id;
                await this._noteService.archive(id);
                this.updateView();
            });
        });
        this._unarchiveToggles.forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = e.target.closest('.note').dataset.id;
                await this._noteService.unarchive(id);
                this.updateView();
            });
        });
        this._editButtons.forEach(button => {
            button.addEventListener('click', async (e) => {
                const id = e.target.closest('.note').dataset.id;
                window.location.href = `edit.html?id=${id}`;
            });
        });
    }

    _applyListeners() {
        this._listActionHider.addEventListener('click', () => {
            this._listActionHider.classList.toggle('list__action--active');
            this._listActionContainer.classList.toggle('hide');
        });
        this._listActionFilter.addEventListener('click', () => {
            this._noteService.toggleFilter();
            this.updateView();
        });
        this._listActionSort.addEventListener('click', (e) => {
            this._noteService.sort = e.target.dataset.sort;
            this.updateView();
        });
    }

    async updateView() {
        const notes = await this._noteService.all();
        this._render(notes);
    }


}

//controller
const controller = new IndexController();
controller.updateView();
