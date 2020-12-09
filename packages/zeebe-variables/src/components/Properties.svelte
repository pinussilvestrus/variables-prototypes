<script>
  import InputVariables from './properties/InputVariables.svelte';
  import OutputVariables from './properties/OutputVariables.svelte';
  import ProcessInputVariables from './properties/ProcessInputs.svelte';

  export let element = {};
  export let modeler;
</script>

<style lang="scss">
  #properties {
    position: relative;
    width: 280px;
    flex: none;
    background-color: whitesmoke;
    border-left: solid 1px #cccccc;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);

    .container {
      position: absolute;
      overflow-y: auto;
      width: 100%;
      height: 100%;
    }

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
      <InputVariables {element} {modeler} />
      <OutputVariables {element} {modeler} />
      <ProcessInputVariables {element} {modeler} />
    </div>
  </div>
</div>