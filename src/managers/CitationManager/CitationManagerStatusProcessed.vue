<template>
	<div>
		<span class="flex items-center py-[0.5rem]">
			<Icon
				:icon="processed === total ? 'Complete' : 'InProgress'"
				:class="'inline-block h-auto w-12 align-middle'"
				:inline="true"
			/>
			<span class="align-middle">
				<span class="font-semibold">
					{{
						processed === total
							? t('submission.citations.structured.processed.title', {
									total: total,
								})
							: t('submission.citations.structured.processing.title', {
									processed: processed,
									total: total,
								})
					}}
				</span>
				<br />
				<span>
					{{
						processed === total
							? t('submission.citations.structured.processed.description')
							: t('submission.citations.structured.processing.description')
					}}
				</span>
			</span>
		</span>
	</div>
</template>

<script setup>
import {computed} from 'vue';
import {useLocalize} from '@/composables/useLocalize';
import Icon from '@/components/Icon/Icon.vue';
import {useCitationManagerStore} from './citationManagerStore.js';

const {t} = useLocalize();

const citationStore = useCitationManagerStore();

const total = computed(() => {
	return citationStore.citations ? citationStore.citations.length : 0;
});

const processed = computed(() => {
	return Object.entries(citationStore.citations)
		.filter(([key, value]) => value['isProcessed'] === true)
		.map(([key, value]) => ({item: key, c: value})).length;
});
</script>
