<script>
  import {
    getBusinessObject,
    is
  } from 'bpmn-js/lib/util/ModelUtil';

  import {
    createDataInput,
    getDataInputs
  } from '../../utils/DataInputOutputHelper';

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

  const createProcessInput = () => {
    const bpmnFactory = modeler.get('bpmnFactory');

    const commandStack = modeler.get('commandStack');

    const businessObject = getBusinessObject(element);

    const {
      ioSpecification
    } = createDataInput(businessObject, bpmnFactory);

    commandStack.execute('update-businessobject', {
      element,
      businessObject,
      properties: {
        ioSpecification
      }
    });

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
      <p>{variable.id}</p>
    {:else}
      <p class="entry entry-description">No variables defined.</p>
    {/each}
  </div>
{/if}