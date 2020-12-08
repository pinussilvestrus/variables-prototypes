<script>
  import { is } from 'bpmn-js/lib/util/ModelUtil';

  let show = false;

  $: {
    show = is(element, 'bpmn:Task');
  }

  export let element = {};
</script>

{#if show}
  <div class="group">
    <p class="group-header">Input Variables</p>
    <button class="action-button add"></button>

    <p class="entry entry-description">No variables defined.</p>
  </div>
  <div class="group">
    <p class="group-header">Output Variables</p>
    <button class="action-button add"></button>

    <p class="entry entry-description">No variables defined.</p>
  </div>
{/if}