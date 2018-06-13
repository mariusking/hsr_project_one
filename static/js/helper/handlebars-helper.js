'use strict';
(function () {
    Handlebars.registerHelper('times', function (context, options){
        let accum = '';
        for (let i = 0; i < context; ++i)
            accum += options.fn(i);
        return accum;
    });
    Handlebars.registerHelper('importance', function(context, options) {
        if(context <= this.importance) {
            return options.fn(this);
        }
    });
    Handlebars.registerHelper('date', (context) => {
        moment.locale();
        if(moment(context).isSame(moment(), 'day')) {
            return new Handlebars.SafeString('today');
        } else if (moment(context).isBefore(moment())){
            return new Handlebars.SafeString('overdue');
        } else if (moment(context).isAfter(moment())){
            const formattedDate = moment(context).format('L');
            return new Handlebars.SafeString(`to be done by ${formattedDate}`);
        }
    });
})();
