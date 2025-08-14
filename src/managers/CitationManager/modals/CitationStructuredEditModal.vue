<template>
	<SideModalBody>
		<template #title>
			<span>{{ title }}</span>
		</template>
		<div class="ml-8 mr-8 h-full bg-secondary">
			<PkpForm
				v-bind="store.form"
				@success="store.formSuccess"
				@set="store.updateForm"
			></PkpForm>
		</div>
	</SideModalBody>
</template>

<script setup>
import {useCitationStructuredEditModalStore} from './useCitationStructuredEditModalStore';
import {defineProps} from 'vue';
import SideModalBody from '@/components/Modal/SideModalBody.vue';
import PkpForm from '@/components/Form/Form.vue';

const props = defineProps({
	title: {type: String, required: true},
	form: {type: Object, required: true},
	citation: {type: Number, required: true},
});

const store = useCitationStructuredEditModalStore(props);
</script>
