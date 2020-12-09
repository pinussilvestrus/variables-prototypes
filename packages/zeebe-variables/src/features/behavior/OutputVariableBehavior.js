import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import {
  forEach,
  find
} from 'min-dash';

import {
  getBusinessObject
} from 'bpmn-js/lib/util/ModelUtil';

import {
  add as collectionAdd
} from 'diagram-js/lib/util/Collections';

import {
  getVariableName
} from '../../utils/DataInputOutputHelper';

/**
 * Ensures a data object will be created once a data output association is created.
 */
export default class OutputVariableBehavior extends CommandInterceptor {

  constructor(eventBus, bpmnFactory, canvas, variableStore) {
    super(eventBus);

    this.preExecute('element.updateModdleProperties', function(event) {

      const {
        context
      } = event;

      const {
        properties
      } = context;

      const {
        dataOutputAssociations
      } = properties;

      const rootElement = canvas.getRootElement();

      const rootBo = getBusinessObject(rootElement);

      if (!dataOutputAssociations) {
        return;
      }

      // (1) get all data objects on parent scope, todo
      const variables = variableStore.collectVariables(rootBo);

      // (2) create missing data objects
      forEach(dataOutputAssociations, (output) => {

        // (2.1) check whether data object for output exists
        const found = find(variables, (v) => {
          return v.name === getVariableName(output);
        });

        if (found) {
          return;
        }

        // (2.2) create new data object
        const dataObject = bpmnFactory.create('bpmn:DataObject', {
          id: getVariableName(output)
        });

        // (2.3) add data object to correct scope
        // todo(pinussilvestrus): is this always the right scope?
        dataObject.$parent = rootBo;

        collectionAdd(rootBo.get('flowElements'), dataObject);
      });

      // (3) todo(pinussilvestrus): cleanup outdated data objects

    });
  }

  // todo(pinussilvestrus): handle variable changes (name)

}

OutputVariableBehavior.$inject = [
  'eventBus',
  'bpmnFactory',
  'canvas',
  'variableStore'
];