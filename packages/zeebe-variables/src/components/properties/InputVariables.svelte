<script>
  import {
    getBusinessObject,
    is
  } from 'bpmn-js/lib/util/ModelUtil';

  import {
    add as collectionAdd
  } from 'diagram-js/lib/util/Collections';

  import {
    createDataInputAssociation,
    getDataInputAssociations
  } from '../../utils/DataInputOutputHelper';

  import InputVariableItem from './InputVariableItem.svelte';

  let show = false;
  let variables = [];

  $: {
    show = is(element, 'bpmn:Task');
  }

  $: {
    element && updateVariables();
  }

  const updateVariables = () => {
    const businessObject = getBusinessObject(element);
    variables = getDataInputAssociations(businessObject) || [];
  };

  const createInputVariable = () => {
    const bpmmFactory = modeler.get('bpmnFactory');

    const modeling = modeler.get('modeling');

    const businessObject = getBusinessObject(element);
  
    const inputAssociations = getDataInputAssociations(businessObject);
  
    const outputAssociation = createDataInputAssociation(bpmmFactory);

    collectionAdd(inputAssociations, outputAssociation);

    modeling.updateModdleProperties(
      element,
      businessObject,
      {
        dataInputAssociations: inputAssociations
      }
    );

    updateVariables();
  };

  const handleUpdateProperties = (dataInputAssociation, updates) => {
    const modeling = modeler.get('modeling');

    modeling.updateModdleProperties(
      element,
      dataInputAssociation,
      updates
    );

    // dirty stuff :-(
    updateVariables();
  };
  
  export let element = {};
  export let modeler;
</script>

{#if show}
  <div class="group">
    <p class="group-header">Input Variables</p>
    <button class="action-button add" on:click={createInputVariable}></button>

    {#each variables as variable}
      <InputVariableItem 
        {variable} 
        onUpdateProperties={handleUpdateProperties}
      />
    {:else}
      <p class="entry entry-description">No variables defined.</p>
    {/each}
  </div>
{/if}