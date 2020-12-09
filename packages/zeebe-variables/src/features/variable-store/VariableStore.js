import {
  forEach,
  filter
} from 'min-dash';

import ContainerDataInputProvider from './ContainerDataInputProvider';
import DataObjectProvider from './DataObjectProvider';

import {
  selfAndAllFlowElements
} from '../../utils/ProcessVariablesHelper';

const DEFAULT_PROVIDERS = [
  ContainerDataInputProvider,
  DataObjectProvider
];

/**
 * @typedef {Object} ProcessVariable
 * @property {Array<ModdleElement>} createdIn
 * @property {Array<ModdleElement>} usedIn
 * @property {String} name
 * @property {ModdleElement} scope
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

  collectVariables(containerElement) {
    let processVariables = [];

    // (1) extract all flow elements inside the container
    const elements = selfAndAllFlowElements([containerElement], false);

    // (2) extract all variables from the extractors
    forEach(this._providers, function(provider) {
      provider.extractVariables({
        elements: elements,
        containerElement: containerElement,
        processVariables: processVariables
      });
    });

    // (3) search for usage place
    // todo(pinussilvestrus)

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