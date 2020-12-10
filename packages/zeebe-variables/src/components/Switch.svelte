<script>
  const noop = () => {};

  const handleChange = (event) => {
    checked = event.target.checked;
    onCheck(checked);
  };

  export let checked = false;
  export let offLabel = 'Off';
  export let onLabel = 'On';
  export let onDescription = '';
  export let offDescription = '';
  export let onCheck = noop;

</script>

<style lang="scss">
  .switch {
    display: block;
    margin-bottom: 7px;

    .label {
      margin: 0;
      margin-left: 3px;
      display: inline-block;
    }

    .switcher {
      position: relative;
      display: inline-block;
      width: 48px;
      height: 20px;

      input {
        opacity: 0;
        width: 0;
        height: 0;
      }

      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #cdcdcd;
        -webkit-transition: 0.4s;
        transition: 0.4s;
        border-radius: 34px;

        &:before {
          position: absolute;
          content: "";
          height: 16px;
          width: 16px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          -webkit-transition: 0.4s;
          transition: 0.4s;
          border-radius: 50%;
        }
      }

      input:checked + .slider {
        background-color: #4d90ff;
        box-shadow: 0 0 1px #4d90ff;

        &:before {
          -webkit-transform: translateX(28px);
          -ms-transform: translateX(28px);
          transform: translateX(28px);
        }
      }
    }
  }
</style>

<div class="switch">
  <label class="switcher">
      <input type="checkbox" {checked} on:change={handleChange} />
      <span class="slider" />
  </label>
    
  <p class="label">{checked ? onLabel : offLabel}</p>

  <p class="entry entry-description">{checked ? onDescription : offDescription}</p>
</div>
