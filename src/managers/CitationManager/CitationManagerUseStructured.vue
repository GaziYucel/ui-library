<template>
	<div>
		<div class="pkpFormField__heading pkpFormFieldLabel">
			{{ t('submission.citations.structured') }}
		</div>
		<div class="pkpFormField__description">
			{{ t('submission.citations.structured.description') }}
		</div>
		<div>
			<input
				class="pkpFormField--options__input"
				type="checkbox"
				id="citations-useStructuredCitations"
				@change="useStructuredCitationsChanged()"
				v-model="currentUseStructuredCitations"
			/>
			<label
				for="citations-useStructuredCitations"
				class="pkpFormField--options__optionLabel"
			>
				{{ t('submission.citations.structured.useStructuredCitations') }}
			</label>
		</div>
	</div>
</template>

<script setup>
import {onMounted, ref} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useCitationManagerStore} from './citationManagerStore.js';
import {useModal} from '@/composables/useModal';
import {useDataChanged} from '@/composables/useDataChanged';

const {t} = useLocalize();

const citationStore = useCitationManagerStore();

const {triggerDataChange} = useDataChanged();

function dataUpdateCallback() {
	triggerDataChange();
}

const currentUseStructuredCitations = ref(false);

// todo: save and data changed not working
function useStructuredCitationsChanged() {
	let title = t('submission.citations.structured.disableModal.title');
	let message = t('submission.citations.structured.disableModal.confirm');
	if (currentUseStructuredCitations.value) {
		title = t('submission.citations.structured.enableModal.title');
		message = t('submission.citations.structured.enableModal.confirm');
	}

	const {openDialog} = useModal();
	openDialog({
		name: 'disableUseStructuredCitations',
		title: title,
		message: message,
		actions: [
			{
				label: t('common.yes', {}),
				isWarnable: true,
				callback: async (close) => {
					setUseStructuredCitations();
					dataUpdateCallback();
					close();
				},
			},
			{
				label: t('common.no', {}),
				isPrimary: true,
				callback: (close) => {
					currentUseStructuredCitations.value =
						!currentUseStructuredCitations.value;
					close();
				},
			},
		],
		close: () => {},
	});
}

function setUseStructuredCitations() {
	citationStore.publication.useStructuredCitations =
		currentUseStructuredCitations.value;
}

onMounted(() => {
	if (citationStore.publication.useStructuredCitations === null) {
		currentUseStructuredCitations.value =
			citationStore.publication.useStructuredCitations;
	} else {
		// todo: this value should come from the metadata setting of journal
		currentUseStructuredCitations.value = true;
	}
});
</script>
