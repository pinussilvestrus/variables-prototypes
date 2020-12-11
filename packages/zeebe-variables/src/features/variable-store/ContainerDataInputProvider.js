import {
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

import {
  forEach
} from 'min-dash';

import {
  getDataInputs
} from '../../utils/DataInputOutputHelper';

import {
  createProcessVariable,
  addVariableToList
} from '../../utils/ProcessVariablesHelper';

export default class ProcessDataInputProvider {

  extractVariables(options) {
    const {
      elements,
      processVariables
    } = options;

    forEach(elements, (element) => {

      if (!isScopeContainer(element)) {
        return [];
      }

      const dataInputs = getDataInputs(element);

      forEach(dataInputs, (dataInput) => {
        const newVariable = createProcessVariable(
          dataInput.name,
          element,
          [
            {
              createdIn: element,
              type: 'processDataInput'
            }
          ]
        );

        addVariableToList(processVariables, newVariable);
      });

    });

    return processVariables;
  }
}


// helper ////////////////

function isScopeContainer(element) {
  return isAny(element, [
    'bpmn:SubProcess',
    'bpmn:Process'
  ]);
}