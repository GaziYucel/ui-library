<template>
	<Icon
		@click="rowsExpandedChanged"
		:icon="!rowsExpanded ? 'Dropdown' : 'Dropup'"
		:class="'ms-2 inline-block h-auto w-6 cursor-pointer py-2 align-middle'"
		:inline="true"
	/>
</template>

<script setup>
import {useCitationManagerStore} from '@/managers/CitationManager/citationManagerStore';
import Icon from '@/components/Icon/Icon.vue';
import {ref} from 'vue';

const citationStore = useCitationManagerStore();

const rowsExpanded = ref(false);

function rowsExpandedChanged() {
	rowsExpanded.value = !rowsExpanded.value;
	citationStore.citations.forEach((obj) => {
		obj['rowExpanded'] = rowsExpanded.value;
	});
}
</script>
