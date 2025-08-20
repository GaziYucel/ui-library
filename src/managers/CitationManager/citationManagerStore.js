import {computed, ref, toRefs} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useSubmission} from '@/composables/useSubmission';
import {useDataChanged} from '@/composables/useDataChanged';
import {useExtender} from '@/composables/useExtender';
import {useCitationManagerConfig} from '@/managers/CitationManager/useCitationManagerConfig';
import {useLocalize} from '@/composables/useLocalize';
import {useUrl} from '@/composables/useUrl';
import {useModal} from '@/composables/useModal';
import {useForm} from '@/composables/useForm';
import {useFetch} from '@/composables/useFetch';
import cloneDeep from 'clone-deep';
import CitationEditModal from '@/managers/CitationManager/modals/CitationEditModal.vue';

export const useCitationManagerStore = defineComponentStore(
	'citationManager',
	(props) => {
		const {openDialog, openSideModal} = useModal();
		const {t} = useLocalize();
		const extender = useExtender();
		const {triggerDataChange} = useDataChanged();
		function dataUpdateCallback() {
			triggerDataChange();
		}

		const citationManagerConfig = extender.addFns(useCitationManagerConfig());
		const columns = computed(() => citationManagerConfig.getColumns());
		const topItems = computed(() => citationManagerConfig.getTopItems());
		function getItemPrimaryActions(args) {
			return citationManagerConfig.getItemPrimaryActions(args);
		}
		function getItemActions(args) {
			return citationManagerConfig.getItemActions(args);
		}

		const {submission, publication} = toRefs(props);

		// Determine if a citation is assumed structured, at least one value in every row has to be non-empty.
		const requirementsIsStructured = [
			['doi', 'arxiv', 'handle', 'url', 'urn'],
			['title'],
			['authors'],
		];
		function isCitationStructured(citation) {
			let isStructured = true;
			requirementsIsStructured.forEach((rowSet) => {
				let temp = false;
				rowSet.forEach((item) => {
					if (citation[item]) {
						temp = true;
					}
				});

				if (!temp) {
					isStructured = false;
				}
			});

			return isStructured;
		}

		// api urls
		const {apiUrl: apiUrlCitations} = useUrl(`citations`);
		const {apiUrl: apiUrlSubmissions} = useUrl(
			`submissions/${submission.value.id}/publications/${publication.value.id}/citations`,
		);

		// citations and search phrase filtering
		const citations = computed(() => {
			if (searchPhrase.value) {
				return filterArrayByPhrase(
					props?.publication?.citations,
					searchPhrase.value,
				);
			} else {
				return props?.publication?.citations;
			}
		});
		const searchPhrase = ref('');
		function setSearchPhrase(value) {
			searchPhrase.value = value;
		}
		function containsSearchPhrase(obj, phrase) {
			function deepSearch(value) {
				if (value === null || value === undefined) return false;

				if (typeof value === 'string') {
					return value.toLowerCase().includes(phrase.toLowerCase());
				}

				if (Array.isArray(value)) {
					return value.some(deepSearch);
				}

				if (typeof value === 'object') {
					return Object.values(value).some(deepSearch);
				}

				return false;
			}

			return deepSearch(obj);
		}
		function filterArrayByPhrase(data, phrase) {
			return data.filter((item) => containsSearchPhrase(item, phrase));
		}

		// edit citation // todo: this doesn't work
		function citationEditCitation({citation}) {
			if (props.publication.useStructuredCitations) {
				const {form, setValues, setAction} = useForm(props.citationStructuredEditForm);
				setValues(citation);
				// form['value']['fields'].forEach((field) => {
				// 	if (citation[field['name']]) {
				// 		field['value'] = citation[field['name']];
				// 	}
				// });
				const editForm = cloneDeep(form);
				openSideModal(CitationEditModal, {
					title: t('submission.citations.structured.editModal.title'),
					form: editForm,
					citation: citation,
				});
			} else {
				const {form} = useForm(props.citationRawEditForm);
				const editForm = cloneDeep(form);
				openSideModal(CitationEditModal, {
					title: t('submission.citations.structured.editModal.title'),
					form: editForm,
					citation: citation,
				});
			}
		}

		// delete citation
		function citationDeleteCitation({citation}) {
			openDialog({
				name: 'deleteCitation',
				title: t('submission.citations.structured.deleteDialog.title'),
				message: t('submission.citations.structured.deleteDialog.confirm', {}),
				actions: [
					{
						label: t('common.yes'),
						isPrimary: true,
						callback: async (close) => {
							await citationDeleteCitationExecute(citation.id);
							await dataUpdateCallback();
							close();
						},
					},
					{
						label: t('common.no'),
						isWarnable: true,
						callback: (close) => {
							close();
						},
					},
				],
			});
		}
		async function citationDeleteCitationExecute(citationId) {
			const {apiUrl} = useUrl(`citations`);
			const {fetch} = useFetch(`${apiUrl.value}/${citationId}`, {
				method: 'DELETE',
			});
			await fetch();
		}

		// delete all citations
		function citationDeleteAllCitations() {
			openDialog({
				name: 'deleteCitation',
				title: t('submission.citations.structured.deleteAllDialog.title'),
				message: t(
					'submission.citations.structured.deleteAllDialog.confirm',
					{},
				),
				actions: [
					{
						label: t('common.yes'),
						isPrimary: true,
						callback: async (close) => {
							await citationDeleteAllCitationsExecute();
							await dataUpdateCallback();
							close();
						},
					},
					{
						label: t('common.no'),
						isWarnable: true,
						callback: (close) => {
							close();
						},
					},
				],
			});
		}
		async function citationDeleteAllCitationsExecute() {
			const {fetch} = useFetch(
				`${apiUrlSubmissions.value}/deleteCitationsByPublicationId`,
				{method: 'DELETE'},
			);
			await fetch();
		}

		return {
			columns,
			topItems,
			getItemPrimaryActions,
			getItemActions,

			citationDeleteAllCitations,
			// citationEditCitation,
			// citationDeleteCitation,

			submission,
			publication,
			citations,

			apiUrlCitations,
			apiUrlSubmissions,
			searchPhrase,
			setSearchPhrase,
			isCitationStructured,
		};
	},
);
