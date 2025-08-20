<template>
	<CitationManagerUseStructured />
	<CitationManagerAddRawCitations />
	<CitationManagerStatusProcessed />
	<div>
		<a @click="citationStore.citationDeleteAllCitations" class="cursor-pointer">
			{{ t('submission.citations.structured.deleteAllLink') }}
		</a> &nbsp;
		<a @click="extractPids" class="cursor-pointer">extractPids</a> &nbsp;
		<a @click="retrieveStructured" class="cursor-pointer">retrieveStructured</a>
	</div>
	<PkpTable aria-label="Structured References" :aria-describedby="headingId">
		<template #label>
			<h3 class="">
				{{ t('submission.citations.structured') }}
			</h3>
			<span class="text-lg-normal">
				{{ t('submission.citations.structured.descriptionTable') }}
			</span>
		</template>
		<template #top-controls>
			<div class="flex gap-x-2">
				<component
					:is="Components[action.component] || action.component"
					v-bind="action.props || {}"
					v-for="(action, i) in citationStore.topItems"
					:key="i"
				></component>
			</div>
		</template>
		<TableHeader>
			<TableColumn
				v-for="(column, i) in citationStore.columns"
				:key="i"
				:class="i > 0 ? 'w-[3rem]' : ''"
			>
				<span v-if="column.isHeaderComponent">
					<component :is="Components[column.header] || column.header" />
				</span>
				<span v-else :class="column.headerSrOnly ? 'sr-only' : ''">
					{{ column.header }}
				</span>
			</TableColumn>
		</TableHeader>
		<TableBody>
			<TableRow
				v-for="(citation, index) in citationStore.citations"
				:key="citation.id"
			>
				<component
					:is="Components[column.component] || column.component"
					v-for="(column, index) in citationStore.columns"
					:key="index"
					v-bind="citation"
					:citation="citation"
				></component>
			</TableRow>
		</TableBody>
	</PkpTable>
	<!--
	<div>
		<hr />
		publication	<textarea style="border: 1px solid #ccc; height: 100px">{{ props.publication }}</textarea>
		citations <textarea style="border: 1px solid #ccc; height: 100px">{{ citationStore.citations }}</textarea>
		<p>&nbsp;</p>
		<p>&nbsp;</p>
		<p>&nbsp;</p>
	</div>
	-->
</template>

<script setup>
import {useId} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import PkpTable from '@/components/Table/Table.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import CitationManagerCellCitation from '@/managers/CitationManager/CitationManagerCellCitation.vue';
import CitationManagerCellToggle from '@/managers/CitationManager/CitationManagerCellToggle.vue';
import CitationManagerToggleAll from '@/managers/CitationManager/CitationManagerToggleAll.vue';
import CitationManagerCellActions from '@/managers/CitationManager/CitationManagerCellActions.vue';
import CitationManagerSearchField from '@/managers/CitationManager/CitationManagerSearchField.vue';
import CitationManagerStatusProcessed from '@/managers/CitationManager/CitationManagerStatusProcessed.vue';
import CitationManagerAddRawCitations from '@/managers/CitationManager/CitationManagerAddRawCitations.vue';
import CitationManagerUseStructured from '@/managers/CitationManager/CitationManagerUseStructured.vue';
import {useCitationManagerStore} from './citationManagerStore.js';
import {useFetch} from '@/composables/useFetch';

const {t} = useLocalize();
const headingId = useId();

const Components = {
	CitationManagerCellCitation,
	CitationManagerCellToggle,
	CitationManagerToggleAll,
	CitationManagerCellActions,
	CitationManagerSearchField,
};

const props = defineProps({
	submission: {type: Object, required: true},
	publication: {type: Object, required: true},
	canEdit: {type: Boolean, required: true},
	citationStructuredEditForm: {type: Object, required: true},
	citationRawEditForm: {type: Object, required: true},
});

const citationStore = useCitationManagerStore(props);

function extractPids() {
	console.log('extractPids');
	const {fetch} = useFetch(`${citationStore.apiUrlSubmissions}/extractPids`, {
		method: 'GET',
	});
	fetch();
}

function retrieveStructured() {
	console.log('retrieveStructured');
	const {fetch} = useFetch(
		`${citationStore.apiUrlSubmissions}/retrieveStructured`,
		{method: 'GET'},
	);
	fetch();
}
</script>
