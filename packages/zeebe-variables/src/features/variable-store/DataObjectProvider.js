import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

import {
  forEach,
  filter,
  find,
  map
} from 'min-dash';

import {
  getDataObjects,
  getDataOutputAssociations,
  getVariableName
} from '../../utils/DataInputOutputHelper';

import {
  createProcessVariable,
  addVariableToList
} from '../../utils/ProcessVariablesHelper';

export default class DataObjectProvider {

  extractVariables(options) {
    const {
      containerElement,
      elements,
      processVariables
    } = options;

    if (!is(containerElement, 'bpmn:Process')) {
      return [];
    }

    const dataObjects = getDataObjects(containerElement);

    forEach(dataObjects, (dataObject) => {

      // find creation origin --> data output association of a flow element
      const createdIn = map(findDataOutputAssociation(elements, dataObject.name), (e) => {
        return {
          createdIn: e,
          type: 'dataObject'
        };
      });

      const newVariable = createProcessVariable(
        dataObject.name,
        containerElement,
        createdIn
      );

      addVariableToList(processVariables, newVariable);
    });

    return processVariables;
  }
}


// helper ///////////////////

/**
 *
 * @param {Array<ModdleElement>} elements
 *
 * @returns {Array<ModdleElement>}
 */
function findDataOutputAssociation(elements, dataObjectName) {
  return filter(elements, (element) => {
    const dataOutputAssociations = getDataOutputAssociations(element);

    if (!dataOutputAssociations) {
      return false;
    }

    return find(dataOutputAssociations, (association) => {
      return dataObjectName === getVariableName(association);
    });
  });
}