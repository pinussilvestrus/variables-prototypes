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


/**
 * Ensures a data object will be created once a data output association is created.
 */
export default class CreateOutputVariableBehavior extends CommandInterceptor {

  constructor(eventBus, bpmnFactory, canvas) {
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

      if (!dataOutputAssociations) {
        return;
      }

      // (1) get all data objects on parent scope, todo
      const dataObjects = [];

      // (2) create missing data objects
      forEach(dataOutputAssociations, (output) => {

        // (2.1) check whether data object for output exists
        const found = !find(dataObjects, (d) => {
          return d.id === getVariableName(output);
        });

        if (!found) {
          return;
        }

        // (2.2) create new data object
        const dataObject = bpmnFactory.create('bpmn:DataObject', {
          id: getVariableName(output)
        });

        // (2.3) add data object to correct scope
        // todo(pinussilvestrus): get correct scope via variable store
        const rootBo = getBusinessObject(rootElement);

        dataObject.$parent = rootBo;

        collectionAdd(rootBo.get('flowElements'), dataObject);
      });

    });
  }

}

CreateOutputVariableBehavior.$inject = [
  'eventBus',
  'bpmnFactory',
  'canvas'
];

// / helper /////////////////

function getVariableName(dataOutputAssociation) {
  const assignment = dataOutputAssociation.get('assignment')[0];

  return assignment && assignment.get('to').get('body');
}