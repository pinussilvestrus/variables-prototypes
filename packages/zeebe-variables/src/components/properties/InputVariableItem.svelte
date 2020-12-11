<script>
  import dom from 'domtastic';

  import {
    map
  } from 'min-dash';

  import {
    getBusinessObject
  } from 'bpmn-js/lib/util/ModelUtil';

  import AutocompleteInput from '../AutocompleteInput.svelte';

  import Switch from '../Switch.svelte';

  import {
    getVariableName,
    getVariableAssignmentValue
  } from '../../utils/DataInputOutputHelper';

  const noop = () => {};

  let availableOptions = [];
  $: {
    if (modeler) {
      const variableStore = modeler.get('variableStore');

      const canvas = modeler.get('canvas');

      const rootElement = canvas.getRootElement();

      const businessObject = getBusinessObject(rootElement);

      // todo(pinussilvestrus): handle scopes
      const variables = variableStore.collectVariables(businessObject);

      // todo(pinussilvestrus): exclude own variables
      availableOptions = map(variables, (v) => v.name);
    }
  }


  let headerDescription;
  let variableName;
  let assignmentValue;
  let offDescription;
  let assignmentIsToggled;
  $: {
    if (variable) {
      headerDescription = '';
      variableName = getVariableName(variable);
      assignmentValue = getVariableAssignmentValue(variable);
      offDescription = getOffDescription();
      assignmentIsToggled = assignmentIsOn();
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
  
    if (!assignmentIsToggled) {
      assignment.get('from').set('body', getDefaultFromValue());
    }

    onUpdateProperties(variable, {
      assignment: [ assignment ]
    });
  };

  const handleValueChange = (event) => {
    const target = event.target;

    const value = target.value;

    const assignment = variable.get('assignment')[0];

    assignment.get('from').set('body', value);

    onUpdateProperties(variable, {
      assignment: [ assignment ]
    });
  };

  // todo(pinssulvestrus): handle this via zeebe:Input!
  // use <from> value as indicator for now
  const handleAssignmentSwitch = (checked) => {
    const assignment = variable.get('assignment')[0];

    let fromValue = checked ? '' : getDefaultFromValue();

    assignment.get('from').set('body', fromValue);

    onUpdateProperties(variable, {
      assignment: [ assignment ]
    });
  };

  const getDefaultFromValue = () => {
    const assignment = variable.get('assignment')[0];

    const toValue = assignment.get('to').get('body');

    return `= ${toValue}`;
  };

  const assignmentIsOn = () => {
    const fromValue = getVariableAssignmentValue(variable);

    return fromValue !== getDefaultFromValue();
  };

  const deleteVariable = () => {
    onDeleteVariable(variable);
  };

  const getOffDescription = () => {
    return `Local Variable "${variableName}" will be automatically assigned from a process variable with the same name.`;
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

    <label for="name">Local Variable Name</label>
    <AutocompleteInput 
      id="name"
      value={variableName}
      items={availableOptions}
      onChange={handleNameChange}
    />

    <label for="">Variable Assignment</label>
    <Switch 
      onCheck="{handleAssignmentSwitch}" 
      checked={assignmentIsToggled} 
      onLabel="On"
      offLabel="Off"
      {offDescription}
    />

    {#if assignmentIsToggled}
      <label for="value">Variable Assignment Value</label>
      <input 
        id="value" 
        autocomplete="off" 
        value={assignmentValue} 
        on:change={handleValueChange} />
    {/if}
  </div>
</div>