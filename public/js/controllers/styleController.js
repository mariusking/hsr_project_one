import StyleService from '../model/styleService.js'

class StyleController {
    constructor() {
        this._styleService = new StyleService();

        this._html = document.querySelector('html');
        this._styleAction = document.querySelector('.style__action');

        this._applyStyle();
        this._applyListeners();
    }

    _applyListeners () {
        this._styleAction.addEventListener('click', () => {
            this._styleService.toggle();
            this._applyStyle();
        });
    }

    _applyStyle () {
        this._html.classList.toggle('style', this._styleService.get());
    }
}

const styleController = new StyleController();
