import {
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

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
  addVariableToList,
  selfAndAllFlowElements
} from '../../utils/ProcessVariablesHelper';

export default class DataObjectProvider {

  extractVariables(options) {
    const {
      elements,
      processVariables
    } = options;

    forEach(elements, (element) => {

      if (!isScopeContainer(element)) {
        return [];
      }

      const dataObjects = getDataObjects(element);

      forEach(dataObjects, (dataObject) => {

        const flowElements = selfAndAllFlowElements([ element ], false);

        // find creation origin --> data output association of a flow element
        const createdIn = map(findDataOutputAssociation(flowElements, dataObject.name), (e) => {
          return {
            createdIn: e,
            type: 'dataObject'
          };
        });

        const newVariable = createProcessVariable(
          dataObject.name,
          element,
          createdIn
        );

        addVariableToList(processVariables, newVariable);
      });
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

function isScopeContainer(element) {
  return isAny(element, [
    'bpmn:SubProcess',
    'bpmn:Process'
  ]);
}