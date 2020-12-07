import {
  bind
} from 'min-dash';

import PaletteProvider from 'bpmn-js/lib/features/palette/PaletteProvider';

import {
  AVAILABLE_PALETTE_ENTRIES as availableActions
} from './Options';

/**
 * A palette that allows you to create BPMN _and_ custom elements.
 */
export default class CustomPaletteProvider extends PaletteProvider {
  constructor(
      palette, create, elementFactory, spaceTool, lassoTool,
      handTool, globalConnect, translate) {

    super(
      palette, create, elementFactory, spaceTool, lassoTool,
      handTool, globalConnect, translate);

    palette.registerProvider(this);

    this.defaultEntries = bind(super.getPaletteEntries, this);
  }

  getPaletteEntries(element) {
    const actions = this.defaultEntries(element);

    let filteredActions = {};

    availableActions.forEach(availableAction => {
      if (actions[availableAction]) {

        filteredActions = {
          ...filteredActions,
          [ availableAction ]: actions[availableAction]
        };
      }
    });

    return filteredActions;
  }
}

PaletteProvider.$inject = [
  'palette',
  'create',
  'elementFactory',
  'spaceTool',
  'lassoTool',
  'handTool',
  'globalConnect',
  'translate'
];
