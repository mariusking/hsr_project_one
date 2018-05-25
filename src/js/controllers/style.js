'use strict';
(function () {

    //noteservices
    const noteservices = {
        get: () => {
            return JSON.parse(localStorage.getItem("style")) || false;
        }
    };

    //ui elements
    const html = document.querySelector('html');
    const styleAction = document.querySelector('.style__action');

    //controller
    const controller = {
        init: () => {
            const style = noteservices.get();
            html.classList.toggle('style', style);
        },
        applyListeners: () => {
            styleAction.addEventListener('click', () => {
                html.classList.toggle('style');
                localStorage.setItem('style', !noteservices.get());
            });
        }
    };


    //init
    controller.init();
    controller.applyListeners();
})();
