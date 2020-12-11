import BpmnFactory from 'bpmn-js/lib/features/modeling/BpmnFactory';

import {
  isAny
} from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

export default class CustomBpmnFactory extends BpmnFactory {

  constructor(moddle) {
    super(moddle);
  }

  _needsId(element) {
    return isAny(element, [
      'bpmn:RootElement',
      'bpmn:FlowElement',
      'bpmn:MessageFlow',
      'bpmn:DataAssociation',
      'bpmn:Artifact',
      'bpmn:Participant',
      'bpmn:Lane',
      'bpmn:LaneSet',
      'bpmn:Process',
      'bpmn:Collaboration',
      'bpmndi:BPMNShape',
      'bpmndi:BPMNEdge',
      'bpmndi:BPMNDiagram',
      'bpmndi:BPMNPlane',
      'bpmn:Property',
      'bpmn:InputOutputSpecification',
      'bpmn:DataInput',
      'bpmn:InputSet',
      'bpmn:DataOutput',
      'bpmn:OutputSet'
    ]);
  }
}

CustomBpmnFactory.$inject = [ 'moddle' ];