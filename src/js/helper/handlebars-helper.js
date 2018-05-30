'use strict';
(function () {
    Handlebars.registerHelper('times', function (n, block) {
        let accum = '';
        for (let i = 0; i < n; ++i)
            accum += block.fn(i);
        return accum;
    });
    Handlebars.registerHelper('importance', function(datavalue, options) {
        if(datavalue <= this.importance) {
            return options.fn(this);
        }
    });
})();
