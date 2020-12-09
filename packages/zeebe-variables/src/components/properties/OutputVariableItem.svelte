<script>
  import dom from 'domtastic';

  import {
    getVariableName
  } from '../../utils/DataInputOutputHelper';

  const noop = () => {};

  let headerDescription;
  let variableName;

  $: {
    if (variable) {
      headerDescription = '';
      variableName = getVariableName(variable);
    }
  }

  const handleTitleClick = (event) => {
    const titleNode = dom(event.target),
          containerGfx = titleNode.closest('.output');

    if (containerGfx.hasClass('active')) {
      containerGfx.removeClass('active');
    } else {
      containerGfx.addClass('active');
    }
  };

  const handleIdChange = (event) => {
    const target = event.target;

    const value = target.value;

    onUpdateProperties(variable, {
      id: value
    });
  };

  export let variable;
  export let onUpdateProperties = noop;

</script>

<div class="item output" id={`${variable.id}`}>
  <div class="item-header input-header" on:click={handleTitleClick}>
    <p class="item-name"><i class="chevron"></i>{variableName}</p>
    <p class="item-description">{headerDescription}</p>
  </div>
  <div class="item-details">
    <label for="id">Process Variable Name</label>
    <input 
      id="id" 
      autocomplete="off" 
      value={variableName} 
      on:change={handleIdChange} />
  </div>
</div>