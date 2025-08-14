import {useLegacyGridUrl} from '@/composables/useLegacyGridUrl';
import {useUrl} from '@/composables/useUrl';
import {useModal} from '@/composables/useModal';
import {useLocalize} from '@/composables/useLocalize';
import {useSubmission} from '@/composables/useSubmission';
import {useFetch} from '@/composables/useFetch';
import CitationStructuredEditModal from '@/managers/CitationManager/modals/CitationStructuredEditModal.vue';
import {useForm} from '@/composables/useForm';
import cloneDeep from 'clone-deep';
// import {apiUrl} from '@/composables/useForm.mocks';

export const Actions = {
	CITATION_SEARCH_CITATION: 'citationSearch',
	CITATION_TOGGLE_ALL_CITATION: 'citationToggleAll',
	CITATION_TOGGLE_CITATION: 'citationToggleCitation',
	CITATION_EDIT_CITATION: 'citationEditCitation',
	CITATION_DELETE_CITATION: 'citationDeleteCitation',
};

export function useCitationManagerActions() {
	const {openDialog, openSideModal} = useModal();
	const {t} = useLocalize();

	function citationEditCitation({citation, citationStructuredEditForm}, finishedCallback) {
		console.log(
			'useCitationManagerActions.citationEditCitation',
			citation.id,
			citation,
		);

		// const {apiUrl} = useUrl(`citations/get`);
		// const editForm = cloneDeep(citationStructuredEditForm);
		// // editForm.action = `${apiUrl.value}/${citation.id}`;
		// // editForm.method = 'POST';
		// // const {setValues, setAction, setMethod} = useForm(editForm);
		// // setAction(`${apiUrl.value}/${citation.id}`);
		// // setMethod('POST');
		// // setValues(citation);
		// openSideModal(CitationStructuredEditModal, {
		// 	title: t('submission.citations.structured.editModal.title'),
		// 	activeForm: editForm,
		// 	// onUpdateForm: updateForm,
		// 	// onFormSuccess: formSuccess,
		// });

		// const {openLegacyModal} = useLegacyGridUrl({
		// 	component: 'CitationStructuredEditModal',
		// 	op: 'citationEditCitation',
		// 	params: {
		// 		submissionId: submission.id,
		// 		publicationId: publication.id,
		// 		dataCitationId: citation.id,
		// 	},
		// });
		// openLegacyModal({title: t('submission.citations.structured.editModal.title')}, finishedCallback);
		//
		// const editForm = cloneDeep(props.form);
		// const {setValues, setAction, setMethod} = useForm(editForm);
		// setAction(`${apiUrl.value}/${citation.id}`);
		// setMethod('PUT');
		// setValues(citation);
		// openSideModal(
		// 	CitationStructuredEditModal, {
		// 		title: t('submission.citations.structured.editModal.title'),
		// 		activeForm: editForm,
		// 	}
		// );
	}

	function updateForm(formId, data) {
		// if (!this.activeForm) {
		// 	return;
		// }
		//
		// let activeForm = this.activeForm;
		// Object.keys(data).forEach(function (key) {
		// 	activeForm[key] = data[key];
		// });
		// this.activeForm = activeForm;
	}

	function formSuccess(citation) {
		// if (this.activeForm.method === 'POST') {
		// 	this.offset = 0;
		//
		// 	const newContributors = [...this.publication.authors];
		// 	newContributors.push(citation);
		// 	this.$emit('updated:contributors', newContributors);
		// } else {
		// 	const newContributors = this.publication.authors.map((author) => {
		// 		if (author.id === citation.id) {
		// 			return contributor;
		// 		}
		// 		return author;
		// 	});
		// 	this.$emit('updated:contributors', newContributors);
		// }
		// this.closeFormModal();
		//
		// this.getAndUpdatePublication();
	}

	function citationDeleteCitation({citation}, finishedCallback) {
		openDialog({
			name: 'deleteCitation',
			title: t('submission.citations.structured.deleteDialog.title'),
			message: t('submission.citations.structured.deleteDialog.confirm', {}),
			actions: [
				{
					label: t('common.yes'),
					isPrimary: true,
					callback: async (close) => {
						// await deleteCitation(citation.id);
						console.log('deleteCitation', id);
						// const {fetch} = useFetch(`${apiUrl.value}/${id}`, {
						// 	method: 'DELETE',
						// });
						// await fetch();
						await fetchCitations();
						close();
						finishedCallback();
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

	function fetchCitations() {
		console.log('fetchCitations');
	}

	// async function deleteCitation(id) {
	// 	console.log('deleteCitation', id);
	// 	// const {fetch} = useFetch(`${apiUrl.value}/${id}`, {
	// 	// 	method: 'DELETE',
	// 	// });
	// 	//
	// 	// await fetch();
	// }

	return {
		citationEditCitation,
		citationDeleteCitation,
	};
}
