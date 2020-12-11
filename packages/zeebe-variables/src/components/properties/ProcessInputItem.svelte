<script>
  import dom from 'domtastic';

  const noop = () => {};

  let headerDescription;
  $: {
    if (processInput) {
      headerDescription = getDocumentation();
    }
  }

  const handleTitleClick = (event) => {
    const titleNode = dom(event.target),
          containerGfx = titleNode.closest('.process-input');

    if (containerGfx.hasClass('active')) {
      containerGfx.removeClass('active');
    } else {
      containerGfx.addClass('active');
    }
  };

  const handleNameChange = (event) => {
    const target = event.target;

    const value = target.value;

    onUpdateProperties(processInput, {
      name: value
    });
  };

  const handleDescriptionChange = (event) => {
    const target = event.target;

    const value = target.value;

    const bpmnFactory = modeler.get('bpmnFactory');

    const documentation = bpmnFactory.create('bpmn:Documentation', {
      text: value
    });

    onUpdateProperties(processInput, {
      documentation: [ documentation ]
    });
  };

  const getDocumentation = () => {
    const documentation = processInput && processInput.get('documentation');

    if (!documentation.length) {
      return '';
    }

    return documentation[0].text;
  };

  const deleteProcessInput = () => {
    onDeleteProcessInput(processInput);
  };

  export let processInput;
  export let onUpdateProperties = noop;
  export let onDeleteProcessInput = noop;
  export let modeler;

</script>

<div class="item process-input" id={`${processInput.id}`}>
  <div class="item-header input-header" on:click={handleTitleClick}>
    <p class="item-name"><i class="chevron"></i>{processInput.name}</p>
    <p class="item-description">{headerDescription}</p>
  </div>
  <div class="item-details">
    <button class="action-button delete" on:click={deleteProcessInput}></button>

    <label for="name">Process Variable Name</label>
    <input 
      id="name" 
      autocomplete="off" 
      value={processInput.name} 
      on:change={handleNameChange} />

    <label for="description">Description</label>
    <textarea 
      id="description"
      autocomplete="off" 
      value={getDocumentation()}
      on:change={handleDescriptionChange} />

  </div>
</div>