<template>
	<TableCell>
		<DropdownActions
			:label="t('common.moreActions')"
			button-variant="ellipsis"
			:actions="itemActions"
			@action="(actionName) => handleAction(actionName, props.citation)"
		/>
	</TableCell>
</template>

<script setup>
import {computed} from 'vue';
import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useLocalize} from '@/composables/useLocalize';
import {useCitationManagerStore} from './citationManagerStore';

const props = defineProps({
	citation: {type: Object, required: true},
	useStructuredCitations: {type: Boolean, required: true},
	allRowsExpanded: {type: Boolean, required: true},
});

const {t} = useLocalize();

const citationManagerStore = useCitationManagerStore();

const itemActions = computed(() => citationManagerStore.getItemActions());

function handleAction(actionName, citation) {
	citationManagerStore[actionName]({citation});
}
</script>
