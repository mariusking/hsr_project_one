'use strict';
(function () {
    Handlebars.registerHelper('isActive', function(datavalue, options) {
        if(datavalue <= this.importance) {
            console.log(options);
            return options.fn(this);
        }
    });
})();

(async function () {

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

            controller._findTemplateElements();
            controller._applyListeners();
        },
        _findTemplateElements: () => {
            form = document.querySelector('form');
            title = document.getElementById('title');
            description = document.getElementById('description');
            importance = document.getElementById('importance');
            dueDate = document.getElementById('dueDate');
            radioButtons = document.querySelectorAll('.form__radio');
        },
        _applyListeners: () => {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();

                const note = new Note({
                    id: form.dataset.id,
                    title: title.value,
                    description: description.value,
                    importance: importance.dataset.value,
                    dueDate: dueDate.value,
                    archived: JSON.parse(form.dataset.archived),
                    dateCreated: form.dataset.dateCreated
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
        updateView: async () => {
            const id = controller._idFromUrl();
            let note = new Note({});

            if (id) {
                note = await noteservices.get(id);
            }
            controller.render(note);
        },
        _idFromUrl: () => {
            const url = new URLSearchParams(window.location.search);
            return url.get('id');
        }
    };


    //updateView
    controller.updateView();
})();
