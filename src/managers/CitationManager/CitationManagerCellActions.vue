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
import {useLocalize} from '@/composables/useLocalize';
import TableCell from '@/components/Table/TableCell.vue';
import DropdownActions from '@/components/DropdownActions/DropdownActions.vue';
import {useCitationManagerStore} from './citationManagerStore';

const props = defineProps({
	citation: {type: Object, required: true},
});

const {t} = useLocalize();

const citationStore = useCitationManagerStore();

const itemActions = computed(() => citationStore.getItemActions());

function handleAction(actionName, citation) {
	citationStore[actionName]({citation});
}
</script>
