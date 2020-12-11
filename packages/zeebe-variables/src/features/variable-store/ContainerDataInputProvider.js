import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

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
      containerElement,
      processVariables
    } = options;

    if (!is(containerElement, 'bpmn:Process')) {
      return [];
    }

    const dataInputs = getDataInputs(containerElement);

    forEach(dataInputs, (dataInput) => {
      const newVariable = createProcessVariable(
        dataInput.name,
        containerElement,
        [
          {
            createdIn: containerElement,
            type: 'processDataInput'
          }
        ]
      );

      addVariableToList(processVariables, newVariable);
    });

    return processVariables;
  }
}