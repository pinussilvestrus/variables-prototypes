import {
  forEach,
  filter,
  find
} from 'min-dash';

import ContainerDataInputProvider from './ContainerDataInputProvider';
import DataObjectProvider from './DataObjectProvider';

import {
  selfAndAllFlowElements
} from '../../utils/ProcessVariablesHelper';

import {
  getDataInputAssociations,
  getVariableAssignmentValue
} from '../../utils/DataInputOutputHelper';

const DEFAULT_PROVIDERS = [
  ContainerDataInputProvider,
  DataObjectProvider
];

/**
 * @typedef {Object} CreatedInDefinition
 * @property {ModdleElement} createdIn
 * @property {String} type
 */

/**
 * @typedef {Object} ProcessVariable
 * @property {Array<CreatedInDefinition>} createdIn
 * @property {Array<ModdleElement>} usedIn
 * @property {String} name
 * @property {ModdleElement} scope
 * @property {String} creationType
 */


export default class VariableStore {

  constructor() {
    this._providers = [];

    this.registerDefaultProviders();
  }

  registerDefaultProviders() {
    const self = this;

    forEach(DEFAULT_PROVIDERS, (provider) => {
      self.registerProvider(new provider());
    });
  }

  // @Note: This should go inside a provider, it's
  // okay for the prototype.
  findInExpression(variable, element) {
    const dataInputAssociations = getDataInputAssociations(element);

    if (!dataInputAssociations || !dataInputAssociations.length) {
      return;
    }

    const found = find(dataInputAssociations, (d) => {
      const expression = getVariableAssignmentValue(d);

      return containsVariable(expression, variable);
    });

    if (found) {
      return element;
    }
  }

  collectVariables(containerElement) {
    const self = this;

    let processVariables = [];

    // (1) extract all flow elements inside the container
    const elements = selfAndAllFlowElements([ containerElement ], false);

    // (2) extract all variables from the extractors
    forEach(this._providers, (provider) => {
      provider.extractVariables({
        elements: elements,
        containerElement: containerElement,
        processVariables: processVariables
      });
    });

    // (3) search for usage place, O(n^2) : - (
    // todo(pinussilvestrus): also handle via providers
    forEach(processVariables, (variable) => {
      variable.usedIn = filter(elements, (element) => {
        return self.findInExpression(variable, element);
      });
    });

    return processVariables;
  }

  // todo(pinussilvestrus): implement me for variable usage
  findVariables(element, containerElement) {
    const variables = this.collectVariables(containerElement);

    return filter(variables, (v) => {
      return;
    });

  }

  registerProvider(provider) {
    this._providers.push(provider);
  }

}

// helper ///////////////


/**
 * Executes a full text search inside a expression
 * for a given variable
*/
function containsVariable(expression, variable) {
  if (!expression.startsWith('=')) {
    return false;
  }

  return expression.includes(variable.name);
}