import CustomBpmnFactory from './CustomBpmnFactory';

export default {
  __depends__: [
  ],
  __init__: [
    'bpmnFactory'
  ],
  bpmnFactory: [ 'type', CustomBpmnFactory ]
};
