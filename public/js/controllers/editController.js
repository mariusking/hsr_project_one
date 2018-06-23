import Note from '../datamodel/noteModel.js';
import NoteService from '../model/noteService.js';

class EditController {
    constructor() {
        this._noteService = new NoteService();

        this._main = document.querySelector('main');
        this._form = {};
        this._title = {};
        this._description = {};
        this._importance = {};
        this._dueDate = {};
        this._radioButtons = [];

        this.RADIO_ACTIVE_CLASS = "form__radio--active";
    }

    _render(note) {
        const noteTemplate = document.getElementById('note-form').innerHTML;
        const createNoteHTML = Handlebars.compile(noteTemplate);
        this._main.innerHTML = createNoteHTML(note);

        this._findTemplateElements();
        this._applyListeners();
    }

    _findTemplateElements() {
        this._form = document.querySelector('form');
        this._title = document.getElementById('title');
        this._description = document.getElementById('description');
        this._importance = document.getElementById('importance');
        this._dueDate = document.getElementById('dueDate');
        this._radioButtons = document.querySelectorAll('.form__radio');
    }

    _getUpdatedNote() {
        return new Note({
            ...this._note,
            title: this._title.value,
            description: this._description.value,
            importance: this._importance.dataset.value,
            dueDate: this._dueDate.value
        })
    }

    _applyListeners() {
        this._form.addEventListener('submit', async (e) => {
            e.preventDefault();

            await this._noteService.save(this._getUpdatedNote());

            this._form.reset();
            window.location.href = 'index.html';
        });

        this._form.addEventListener('reset', () => {
            delete this._importance.dataset.value;
            this._radioButtons.forEach((radioButton) => {
                radioButton.classList.remove(this.RADIO_ACTIVE_CLASS);
            })
        });

        this._importance.addEventListener('click', (e) => {
            const value = e.target.dataset.value;
            const radiogroup = e.target.closest('.form__radiogroup');

            radiogroup.dataset.value = value;
            Array.from(radiogroup.children).forEach((radiobutton) => {
                radiobutton.classList.toggle(this.RADIO_ACTIVE_CLASS, radiobutton.dataset.value <= value);
            });
        });
    }

    async updateView() {
        const id = this._idFromUrl();
        this._note = new Note({});

        if (id) {
            this._note = await this._noteService.get(id);
        }
        this._render(this._note);
    }

    _idFromUrl() {
        const url = new URLSearchParams(window.location.search);
        return url.get('id');
    }

}

const controller = new EditController();
controller.updateView();
