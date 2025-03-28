<template>
	<div v-if="$parent.fields[1].value" :id="`${props.formId}-${props.name}`" class="pkpFormField pkpFormField--citations">
		<div class="pkpFormField__control pkpFormField--citations__control">
			<div
				v-if="props.description"
				v-strip-unsafe-html="props.description"
				class="pkpFormField__description"
			/>
			<div class="py-4">
				<PkpTable aria-label="Citations">
				<TableHeader>
					<TableColumn id="">Parsed Citations</TableColumn>
					<TableColumn id="" class="w-[100px]">Edit Citation</TableColumn>
					<TableColumn id="" class="w-[100px]">
						<a @click="toggleAllExpanded()" v-if="!allExpanded" class="cursor-pointer">{{ t('submission.citations.structured.expandAll', []) }}</a>
						<a @click="toggleAllExpanded()" v-if="allExpanded" class="cursor-pointer">{{ t('submission.citations.structured.collapseAll', []) }}</a>
					</TableColumn>
				</TableHeader>
				<TableBody>
					<TableRow v-for="(citation, citationIndex) in currentValue" :key="citationIndex">
						<TableCell>
							<div>
								<div class="text-lg-normal">
									<a v-if="citation.doi" class="text-lg-normal" :href="citation.doi" target="_blank">{{ citation.doi.replace('https://doi.org/', '') }}</a>
									<a v-if="citation.url" class="text-lg-normal" :href="citation.url" target="_blank">{{ citation.url }}</a>
									<a v-if="citation.arxiv" class="text-lg-normal" :href="citation.arxiv" target="_blank">{{ citation.arxiv }}</a>
									<a v-if="citation.handle" class="text-lg-normal" :href="citation.handle" target="_blank">{{ citation.handle }}</a>
									<span v-if="citation.urn">urn: {{ citation.urn }}</span>
								</div>
								<div>{{ citation.title }}</div>
								<div v-if="!citation.doi && !citation.url && !citation.urn && !citation.arxiv && !citation.handle && !citation.title">{{ citation.rawCitation }}</div>
							</div>
							<div v-if="citation.isExpanded || allExpanded">
								<div>
									<span v-for="(author, authorIndex) in citation.authors">
										<span class="text-lg-normal">{{ author.familyName }} {{ author.givenName }}</span>
										<a v-if="author.orcid" :href="author.orcid" target="_blank">
											<Icon icon="Orcid" :class="'inline-block h-auto align-middle relative w-[16px] top-[-2px]'" :inline="true"/>
										</a>
									</span>
								</div>
								<div v-if="citation.sourceName">{{ citation.sourceName }}</div>
								<div>
									<span v-if="citation.date">Date: {{ citation.date }}</span>
									<span v-if="citation.volume">Volume: {{ citation.volume }}</span>
									<span v-if="citation.issue">Issue number: {{ citation.issue }}</span>
									<span v-if="citation.firstPage && citation.lastPage">Pages: {{ citation.firstPage }} - {{ citation.lastPage }}</span>
								</div>
								<div class="w-fit p-1">{{ citation.rawCitation }}</div>
							</div>
						</TableCell>
						<TableCell class="align-top">
							<a class="pkpButton flex cursor-pointer items-center border-transparent py-2 text-lg-semibold text-primary hover:enabled:underline" @click="toggleEditMode(citationIndex)">
								<Icon icon="Edit" :class="'ms-2 inline-block h-auto w-6 align-middle'" :inline="true"/>{{ t('common.edit', []) }}
							</a>
						</TableCell>
						<TableCell class="align-top">
							<Icon @click="toggleMoreInfoMode(citationIndex)" :icon="!citation.isExpanded
							? 'Dropdown' : 'Dropup'" :class="'ms-2 inline-block h-auto w-6 cursor-pointer py-2 align-middle'" :inline="true"/>
						</TableCell>
					</TableRow>
				</TableBody>
			</PkpTable>
			</div>
		</div>
	</div>
</template>

<script setup>
import {ref, computed, onMounted, watch, onBeforeUnmount} from 'vue';
import {t} from '@/utils/i18n';
import PkpTable from '@/components/Table/Table.vue';
import TableHeader from '@/components/Table/TableHeader.vue';
import TableBody from '@/components/Table/TableBody.vue';
import TableRow from '@/components/Table/TableRow.vue';
import TableColumn from '@/components/Table/TableColumn.vue';
import TableCell from '@/components/Table/TableCell.vue';
import Icon from '@/components/Icon/Icon.vue';

const props = defineProps({
	/** Field key used for form submission */
	name: {
		type: String,
		default: null,
	},
	/** The ID of the form this field should appear in. This is passed down from the `Form`.  */
	formId: {
		type: String,
		default: null,
	},
	/** The `<label>` for this field. May be used in a `<fieldset>` when appropriate. All form fields should have an accessible label. */
	label: {
		type: String,
		default: null,
	},
	/** Adds a description to the field. Can include HTML code. */
	description: {
		type: String,
		default: null,
	},
	/** Current value of the field */
	value: {
		type: Array,
		default: () => [],
	},
	/** Default locale of the form */
	primaryLocale: {
		type: String,
		default: 'en',
	},
	/** List of supported locales */
	locales: {
		type: Array,
		default: () => [],
	},
	/** Object containing all form errors */
	allErrors: {
		type: Object,
		default() {
			return {};
		},
	},
});
const emit = defineEmits(['change', 'set-errors']);
const primaryLocale = props.primaryLocale;
const locales = props.locales;
const currentValue = computed({
	get: () => props.value,
	set: (newVal) => emit('change', props.name, 'value', newVal),
});
const supportedLocales = props.locales.map((language) => language.key);
const citationsRaw = ref(
	'Hauschke C, Cartellieri S, Heller L (2018) Reference implementation for open scientometric indicators (ROSI). Research Ideas and Outcomes 4\n' +
		'Björk BC, Shen C, Laakso M (2016) A longitudinal study of independent scholar-published open access journals. PeerJ 4 https://doi.org/10.7717/peerj.1990\n' +
		'Heibi I, Peroni S, Shotton D (2019b) Crowdsourcing open citations with CROCI. An analysis of the current status of open citations, and a proposal. URL: https://arxiv.org/abs/1902.02534\n' +
		'Brown J (2019) Crossref grant IDs: a global, open database of funding information and identifiers. Autumn 2019 euroCRIS Strategic Membership Meeting. Strategic Membership Meeting 2019 – Autumn, Münster, Nov 18-20, 2019. euroCRIS, 33 pp. URL: http://hdl.handle.net/11366/1249\n' +
		'Bundesministerium für Bildung und Forschung (2020) Richtlinie. URL: https://www.bildung-forschung.digital/files/BAnz%20AT%2017.06.2020%20B3-1.pdf\n',
);
const allExpanded = ref(false);
const errors = computed(() => {
	if (!Object.keys(props.allErrors).includes(props.name)) {
		return [];
	}
	return props.allErrors[props.name];
});

function toggleEditMode(index) {
	alert('toggleEditMode clicked');
}

function toggleAllExpanded(){
	allExpanded.value = !allExpanded.value;
}

function toggleMoreInfoMode(index) {
	if(!currentValue.value[index]['isExpanded']) {
		currentValue.value[index]['isExpanded'] = false;
	}
	currentValue.value[index]['isExpanded'] = !currentValue.value[index]['isExpanded'];
}

onBeforeUnmount(() => {
	emit('set-errors', props.name, []);
});
</script>
