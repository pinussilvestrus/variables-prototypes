import { forEach } from 'min-dash';

import ProcessDataInputProvider from './ProcessDataInputProvider';

import {
  selfAndAllFlowElements
} from '../../utils/ProcessVariablesHelper';

const DEFAULT_PROVIDERS = [
  ProcessDataInputProvider
];

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
    var processVariables = [];

    // (1) extract all flow elements inside the container
    var elements = selfAndAllFlowElements([containerElement], false);

    // (2) extract all variables from the extractors
    forEach(this._providers, function(provider) {
      provider.extractVariables({
        elements: elements,
        containerElement: containerElement,
        processVariables: processVariables
      });
    });

    return processVariables;
  }

  registerProvider(provider) {
    this._providers.push(provider);
  }


}