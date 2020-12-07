<script>
	import Diagram from './components/Diagram.svelte';
	import Properties from './components/Properties.svelte';
	import BottomPanel from './components/BottomPanel.svelte';

	import startDiagram from './resources/diagram_1.bpmn';

	let currentElement;
	let currentXml;

	const handleSelectionChanged = (element) => {
	  currentElement = element;
	};

	const handleUpdateXML = async (modeler) => {
	  const {
	    error,
	    xml
	  } = await modeler.saveXML({ format: true });
	
	  if (error) {
	    return;
	  }

	  currentXml = xml;
	};
	
</script>

<div id="root">
	<main>
		<div class="editor">
			<Diagram 
				xml={startDiagram} 
				onSelectionChanged={handleSelectionChanged}
				onDiagramChanged={handleUpdateXML}
				onDiagramLoaded={handleUpdateXML}
			/>

			{#if currentElement}
				<Properties 
					element={currentElement}
				/>
			{/if}
		</div>
		<BottomPanel
			xml={currentXml}
		/>
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