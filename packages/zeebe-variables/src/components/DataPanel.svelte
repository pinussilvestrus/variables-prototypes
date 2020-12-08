<script>
  import {
    getBusinessObject
  } from 'bpmn-js/lib/util/ModelUtil';

  let activeTab = 'variables';
  let variables = [];

  const setTab = (id) => {
    activeTab = id;
  };

  const updateVariables = () => {
    const canvas = modeler.get('canvas');

    const variableStore = modeler.get('variableStore');

    const rootElement = canvas.getRootElement();

    const businessObject = getBusinessObject(rootElement);

    // todo(pinussilvestrus): handle as names
    variables = variableStore.collectVariables(businessObject);
  };

  $: {
    modeler && updateVariables();
  }

  export let modeler;
  export let xml;
</script>

<style lang="scss">
  #data-panel {
    height: 33%;
    width: 100%;
    flex: none;
    background-color: whitesmoke;
    border-top: solid 1px #cccccc;
    box-shadow: 0 0 2px rgba(0, 0, 0, 0.1);

    .container {
      height: 100%;
    }

    .tabs {
      border-bottom: solid 2px #dddddd;
      display: flex;
      justify-content: flex-start;
      padding: 0 5px 0;

      .tab {   
        cursor: pointer;
        padding: 12px 10px;
        margin-right: 10px;

        &.active {
          font-weight: bold;
          border-bottom: solid 3px black;
        }
      }

    }

    .content {
      padding: 10px 15px;
      overflow: auto;
      height: 75%;
    }
  }
</style>

<div id="data-panel">
  <div class="container">
    <div class="tabs">
      <div 
        class="tab" 
        on:click={setTab.bind(this, 'variables')}
        class:active="{activeTab === 'variables'}">
          Variables
        </div>
      <div 
        class="tab" 
        on:click={setTab.bind(this, 'xml')}
        class:active="{activeTab === 'xml'}">
          XML
      </div>
    </div>
    <div class="content">
      {#if activeTab === 'variables'}
        {#if variables.length}
          <div class="variables">
            <table>
              <tr>
                <th>Name</th>
                <th>Created In</th>
                <th>Used In</th>
              </tr>
              {#each variables as variable}
                <tr>
                  <td>{variable.name}</td>
                  <td>{variable.origin}</td>
                  <td>{variable.usage}</td>
                </tr>
              {/each}
            </table>
          </div>
        {:else}
          No variables defined.
        {/if}
      {/if}
      {#if activeTab === 'xml'}
        <pre>{xml}</pre>
      {/if}
    </div>
  </div>
</div>