<script>
  import { debounce, forEach } from 'min-dash';

  import dom from 'domtastic';

  const noop = () => {};


  // lifecycle //////////

  let filteredItems = [];
  $: { // handleItemsUpdate
    const itemsNode = dom('.autocomplete-items');
    itemsNode.css('display', filteredItems.length ? 'block': 'none');
  }


  // methods //////////

  const setFullItems = () => {
    filteredItems = items;
  };

  const clear = () => {
    filteredItems = [];
  };

  const handleClick = (event) => {
    setFullItems();
  };

  const handleInputChange = ({ target }) => {
    const node = dom(target);

    const value = node.val();

    if (!value || value === '') {
      return setFullItems({ target });
    }

    filteredItems = [];
  
    forEach(items, (item) => {
  
      // simple full text search
      // todo(pinussilvestrus): improve
      if (item.includes(value)) {
        filteredItems.push(item);
      }
    });
  };

  const handleFocusOut = ({ target }) => {
    clear();
  };

  const handleItemSelect = (event) => {
    const { target } = event;

    const node = dom(target);
  
    clear();
  
    value = node.text();
  
    onChange({
      target: {
        value
      }
    });
  };
  

  // exports //////////

  export let id;
  export let value = '';
  export let items = [];
  export let onChange = noop;
</script>

<style lang="scss">
  .autocomplete {
    position: relative;

    input {
      margin-bottom: 0 !important;
    }

    .autocomplete-items {
      display: none;
      position: absolute;
      box-shadow: 0 0.05rem 0.25rem 0 rgba(0, 0, 0, 0.2);
      border-bottom-left-radius: 3px;
      border-bottom-right-radius: 3px;
      z-index: 99;
      background-color: white;

      top: 95%;
      left: 0;
      right: 0;

      .autocomplete-item {
        margin: 0;
        font-size: 12px;
        padding: 10px;
        cursor: pointer;
        border-bottom: 1px solid #efefef;

        &:last-child {
          border-bottom: none;
        }

        &:hover {
          background-color: #efefef;
        }

        strong {
          color: #4d90ff
        }
      }
    }
  }
</style>

<div class="autocomplete">
  <input 
    id="{id}" 
    on:mouseup|preventDefault={handleClick}
    on:input|preventDefault={handleInputChange}
    on:change|preventDefault={onChange}
    on:focusout|preventDefault={debounce(handleFocusOut, 200)}
    autocomplete="off"
    list="{`items-${id}`}"
    value="{value}"/>
  <div class="autocomplete-items">
    {#each filteredItems as item }
      <p class="autocomplete-item" on:click={handleItemSelect}>{item}</p>
    {/each}
  </div>
</div>