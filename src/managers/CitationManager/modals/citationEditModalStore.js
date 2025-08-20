import {
	defineComponentStore,
	injectFromCurrentInstance,
} from '@/utils/defineComponentStore';
import {useForm} from '@/composables/useForm';
import {computed} from 'vue';

export const useCitationEditModalStore = defineComponentStore(
	'citationEditModalStore',
	(props) => {
		const closeModal = injectFromCurrentInstance('closeModal');

		const {set: updateForm, form} = useForm(props.form);

		const citation = computed({
			get: () => props.citation,
			set: (newVal) => (props.citation = newVal),
		});

		function formSuccess() {
			closeModal();
		}

		return {
			citation,
			form,
			formSuccess,
			updateForm,
		};
	},
);
