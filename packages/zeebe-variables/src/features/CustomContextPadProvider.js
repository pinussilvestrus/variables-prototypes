import {
  bind,
  filter,
  keys,
  reduce
} from 'min-dash';

import ContextPadProvider from 'bpmn-js/lib/features/context-pad/ContextPadProvider';

import {
  AVAILABLE_CONTEXTPAD_ENTRIES as availableActions
} from './Options';

export default class CustomContextPadProvider extends ContextPadProvider {

  constructor(config, injector, eventBus, contextPad,
      modeling, elementFactory, connect, create,
      popupMenu, canvas, rules, translate) {

    super(config, injector, eventBus, contextPad,
      modeling, elementFactory, connect, create,
      popupMenu, canvas, rules, translate);


    this.autoPlace = undefined;

    if (config.autoPlace !== false) {
      this.autoPlace = injector.get('autoPlace', false);
    }

    this.defaultEntries = bind(super.getContextPadEntries, this);
  }

  getContextPadEntries = element => {
    const actions = this.defaultEntries(element);

    const filtered = filter(keys(actions), (action) => {
      return availableActions.indexOf(action) !== -1;
    });

    const filteredActions = reduce(filtered, (result, action) => {
      return {
        ...result,
        [action]: actions[action]
      };
    }, {});

    return filteredActions;
  };
}

CustomContextPadProvider.$inject = [
  'config',
  'injector',
  'eventBus',
  'contextPad',
  'modeling',
  'elementFactory',
  'connect',
  'create',
  'popupMenu',
  'canvas',
  'rules',
  'translate'
];
