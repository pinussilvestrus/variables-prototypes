<script>
  import {
    getBusinessObject,
    is
  } from 'bpmn-js/lib/util/ModelUtil';

  import {
    createDataInput
  } from '../../utils';

  let show = false;

  $: {
    show = is(element, 'bpmn:Process');
  }

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
  };

  export let element = {};
  export let modeler;
</script>

{#if show}
  <div class="group">
    <p class="group-header">Process Input Variables</p>
    <button class="action-button add" on:click={createProcessInput}></button>

    <p class="entry entry-description">No variables defined.</p>
  </div>
{/if}