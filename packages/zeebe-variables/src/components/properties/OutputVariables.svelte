<script>
  import {
    getBusinessObject,
    is
  } from 'bpmn-js/lib/util/ModelUtil';

  import {
    add as collectionAdd
  } from 'diagram-js/lib/util/Collections';

  import {
    createDataOutputAssociation,
    getDataOutputAssociations
  } from '../../utils/DataInputOutputHelper';

  import OutputVariableItem from './OutputVariableItem.svelte';

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
    variables = getDataOutputAssociations(businessObject) || [];
  };

  const createOutputVariable = () => {
    const bpmmFactory = modeler.get('bpmnFactory');

    const modeling = modeler.get('modeling');

    const businessObject = getBusinessObject(element);
  
    const outputAssociations = getDataOutputAssociations(businessObject);
  
    const outputAssociation = createDataOutputAssociation(bpmmFactory);

    collectionAdd(outputAssociations, outputAssociation);

    modeling.updateModdleProperties(
      element,
      businessObject,
      {
        dataOutputAssociations: outputAssociations
      }
    );

    updateVariables();
  };

  const handleUpdateProperties = (dataOutputAssociation, updates) => {
    const modeling = modeler.get('modeling');

    modeling.updateModdleProperties(
      element,
      dataOutputAssociation,
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
    <p class="group-header">Output Variables</p>
    <button class="action-button add" on:click={createOutputVariable}></button>

    {#each variables as variable}
    <OutputVariableItem 
      {variable} 
      {modeler}
      onUpdateProperties={handleUpdateProperties}
    />
    {:else}
      <p class="entry entry-description">No variables defined.</p>
    {/each}
  </div>
{/if}