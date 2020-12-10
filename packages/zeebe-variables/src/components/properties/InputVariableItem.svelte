<script>
  import dom from 'domtastic';

  import {
    map
  } from 'min-dash';

  import {
    getBusinessObject
  } from 'bpmn-js/lib/util/ModelUtil';

  import AutocompleteInput from '../AutocompleteInput.svelte';

  import {
    getVariableName
  } from '../../utils/DataInputOutputHelper';

  const noop = () => {};

  let headerDescription;
  let variableName;

  // todo(pinussilvestrus): get via variable store
  let availableOptions = [];
  $: {
    if (modeler) {
      const variableStore = modeler.get('variableStore');

      const canvas = modeler.get('canvas');

      const rootElement = canvas.getRootElement();

      const businessObject = getBusinessObject(rootElement);

      const variables = variableStore.collectVariables(businessObject);

      // todo(pinussilvestrus): exclude own variables
      availableOptions = map(variables, (v) => v.name);
    }
  }

  $: {
    if (variable) {
      headerDescription = '';
      variableName = getVariableName(variable);
    }
  }

  const handleTitleClick = (event) => {
    const titleNode = dom(event.target),
          containerGfx = titleNode.closest('.input');

    if (containerGfx.hasClass('active')) {
      containerGfx.removeClass('active');
    } else {
      containerGfx.addClass('active');
    }
  };

  const handleNameChange = (event) => {
    const target = event.target;

    const value = target.value;

    const assignment = variable.get('assignment')[0];

    assignment.get('to').set('body', value);
  
    // todo(pinussilvestrus): handle variable assignment value state
    assignment.get('from').set('body', '= ' + value);

    onUpdateProperties(variable, {
      assignment: [ assignment ]
    });
  };

  const deleteVariable = () => {
    onDeleteVariable(variable);
  };

  export let variable;
  export let onUpdateProperties = noop;
  export let onDeleteVariable = noop;
  export let modeler;

</script>

<div class="item input" id={`${variable.id}`}>
  <div class="item-header input-header" on:click={handleTitleClick}>
    <p class="item-name"><i class="chevron"></i>{variableName}</p>
    <p class="item-description">{headerDescription}</p>
  </div>
  <div class="item-details">
    <button class="action-button delete" on:click={deleteVariable}></button>

    <label for="id">Local Variable Name</label>
    <AutocompleteInput 
      id="name"
      value={variableName}
      items={availableOptions}
      onChange={handleNameChange}
    />
  </div>
</div>