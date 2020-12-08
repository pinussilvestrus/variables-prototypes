<script>
	import Diagram from './components/Diagram.svelte';
	import Properties from './components/Properties.svelte';
	import DataPanel from './components/DataPanel.svelte';

	import startDiagram from './resources/diagram_1.bpmn';

	let currentElement;
	let currentXml;
	let currentModeler;
	let rootElement;

	$: {
	  if (currentModeler) {
	    const canvas = currentModeler.get('canvas');
	
	    rootElement = canvas.getRootElement();
	  }
	}

	const handleSelectionChanged = (element) => {
	  currentElement = element;
	};

	const handleDiagramChanged = async (modeler) => {
	  currentModeler = modeler;

	  handleUpdateXML(modeler);
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
				onDiagramChanged={handleDiagramChanged}
				onDiagramLoaded={handleDiagramChanged}
			/>

			{#if currentElement}
				<Properties 
					element={currentElement}
					modeler={currentModeler}
				/>
			{/if}
		</div>
		<DataPanel
			xml={currentXml}
			{rootElement}
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