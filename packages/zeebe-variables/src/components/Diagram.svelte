<script>
  import { onMount } from 'svelte';

  import BpmnModeler from 'bpmn-js/lib/Modeler';

  import ZeebeModelerExtensions from '../features';

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
  };

  onMount(async () => {
    const modeler = new BpmnModeler({
      container: '.diagram-container',
      keyboard: { bindTo: document },
      additionalModules: [
        ZeebeModelerExtensions
      ]
    });

    const { error } = await modeler.importXML(xml);

    if (error) {
      console.error(error);
      return;
    }

    const canvas = modeler.get('canvas');

    canvas.zoom('fit-viewport');

    onDiagramLoaded();

    bindListeners(modeler);
  });

  export let xml = '';

  export let onDiagramLoaded = noop;
  export let onSelectionChanged = noop;
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