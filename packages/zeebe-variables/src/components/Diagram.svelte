<script>
  import { onMount } from 'svelte';

  import BpmnModeler from 'bpmn-js/lib/Modeler';

  import 'bpmn-js/dist/assets/diagram-js.css';

  import 'bpmn-js/dist/assets/bpmn-font/css/bpmn-embedded.css';

  const noop = () => {};


  onMount(async () => {
    const modeler = new BpmnModeler({
      container: '#canvas',
      keyboard: { bindTo: document }
    });

    const { error } = await modeler.importXML(xml);

    if (error) {
      console.error(error);
      return;
    }

    const canvas = modeler.get('canvas');

    canvas.zoom('fit-viewport');

    onDiagramLoaded();

  });

  export let xml = '';

  export let onDiagramLoaded = noop;
</script>

<style type="text/scss">
  #canvas {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
  }
</style>

<div id="canvas">
</div>