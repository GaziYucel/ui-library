<template>
	<TableCell :is-row-header="false">
		<span class="text-base-normal">
			<Icon
				v-if="showToggle"
				@click="rowExpandedChanged"
				:icon="!props.citation['rowExpanded'] ? 'Dropdown' : 'Dropup'"
				:class="'ms-2 inline-block h-auto w-6 cursor-pointer py-2 align-middle'"
				:inline="true"
			/>
		</span>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import Icon from '@/components/Icon/Icon.vue';
import {useCitationManagerStore} from '@/managers/CitationManager/citationManagerStore';
import {computed} from 'vue';

const props = defineProps({
	citation: {type: Object, required: true},
});

const citationStore = useCitationManagerStore();

const showToggle = computed(() => {
	return citationStore.isCitationStructured(props.citation);
});

function rowExpandedChanged() {
	if (!props.citation['rowExpanded']) {
		props.citation['rowExpanded'] = false;
	}
	props.citation['rowExpanded'] = !props.citation['rowExpanded'];
}
</script>
