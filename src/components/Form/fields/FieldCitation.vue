<template>
	<div>
		{{ currentValue.doi }}
		{{ currentValue.url }}
		{{ currentValue.urn }}
		{{ currentValue.arxiv }}
		{{ currentValue.handle }}
	</div>
	<div v-if="currentValue.title">
		{{ currentValue.title }}
		<FieldText
			:label="'title'"
			:value="currentValue.title"
			name="name"
			:all-errors="{
				name: errors?.[affiliationIndex]?.name?.[affiliationNameLocale],
			}"
			size="large"
			:is-required="affiliationNameLocale === primaryLocale"
			@change="
				(fieldName, _, fieldValue) => {
					updateAffiliationName(
						affiliationIndex,
						affiliationNameLocale,
						fieldValue,
					);
				}
			"
		/>
	</div>
	<div>
		<span v-for="(author, authorIndex) in currentValue.authors">
			{{ author.familyName }} {{ author.givenName }}
			<a v-if="author.orcid" :href="author.orcid">
				<Icon
					icon="Orcid"
					:class="'ms-2 inline-block h-auto w-6 align-middle'"
					:inline="true"
				/>
			</a>
		</span>
	</div>
	<div v-if="currentValue.sourceName">
		{{ currentValue.sourceName }}
	</div>
	<div>
		<span v-if="currentValue.date">Date: {{ currentValue.date }}</span>
		<span v-if="currentValue.volume">Volume: {{ currentValue.volume }}</span>
		<span v-if="currentValue.issue">
			Issue number: {{ currentValue.issue }}
		</span>
		<span v-if="currentValue.firstPage && currentValue.lastPage">
			Pages: {{ currentValue.firstPage }} - {{ currentValue.lastPage }}
		</span>
	</div>
	<div class="w-fit border p-1">
		{{ currentValue.rawCitation }}
	</div>
	<div v-if="props.editMode">-- FieldCitation -- editMode --</div>
	<div v-if="props.moreInfoMode">-- FieldCitation -- moreInfoMode --</div>
</template>

<script setup>
import {computed} from 'vue';
import Icon from '@/components/Icon/Icon.vue';
import FieldText from '@/components/Form/fields/FieldText.vue';

const props = defineProps({
	/** Field key used for form submission */
	name: {
		type: String,
		default: null,
	},
	/** Current value of the field */
	value: {
		type: Object,
		default: () => {},
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
	editMode: {
		type: Boolean,
		default: () => false,
	},
	moreInfoMode: {
		type: Boolean,
		default: () => false,
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
</script>
