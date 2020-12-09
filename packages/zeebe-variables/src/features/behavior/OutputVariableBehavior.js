import CommandInterceptor from 'diagram-js/lib/command/CommandInterceptor';

import {
  forEach,
  find
} from 'min-dash';

import {
  getBusinessObject,
  is
} from 'bpmn-js/lib/util/ModelUtil';

import {
  add as collectionAdd,
  remove as collectionRemove
} from 'diagram-js/lib/util/Collections';

import {
  getVariableName,
  getDataObjects
} from '../../utils/DataInputOutputHelper';

/**
 * Handle data objects coming from data output associations
 */
export default class OutputVariableBehavior extends CommandInterceptor {

  constructor(eventBus, bpmnFactory, canvas, variableStore) {
    super(eventBus);

    this._bpmnFactory = bpmnFactory;
    this._canvas = canvas;
    this._variableStore = variableStore;

    const self = this;

    // handle variable creation
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

      if (!dataOutputAssociations) {
        return;
      }

      self.createDataObjectsIfNonExisting(dataOutputAssociations);
    });

    // handle variable updates
    this.preExecute('element.updateModdleProperties', function(event) {
      const {
        context
      } = event;

      const {
        moddleElement
      } = context;

      if (!is(moddleElement, 'bpmn:DataOutputAssociation')) {
        return;
      }

      self.createDataObjectsIfNonExisting([ moddleElement ]);
    });

    // cleanup
    this.postExecute('element.updateModdleProperties', function(event) {
      self.cleanUpUnusedDataObjects();
    });
  }

  createDataObjectsIfNonExisting(dataOutputAssociations) {
    const variableStore = this._variableStore;

    const canvas = this._canvas;

    const bpmnFactory = this._bpmnFactory;

    const rootElement = canvas.getRootElement();

    const rootBo = getBusinessObject(rootElement);


    // (1) get all data objects on parent scope
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
  }

  // this can be dangerous (!)
  cleanUpUnusedDataObjects() {
    const variableStore = this._variableStore;

    const canvas = this._canvas;

    const rootElement = canvas.getRootElement();

    const rootBo = getBusinessObject(rootElement);


    // (1) get all data objects on parent scope
    const variables = variableStore.collectVariables(rootBo);

    // (2) remove all variables which don't have a creation place
    // todo(pinussilvestrus): is this enough?
    forEach(variables, (v) => {
      if (v.createdIn.length > 0) {
        return;
      }

      const dataObjects = getDataObjects(rootBo);

      const found = find(dataObjects, (d) => {
        return d.id === v.name;
      });

      collectionRemove(rootBo.get('flowElements'), found);
    });

  }

}

OutputVariableBehavior.$inject = [
  'eventBus',
  'bpmnFactory',
  'canvas',
  'variableStore'
];