<script>
  import {
    getBusinessObject
  } from 'bpmn-js/lib/util/ModelUtil';

  import download from 'downloadjs';

  import {
    forEach,
    reduce,
    find,
    keys,
    groupBy
  } from 'min-dash';

  import dom from 'domtastic';

  let activeTab = 'variables';
  let variables = [];
  let multipleScopes = false;

  const setTab = (id) => {
    activeTab = id;
  };

  const groupByScope = (variables) => {
    return groupBy(variables, 'scopeDisplay');
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

      variable.scopeDisplay = variable.scope.name || variable.scope.id;
    });

    const byScopes = groupByScope(variables);

    multipleScopes = keys(byScopes).length > 1;
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

  const handleOpenFileClick = () => {
    const fileInput = dom('#file-open');

    // clear input so that previously selected file can be reopened
    fileInput.val('');
    fileInput.trigger('click');
  };

  const handleDownloadFile = () => {
    return download(
      'data:' + 'application/xml' + ';charset=UTF-8,' + encodeURIComponent(xml),
      'diagram.bpmn',
      'application/xml'
    );
  };

  const handleOpenFile = (event) => {
    const file = event.target.files[0];

    openFile(file, (contents) => {
      modeler.importXML(contents);
    });
  };

  function openFile(file, callback) {

    // check file api availability
    if (!window.FileReader) {
      return window.alert(
        'Looks like you use an older browser that does not support drag and drop. ' +
    'Try using a modern browser such as Chrome, Firefox or Internet Explorer > 10.');
    }

    // no file chosen
    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = function(e) {

      const xml = e.target.result;

      callback(xml);
    };

    reader.readAsText(file);
  }

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
      position: relative;
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

    .actions {
      position: absolute;
      right: 0;
      top: 0;
      padding: 12px 7px;

      .action {
        height: 20px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 12px;
      }

      .download {
        content: url('data:image/svg+xml,<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="download" class="svg-inline--fa fa-download fa-w-16" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M216 0h80c13.3 0 24 10.7 24 24v168h87.7c17.8 0 26.7 21.5 14.1 34.1L269.7 378.3c-7.5 7.5-19.8 7.5-27.3 0L90.1 226.1c-12.6-12.6-3.7-34.1 14.1-34.1H192V24c0-13.3 10.7-24 24-24zm296 376v112c0 13.3-10.7 24-24 24H24c-13.3 0-24-10.7-24-24V376c0-13.3 10.7-24 24-24h146.7l49 49c20.1 20.1 52.5 20.1 72.6 0l49-49H488c13.3 0 24 10.7 24 24zm-124 88c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20zm64 0c0-11-9-20-20-20s-20 9-20 20 9 20 20 20 20-9 20-20z"></path></svg>');
      }

      .open-file {
        content: url('data:image/svg+xml,<svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="folder-open" class="svg-inline--fa fa-folder-open fa-w-18" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M572.694 292.093L500.27 416.248A63.997 63.997 0 0 1 444.989 448H45.025c-18.523 0-30.064-20.093-20.731-36.093l72.424-124.155A64 64 0 0 1 152 256h399.964c18.523 0 30.064 20.093 20.73 36.093zM152 224h328v-48c0-26.51-21.49-48-48-48H272l-64-64H48C21.49 64 0 85.49 0 112v278.046l69.077-118.418C86.214 242.25 117.989 224 152 224z"></path></svg>');
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

    <div class="actions">
      <div class="action open-file" on:click={handleOpenFileClick}></div>
      <input 
        id="file-open" 
        hidden 
        type="file"
        accept=".bpmn"
        on:change={handleOpenFile} />
      <div class="action download" on:click={handleDownloadFile}></div>
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
                {#if multipleScopes}
                  <th class="scope">Scope</th>
                {/if}
              </tr>
              {#each variables as variable}
                <tr 
                  data-name="{variable.name}" 
                  on:mouseenter={handleVariableHover}
                  on:mouseleave={handleVariableLeave} >
                  <td>{variable.name}</td>
                  <td>{variable.createdInDisplay}</td>
                  <td>{variable.usedInDisplay}</td>
                  {#if multipleScopes}
                    <td>{variable.scopeDisplay}</td>
                  {/if}
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