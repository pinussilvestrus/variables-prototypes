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
          containerGfx = titleNode.closest('.input');

    if (containerGfx.hasClass('active')) {
      containerGfx.removeClass('active');
    } else {
      containerGfx.addClass('active');
    }
  };

  const handleIdChange = (event) => {
    const target = event.target;

    const value = target.value;

    onUpdateProperties(processInput, {
      id: value
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

  export let processInput;
  export let onUpdateProperties = noop;
  export let modeler;

</script>

<div class="item input" id={`${processInput.id}`}>
  <div class="item-header input-header" on:click={handleTitleClick}>
    <p class="item-name"><i class="chevron"></i>{processInput.id}</p>
    <p class="item-description">{headerDescription}</p>
  </div>
  <div class="item-details">
    <label for="id">Process Variable Name</label>
    <input 
      id="id" 
      autocomplete="off" 
      value={processInput.id} 
      on:change={handleIdChange} />

    <label for="description">Description</label>
    <textarea 
      id="description"
      autocomplete="off" 
      value={getDocumentation()}
      on:change={handleDescriptionChange} />
  </div>
</div>