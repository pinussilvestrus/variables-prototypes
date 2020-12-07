<script>
	import Diagram from './components/Diagram.svelte';
	import Properties from './components/Properties.svelte';
	import BottomPanel from './components/BottomPanel.svelte';

	import startDiagram from './resources/diagram_1.bpmn';

	let currentElement;

	const handleSelectionChanged = (element) => {
	  currentElement = element;
	};
	
</script>

<div id="root">
	<main>
		<div class="editor">
			<Diagram 
				xml={startDiagram} 
				onSelectionChanged={handleSelectionChanged}
			/>

			{#if currentElement}
				<Properties 
					element={currentElement}
				/>
			{/if}
		</div>
		<BottomPanel />
	</main>
</div>

<style lang="scss">
	#root {
		height: 100%;
		width: 100%;
	}

	main {
		flex-grow: 1;
		flex: 1;
		height: 100%;
  	display: flex;
  	flex-direction: column;

		.editor {
			display: flex;
			flex: 1;
			flex-direction: row;
		}
	}
</style>