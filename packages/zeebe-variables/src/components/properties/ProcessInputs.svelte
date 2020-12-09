<script>
  import {
    getBusinessObject,
    is
  } from 'bpmn-js/lib/util/ModelUtil';

  import {
    createDataInput,
    getDataInputs
  } from '../../utils/DataInputOutputHelper';

  import ProcessInputItem from './ProcessInputItem.svelte';

  let show = false;
  let variables = [];

  $: {
    show = is(element, 'bpmn:Process');
  }

  $: {
    element && updateVariables();
  }

  const updateVariables = () => {
    const businessObject = getBusinessObject(element);
    variables = getDataInputs(businessObject) || [];
  };

  const handleUpdateProperties = (dataInput, updates) => {
    const modeling = modeler.get('modeling');

    modeling.updateModdleProperties(
      element,
      dataInput,
      updates
    );
  };

  const createProcessInput = () => {
    const bpmnFactory = modeler.get('bpmnFactory');

    const modeling = modeler.get('modeling');

    const businessObject = getBusinessObject(element);

    const {
      ioSpecification
    } = createDataInput(businessObject, bpmnFactory);

    modeling.updateModdleProperties(
      element,
      businessObject,
      {
        ioSpecification
      }
    );

    updateVariables();
  };

  export let element = {};
  export let modeler;
</script>

{#if show}
  <div class="group">
    <p class="group-header">Process Input Variables</p>
    <button class="action-button add" on:click={createProcessInput}></button>

    {#each variables as variable}
      <ProcessInputItem 
        processInput={variable} 
        onUpdateProperties={handleUpdateProperties}
      />
    {:else}
      <p class="entry entry-description">No variables defined.</p>
    {/each}
  </div>
{/if}