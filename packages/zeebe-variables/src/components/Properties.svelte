<script>
  import InputOutputVariables from './properties/InputOutputVariables.svelte';

  export let element = {};

  $: {
    console.log(element);
  }
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
  }
</style>

<div id="properties">
  <div class="container">
    <div class="header">
      <div class="title">{element.businessObject.name || element.id}</div>
    </div>

    <div class="properties">
      <InputOutputVariables {element} />
    </div>
  </div>
</div>