// import {useUrl} from '@/composables/useUrl';
// import {useModal} from '@/composables/useModal';
// import {useLocalize} from '@/composables/useLocalize';
// import {useSubmission} from '@/composables/useSubmission';
// import {useFetch} from '@/composables/useFetch';
// import {useForm} from '@/composables/useForm';

export const Actions = {
	CITATION_TOGGLE_ALL_CITATION: 'citationToggleAll',
	CITATION_EDIT_CITATION: 'citationEditCitation',
	CITATION_DELETE_CITATION: 'citationDeleteCitation',
};

export function useCitationManagerActions() {
	// const {openDialog, openSideModal} = useModal();
	// const {t} = useLocalize();
	// function citationEditCitation({citation}, finishedCallback) {
	// 	console.log('useCitationManagerActions.citationEditCitation', citation.id);
	// }
	// function citationDeleteCitation({citation}, finishedCallback) {
	// 	console.log('useCitationManagerActions.citationDeleteCitation', citation.id);
	// }

	return {
		// citationEditCitation,
		// citationDeleteCitation,
	};
}
