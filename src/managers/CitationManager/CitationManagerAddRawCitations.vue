<template>
	<div>
		<div class="pkpFormField__heading pkpFormFieldLabel">
			{{ t('submission.citations') }}
		</div>
		<div class="pkpFormField__description">
			{{ t('submission.citations.description') }}
		</div>
		<div>
			<textarea
				class="pkpFormField__input pkpFormField--textarea__input !h-[9em]"
				v-model="citationsRawToBeAdded"
			/>
		</div>
		<div>
			<PkpButton
				class="my-2"
				:is-required="true"
				:disabled="!citationsRawToBeAdded"
				@click="handleAddCitationsRawToList"
			>
				{{ t('common.add', {}) }}
			</PkpButton>
		</div>
	</div>
</template>

<script setup>
import {ref} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useUrl} from '@/composables/useUrl';
import {useFetch} from '@/composables/useFetch';
import PkpButton from '@/components/Button/Button.vue';
import {useCitationManagerStore} from './citationManagerStore.js';
import {useDataChanged} from '@/composables/useDataChanged';

const {t} = useLocalize();

const citationStore = useCitationManagerStore();

const {triggerDataChange} = useDataChanged();

function dataUpdateCallback() {
	triggerDataChange();
}

const citationsRawToBeAdded = ref('');

function handleAddCitationsRawToList() {
	addCitationsRawToList();
}

async function addCitationsRawToList() {
	const {fetch} = useFetch(
		`${citationStore.apiUrlSubmissions}/importAdditionalCitations`,
		{
			method: 'POST',
			body: {rawCitations: citationsRawToBeAdded},
		},
	);
	await fetch();
	dataUpdateCallback();
	citationsRawToBeAdded.value = '';
}
</script>
