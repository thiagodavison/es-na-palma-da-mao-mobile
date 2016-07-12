import './calendar.component.css!';
import template from './calendar.component.html!text';
import CalendarController from './calendar.component.controller.js';

const directive = () => {
    return {
        template: template,
        controller: CalendarController,
        restrict: 'E',
        controllerAs: 'vm', //scope: {},
        replace: true,
        bindToController: true
    };
};

export default directive;




