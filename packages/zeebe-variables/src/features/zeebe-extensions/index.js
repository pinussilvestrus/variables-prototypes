import CustomPaletteProvider from './CustomPaletteProvider';
import CustomReplaceMenuProvider from './CustomReplaceMenuProvider';
import CustomContextPadProvider from './CustomContextPadProvider';
import CustomRules from './CustomRules';
import CustomBpmnFactory from './CustomBpmnFactory';

export default {
  __depends__: [
  ],
  __init__: [
    'bpmnRules',
    'paletteProvider',
    'contextPadProvider',
    'replaceMenuProvider',
    'bpmnFactory'
  ],
  bpmnRules: [ 'type', CustomRules ],
  paletteProvider: [ 'type', CustomPaletteProvider ],
  replaceMenuProvider: [ 'type', CustomReplaceMenuProvider ],
  contextPadProvider: [ 'type', CustomContextPadProvider ],
  bpmnFactory: [ 'type', CustomBpmnFactory ]
};
