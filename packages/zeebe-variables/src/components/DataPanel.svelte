<script>
  import {
    getBusinessObject
  } from 'bpmn-js/lib/util/ModelUtil';

  import {
    forEach,
    reduce,
    find
  } from 'min-dash';

  import dom from 'domtastic';

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

    variables = variableStore.collectVariables(businessObject);

    // set display with ids (and names if applicable)
    forEach(variables, (variable) => {
      variable.createdInDisplay = reduce(variable.createdIn, (result, c, idx) => {
        let separator = ', ';

        const {
          createdIn
        } = c;

        if (idx === variable.createdIn.length - 1) {
          separator = '';
        }

        const displayName = createdIn.name || createdIn.id;

        return result += displayName + separator;
      }, '');

      variable.usedInDisplay = reduce(variable.usedIn, (result, u, idx) => {
        let separator = ', ';

        if (idx === variable.usedIn.length - 1) {
          separator = '';
        }

        const displayName = u.name || u.id;

        return result += displayName + separator;
      }, '');
    });
  };

  const handleVariableHover = (event) => {
    const variableVisualization = modeler.get('variableVisualization');

    const node = dom(event.target);

    const row = node.closest('tr');

    const variableName = row.attr('data-name');

    if (!variableName) {
      return;
    }

    const variable = find(variables, (v) => {
      return v.name === variableName;
    });

    variableVisualization.highlightVariable(variable);
  };

  const handleVariableLeave = (event) => {
    const variableVisualization = modeler.get('variableVisualization');
    variableVisualization.cleanup();
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

    .variables {

      table {
        width: 100%;

        th {
          text-align: start;
          font-style: italic;
          border-bottom: 1px solid #cccccc;
          padding: 4px 7px;

          &.name {
            width: 20%;
          }

          &.createdIn {
            width: 40%;
          }

          &.usedIn {
            width: 40%;
          }
        }

        td {
          border-bottom: 1px solid #cccccc;
          padding: 4px 7px;
        }
      }

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
                <th class="name">Name</th>
                <th class="createdIn">Created In</th>
                <th class="usedIn">Used In</th>
              </tr>
              {#each variables as variable}
                <tr 
                  data-name="{variable.name}" 
                  on:mouseenter={handleVariableHover}
                  on:mouseleave={handleVariableLeave} >
                  <td>{variable.name}</td>
                  <td>{variable.createdInDisplay}</td>
                  <td>{variable.usedInDisplay}</td>
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