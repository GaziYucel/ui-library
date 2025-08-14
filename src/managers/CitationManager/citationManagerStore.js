import {computed, ref} from 'vue';
import {defineComponentStore} from '@/utils/defineComponentStore';
import {useSubmission} from '@/composables/useSubmission';
import {useDataChanged} from '@/composables/useDataChanged';
import {useExtender} from '@/composables/useExtender';
import {useCitationManagerConfig} from '@/managers/CitationManager/useCitationManagerConfig';
import {useLocalize} from '@/composables/useLocalize';
import {useUrl} from '@/composables/useUrl';
import {useModal} from '@/composables/useModal';
import {useForm} from '@/composables/useForm';
import {useCitationManagerActions} from './useCitationManagerActions';
import CitationStructuredEditModal from '@/managers/CitationManager/modals/CitationStructuredEditModal.vue';
import cloneDeep from 'clone-deep';

export const useCitationManagerStore = defineComponentStore(
	'citationManager',
	(props) => {
		console.log(props);
		const {apiUrl} = useUrl(
			`submissions/${props.submission.id}/publications/__publicationId__`,
		);
		const {openDialog, openSideModal} = useModal();
		const {t, localize} = useLocalize();

		const {getCurrentPublication} = useSubmission();
		const extender = useExtender();
		const {triggerDataChange} = useDataChanged();

		const citationManagerConfig = extender.addFns(useCitationManagerConfig());

		const submission = computed({
			get: () => props.submission,
			set: (newVal) => (props.submission = newVal),
		});
		const publication = computed({
			get: () => props.publication,
			set: (newVal) => (props.publication = newVal),
		});
		const canEdit = computed({
			get: () => props.canEdit,
			set: (newVal) => (props.canEdit = newVal),
		});
		const citationStructuredEditForm = computed({
			get: () => props.citationStructuredEditForm,
			set: (newVal) => (props.citationStructuredEditForm = newVal),
		});

		const useStructuredCitations = computed({
			get: () => props.publication.useStructuredCitations,
			set: (newVal) => (props.publication.useStructuredCitations = newVal),
		});
		const citations = computed({
			get: () => props.publication.citations,
			set: (newVal) => (props.publication.citations = newVal),
		});
		const citationsRaw = computed({
			get: () => props.publication.citationsRaw,
			set: (newVal) => (props.publication.citationsRaw = newVal),
		});

		const isAllRowsExpanded = ref(false);
		const citationsRawToBeAdded = ref('');

		const columns = computed(() => citationManagerConfig.getColumns());

		const topItems = computed(() => citationManagerConfig.getTopItems());

		function getItemPrimaryActions(args) {
			return citationManagerConfig.getItemPrimaryActions(args);
		}

		function getItemActions(args) {
			return citationManagerConfig.getItemActions(args);
		}

		/** Actions */
		const citationManagerActions = useCitationManagerActions();

		function dataUpdateCallback() {
			triggerDataChange();
		}

		function toggleAllExpanded() {
			isAllRowsExpanded.value = !isAllRowsExpanded.value;
		}

		function updateUseStructuredCitations() {
			if (!useStructuredCitations.value) {
				const {openDialog} = useModal();
				openDialog({
					name: 'disableUseStructuredCitations',
					title: t('submission.citations.structured.disableModal.title', {}),
					message: t(
						'submission.citations.structured.disableModal.confirm',
						{},
					),
					actions: [
						{
							label: t('common.yes', {}),
							isWarnable: true,
							callback: async (close) => {
								// dataUpdateCallback(); // todo: not working
								close();
							},
						},
						{
							label: t('common.no', {}),
							isPrimary: true,
							callback: (close) => {
								useStructuredCitations.value = true;
								close();
							},
						},
					],
					close: () => {},
				});
			} else {
				// dataUpdateCallback(); // todo: not working
			}
		}

		function handleAddCitationsRawToList() {
			// split rows by EOL
			// add to citationStore.citations
			// save new lines to database
			citationsRawToBeAdded.value = '';
			console.log(citationsRawToBeAdded.value);
		}

		// function openCitationFormModal(title, form) {
		// 	let component = CitationRawEditModal;
		// 	if (useStructuredCitations) {
		// 		component = CitationStructuredEditModal;
		// 	}
		// 	openSideModal(
		// 		component,
		// 		{
		// 			title,
		// 			formProps: form,
		// 		},
		// 		{
		// 			onClose: async () => {
		// 				await fetchRecommendations();
		// 			},
		// 		},
		// 	);
		// }

		function citationEditCitation({citation}) {
			// citationManagerActions.citationEditCitation(
			// 	{citation, editForm},
			// 	dataUpdateCallback,
			// );

			const {form} = useForm(props.citationStructuredEditForm);
			const {apiUrl} = useUrl(`citations/get`);
			const editForm = cloneDeep(form);
			console.log(editForm);
			// editForm.action = `${apiUrl.value}/${citation.id}`;
			// editForm.method = 'POST';
			// const {setValues, setAction, setMethod} = useForm(editForm);
			// setAction(`${apiUrl.value}/${citation.id}`);
			// setMethod('POST');
			// setValues(citation);
			openSideModal(CitationStructuredEditModal, {
				title: t('submission.citations.structured.editModal.title'),
				description: t('submission.citations.structured.editModal.description'),
				form: editForm,
				citation: citation,
				// onUpdateForm: updateForm,
				// onFormSuccess: formSuccess,
			});
		}

		function citationDeleteCitation({submission, publication, citation}) {
			citationManagerActions.citationDeleteCitation(
				{submission, publication, citation},
				dataUpdateCallback,
			);
		}

		return {
			/** Variables */
			useStructuredCitations,
			citations,
			citationsRaw,
			isAllRowsExpanded,
			citationsRawToBeAdded,

			/** Config */
			columns,
			topItems,
			getItemPrimaryActions,
			getItemActions,

			/** Actions */
			citationEditCitation,
			citationDeleteCitation,

			/** Extender */
			extender,
			props,

			/** Functions */
			updateUseStructuredCitations,
			handleAddCitationsRawToList,
			toggleAllExpanded,
		};
	},
);
