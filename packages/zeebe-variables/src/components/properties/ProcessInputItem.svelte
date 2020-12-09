<script>
  import dom from 'domtastic';

  const noop = () => {};

  const handleTitleClick = (event) => {
    const titleNode = dom(event.target),
          containerGfx = titleNode.closest('.input');

    if (containerGfx.hasClass('active')) {
      containerGfx.removeClass('active');
    } else {
      containerGfx.addClass('active');
    }
  };

  const getHeaderDescription = () => {
    return '';
  };

  const handleIdChange = (event) => {
    const target = event.target;

    const value = target.value;

    onUpdateProperties(processInput, {
      id: value
    });

    processInput = {
      ...processInput,
      id: value
    };
  };

  export let processInput;
  export let onUpdateProperties = noop;

</script>

<div class="item input" id={`${processInput.id}`}>
  <div class="item-header input-header" on:click={handleTitleClick}>
    <p class="item-name"><i class="chevron"></i>{processInput.id}</p>
    <p class="item-description">{getHeaderDescription()}</p>
  </div>
  <div class="item-details">
    <label for="id">Process Variable Name</label>
    <input autocomplete="off" value={processInput.id} id="id" on:change={handleIdChange} />
  </div>
</div>