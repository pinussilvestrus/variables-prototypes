<script>
  import { onMount } from 'svelte';

  import BpmnModeler from 'bpmn-js/lib/Modeler';

  import CustomExtensions from '../features/custom-extensions';

  import CustomBehaviors from '../features/behavior';

  import VariableStore from '../features/variable-store';

  import VariableVisualization from '../features/variable-visualization';


  import 'bpmn-js/dist/assets/diagram-js.css';

  import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

  const noop = () => {};

  const bindListeners = (modeler) => {
    const canvas = modeler.get('canvas');

    modeler.on('selection.changed', function(event) {
      const {
        newSelection
      } = event;

      // only support single selection
      if (newSelection.length > 1) {
        return;
      }

      let element = newSelection[0];

      // fall back to root element
      if (!element) {
        element = canvas.getRootElement();
      }

      onSelectionChanged(element);
    });

    modeler.on('commandStack.changed', function(event) {
      onDiagramChanged(modeler);
    });

    modeler.on('import.done', function(event) {
      onDiagramLoaded(modeler);
    });
  };

  onMount(async () => {
    const modeler = new BpmnModeler({
      container: '.diagram-container',
      keyboard: { bindTo: document },
      additionalModules: [
        CustomExtensions,
        VariableStore,
        CustomBehaviors,
        VariableVisualization
      ]
    });

    const { error } = await modeler.importXML(xml);

    if (error) {
      console.error(error);
      return;
    }

    const canvas = modeler.get('canvas');

    canvas.zoom('fit-viewport');

    onDiagramLoaded(modeler);

    bindListeners(modeler);
  });

  export let xml = '';

  export let onDiagramLoaded = noop;
  export let onSelectionChanged = noop;
  export let onDiagramChanged = noop;
</script>

<style lang="scss">
  #diagram {
    display: flex;
    flex: 1;

    position: relative;

    height: 100%;
    min-width: 720px;

    flex-direction: row;

    .diagram-container {
      flex: 1;
      position: relative;
    }
  }
</style>

<div id="diagram">
  <div class="diagram-container"></div>
</div>