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

import {
  getScope
} from '../../utils/ProcessVariablesHelper';

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
        element,
        properties
      } = context;

      const {
        dataOutputAssociations
      } = properties;

      if (!dataOutputAssociations) {
        return;
      }

      self.createDataObjectsIfNonExisting(element, dataOutputAssociations);
    });

    // handle variable updates
    this.preExecute('element.updateModdleProperties', function(event) {
      const {
        context
      } = event;

      const {
        element,
        moddleElement
      } = context;

      if (!is(moddleElement, 'bpmn:DataOutputAssociation')) {
        return;
      }

      self.createDataObjectsIfNonExisting(element, [ moddleElement ]);
    });

    // cleanup
    this.postExecute('element.updateModdleProperties', function(event) {
      self.cleanUpUnusedDataObjects();
    });
  }

  createDataObjectsIfNonExisting(element, dataOutputAssociations) {
    const canvas = this._canvas;

    const bpmnFactory = this._bpmnFactory;

    const elementBo = getBusinessObject(element);

    const rootElement = canvas.getRootElement();

    const rootBo = getBusinessObject(rootElement);

    forEach(dataOutputAssociations, (output) => {

      const variableName = getVariableName(output);

      const scope = getScope(elementBo, rootBo, variableName);

      // (1) get all data objects on parent scope
      const dataObjects = getDataObjects(scope);

      // (2) check whether data object exists
      const found = find(dataObjects, (d) => {
        return d.name === variableName;
      });

      if (found) {
        return;
      }

      // (3) create new data object
      const dataObject = bpmnFactory.create('bpmn:DataObject', {
        name: getVariableName(output)
      });

      // (4) add data object to correct scope
      dataObject.$parent = scope;

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
      const {
        createdIn
      } = v;

      // is elsewhere created
      if (createdIn.length > 0) {
        return;
      }

      const dataObjects = getDataObjects(rootBo);

      const removingDataObjects = find(dataObjects, (d) => {
        return d.name === v.name;
      });

      collectionRemove(rootBo.get('flowElements'), removingDataObjects);
    });

  }

}

OutputVariableBehavior.$inject = [
  'eventBus',
  'bpmnFactory',
  'canvas',
  'variableStore'
];