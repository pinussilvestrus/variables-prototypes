<script>
  import { is } from 'bpmn-js/lib/util/ModelUtil';

  let show = false;

  $: {
    show = is(element, 'bpmn:Process');
  }

  export let element = {};
</script>

{#if show}
  <div class="group">
    <p class="group-header">Process Input Variables</p>
    <button class="action-button add"></button>

    <p class="entry entry-description">No variables defined.</p>
  </div>
{/if}