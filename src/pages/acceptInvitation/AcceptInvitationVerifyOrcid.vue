<template>
	<div class="p-8">
		<div class="m-4">
			<PkpButton @click="verifyOrcid">
				{{ t('acceptInvitation.verifyOrcid') }}
			</PkpButton>
		</div>
		<div class="m-4">
			<PkpButton @click="skipOrcid">
				{{ t('acceptInvitation.skipVerifyOrcid') }}
			</PkpButton>
		</div>
	</div>
</template>

<script setup>
import PkpButton from '@/components/Button/Button.vue';
import {defineProps} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import {useAcceptInvitationPageStore} from './AcceptInvitationPageStore';

defineProps({});
const store = useAcceptInvitationPageStore();
const {t} = useLocalize();

/**
 * Go to the next step
 */
function skipOrcid() {
	delete store.acceptInvitationPayload.userOrcid;
	store.openStep(store.steps[1 + store.currentStepIndex].id);
}

function verifyOrcid() {
	store.openStep(store.steps[1 + store.currentStepIndex].id);
}
</script>
