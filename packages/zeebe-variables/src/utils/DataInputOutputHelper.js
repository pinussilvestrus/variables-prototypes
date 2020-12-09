import {
  add as collectionAdd
} from 'diagram-js/lib/util/Collections';

import {
  filter
} from 'min-dash';

import {
  is
} from 'bpmn-js/lib/util/ModelUtil';

export function getIOSpeficiation(element) {
  return element.get('ioSpecification');
}

export function getDataInputs(element) {
  const ioSpecification = getIOSpeficiation(element);

  return ioSpecification && ioSpecification.get('dataInputs');
}

export function getDataObjects(element) {
  const flowElements = element.get('flowElements');

  return filter(flowElements, (flowElement) => {
    return is(flowElement, 'bpmn:DataObject');
  });
}

export function getDataOutputAssociations(element) {
  return element.get('dataOutputAssociations');
}

export function getVariableName(dataOutputAssociation) {
  console.log(dataOutputAssociation);
  const assignment = dataOutputAssociation.get('assignment')[0];

  return assignment && assignment.get('to').get('body');
}

/**
* Create and return bpmn:DataInput.
*
* Create bpmn:InputOutputSpecification, dataInputs and inputSets if not
* found.
*
* @param {ModdleElement} element
* @param {BpmnFactory} bpmnFactory
*
* @returns {ModdleElement}
*/
export function createDataInput(element, bpmnFactory) {
  let ioSpecification = getIOSpeficiation(element);

  let inputSet, outputSet;

  if (!ioSpecification) {
    ioSpecification = bpmnFactory.create('bpmn:InputOutputSpecification', {
      dataInputs: [],
      inputSets: []
    });

    element.ioSpecification = ioSpecification;

    inputSet = bpmnFactory.create('bpmn:InputSet', {
      dataInputRefs: [],
      name: 'Inputs'
    });

    inputSet.$parent = ioSpecification;

    collectionAdd(ioSpecification.get('inputSets'), inputSet);

    outputSet = bpmnFactory.create('bpmn:OutputSet', {
      dataOutputRefs: [],
      name: 'Outputs'
    });

    outputSet.$parent = ioSpecification;

    collectionAdd(ioSpecification.get('outputSets'), outputSet);
  }

  let dataInput = bpmnFactory.create('bpmn:DataInput');

  dataInput.$parent = ioSpecification;

  if (!ioSpecification.dataInputs) {
    ioSpecification.dataInputs = [];
  }

  collectionAdd(ioSpecification.get('dataInputs'), dataInput);

  if (!ioSpecification.inputSets) {
    inputSet = bpmnFactory.create('bpmn:InputSet', {
      dataInputRefs: [],
      name: 'Inputs'
    });

    inputSet.$parent = ioSpecification;

    collectionAdd(ioSpecification.get('inputSets'), inputSet);
  }

  inputSet = ioSpecification.get('inputSets')[0];

  collectionAdd(inputSet.dataInputRefs, dataInput);

  return {
    dataInput,
    ioSpecification
  };
}

/**
* Create and return bpmn:OutputAssociation with a simple bpmn:Assignment.
*
* @param {BpmnFactory} bpmnFactory
*
* @returns {ModdleElement}
*/
export function createDataOutputAssociation(bpmnFactory) {
  const outputAssociation = bpmnFactory.create('bpmn:DataOutputAssociation');

  const variableId = 'Output_' + generateId(5);

  const from = bpmnFactory.create('bpmn:Expression', {
    body: variableId
  });

  const to = bpmnFactory.create('bpmn:Expression', {
    body: variableId
  });

  const assignment = bpmnFactory.create('bpmn:Assignment', {
    from,
    to
  });

  collectionAdd(outputAssociation.get('assignment'), assignment);

  return outputAssociation;
}


// helper

function generateId(length) {
  let result = '';

  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  const charactersLength = characters.length;

  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
}