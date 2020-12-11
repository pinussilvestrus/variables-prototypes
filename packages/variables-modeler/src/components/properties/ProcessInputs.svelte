<script>
  import {
    getBusinessObject
  } from 'bpmn-js/lib/util/ModelUtil';

  import {
    isAny
  } from 'bpmn-js/lib/features/modeling/util/ModelingUtil';

  import {
    createDataInput,
    getDataInputs,
    removeDataInput
  } from '../../utils/DataInputOutputHelper';

  import ProcessInputItem from './ProcessInputItem.svelte';

  let show = false;
  let variables = [];

  $: {
    show = isAny(element, [ 'bpmn:Process', 'bpmn:SubProcess' ]);
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

    // dirty stuff :-(
    updateVariables();
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

  const handleDeleteProcessInput = (dataInput) => {
    const modeling = modeler.get('modeling');

    const businessObject = getBusinessObject(element);

    const ioSpecification = removeDataInput(businessObject, dataInput);

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
        onDeleteProcessInput={handleDeleteProcessInput}
        {modeler}
      />
    {:else}
      <p class="entry entry-description">No variables defined.</p>
    {/each}
  </div>
{/if}