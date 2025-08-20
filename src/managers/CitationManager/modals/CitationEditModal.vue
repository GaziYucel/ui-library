<template>
	<SideModalBody>
		<template #title>
			<span>{{ title }}</span>
		</template>
		<div class="citation-edit-modal-container">
			<div class="ml-8 mr-8 h-full bg-secondary">
				<div class="pl-[2rem] pr-[2rem] pt-[2rem]">
					<div class="pkpFormField__heading">
						<span class="pkpFormFieldLabel align-middle">
							{{ t('submission.citations.structured.label.citation') }}
						</span>
					</div>
					<div class="pkpFormField__control text-lg-normal">
						{{ store.citation['rawCitation'] }}
					</div>
				</div>
				<PkpForm
					v-bind="store.form"
					@success="store.formSuccess"
					@set="store.updateForm"
				></PkpForm>
			</div>
		</div>
	</SideModalBody>
</template>

<script setup>
import {useCitationEditModalStore} from './citationEditModalStore';
import {defineProps} from 'vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import PkpForm from '@/components/Form/Form.vue';
import {useLocalize} from '@/composables/useLocalize';

const {t} = useLocalize();

const props = defineProps({
	title: {type: String, required: true},
	form: {type: Object, required: true},
	citation: {type: Number, required: true},
});

const store = useCitationEditModalStore(props);
</script>

<style>
#citation_raw-citationsRaw-control,
#citation_structured-citationsRaw-control {
	height: 4rem;
}
.citation-edit-modal-container fieldset {
	padding-top: 0;
	margin-top: 1.5rem;
}
</style>
