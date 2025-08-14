<template>
	<TableCell :is-row-header="false">
		<div v-if="isNotStructured">
			<p class="text-lg-normal">
				{{ citation['rawCitation'] }}
			</p>
		</div>
		<div v-else-if="!props.citation['isRowExpanded'] && !props.allRowsExpanded">
			<p class="text-lg-normal">
				{{ citation['doi'] }} {{ citation['arxiv'] }} {{ citation['handle'] }}
			</p>
			<p class="text-lg-normal">
				{{ citation['title'] }}
			</p>
		</div>
		<div v-else>
			{{ citation }}
		</div>
	</TableCell>
</template>

<script setup>
import TableCell from '@/components/Table/TableCell.vue';
import {computed} from 'vue';

const props = defineProps({
	citation: {type: Object, required: true},
	useStructuredCitations: {type: Boolean, required: true},
	allRowsExpanded: {type: Boolean, required: true},
});

const citation = computed({
	get: () => props.citation,
	set: (newVal) => (props.citation = newVal),
});

const useStructuredCitations = computed({
	get: () => props.useStructuredCitations,
	set: (newVal) => (props.useStructuredCitations = newVal),
});

const allRowsExpanded = computed({
	get: () => props.allRowsExpanded,
	set: (newVal) => (props.allRowsExpanded = newVal),
});

const isRowExpanded = computed({
	get: () => citation.value['isExpanded'],
	set: (newVal) => (citation.value['isExpanded'] = newVal),
});

const isNotStructured = computed(() => {
	return (
		!citation.value['doi'] &&
		!citation.value['arxiv'] &&
		!citation.value['handle'] &&
		!citation.value['title']
	);
});
</script>
