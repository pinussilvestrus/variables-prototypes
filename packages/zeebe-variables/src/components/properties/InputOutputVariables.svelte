<script>
  import { is } from 'bpmn-js/lib/util/ModelUtil';

  let show = false;

  $: {
    show = is(element, 'bpmn:Task');
  }

  export let element = {};
</script>

<style lang="scss">
  #properties {
    width: 280px;
    flex: none;
    background-color: whitesmoke;
    border-left: solid 1px #cccccc;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);

    .header {
      padding: 15px;
      padding-bottom: 5px;

      .title {
        font-size: 24px;
        font-weight: bolder;
      }
    }

    .group {
      padding: 10px 15px;

      .group-header {
        font-weight: bolder;
        display: inline-block;
        vertical-align: middle;
        color: #666666;
        font-size: 16px;
      }

      &+.group {
        border-top: 1px solid #eeeeee;
      }

      &:last-child {
        padding-bottom: 9px;
      }

      .entry {
        margin-bottom: 6px;

        &.entry-description {
          margin-top: 5px;
          color: #999999;
        }
      }
    }
  }
</style>

{#if show}
  <div class="group">
    <p class="group-header">Input Variables</p>
    <p class="entry entry-description">No variables defined.</p>
  </div>
  <div class="group">
    <p class="group-header">Output Variables</p>
    <p class="entry entry-description">No variables defined.</p>
  </div>
{/if}