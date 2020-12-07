<script>
	import Diagram from './components/Diagram.svelte';

	import startDiagram from './resources/diagram_1.bpmn';
</script>

<main>
	<Diagram xml={startDiagram} />
</main>

<style type="text/scss">
	main {
		height: 100%;
    width: 100%;
		margin: 0 auto;
	}
</style>