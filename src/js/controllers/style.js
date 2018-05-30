'use strict';
(function () {

    //ui elements
    const html = document.querySelector('html');
    const styleAction = document.querySelector('.style__action');

    //controller
    const controller = {
        init: () => {
            const style = styleservices.get();
            html.classList.toggle('style', style);
        },
        applyListeners: () => {
            styleAction.addEventListener('click', () => {
                html.classList.toggle('style');
                styleservices.toggle();
            });
        }
    };


    //init
    controller.init();
    controller.applyListeners();
})();
