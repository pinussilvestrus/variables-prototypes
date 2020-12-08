import {
  add as collectionAdd
} from 'diagram-js/lib/util/Collections';

export function getIOSpeficiation(element) {
  return element.get('ioSpecification');
}

export function getDataInputs(element) {
  const ioSpecification = getIOSpeficiation(element);

  return ioSpecification && ioSpecification.get('dataInputs');
}

/**
* Create and return bpmn:DataInput.
*
* Create bpmn:InputOutputSpecification, dataInputs and inputSets if not
* found.
*
* @param {ModdleElement} element - Element.
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