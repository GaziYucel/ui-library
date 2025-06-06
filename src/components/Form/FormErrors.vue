<template>
	<div class="pkpFormErrors">
		<Icon icon="Error" class="h-5 w-5" :inline="true" />
		{{ message }}
		<ul class="-screenReader">
			<li v-for="(error, index) in errorList" :key="index">
				<button @click.prevent="showError(error.fieldName)">
					{{
						t('form.errorA11y', {
							fieldLabel: error.label,
							errorMessage: error.message,
						})
					}}
				</button>
			</li>
		</ul>
		<button class="pkpFormErrors__goTo" @click.prevent="showNextError">
			{{ t('form.errorGoTo') }}
		</button>
	</div>
</template>

<script>
import Icon from '@/components/Icon/Icon.vue';

export default {
	name: 'FormErrors',
	components: {Icon},
	props: {
		errors: Object,
		fields: Array,
	},
	computed: {
		/**
		 * A message indicating how many errors are in the form
		 *
		 * @return {String}
		 */
		message() {
			if (Object.keys(this.errors).length === 1) {
				return this.t('form.errorOne');
			} else {
				return this.t('form.errorMany', {
					count: Object.keys(this.errors).length,
				});
			}
		},

		/**
		 * List of error messages and the field labels they are attached to
		 *
		 * Gets the first locale's error message for multilingual fields. This will
		 * be displayed in a hidden list for screen readers, so they see a list of
		 * all errors and can click to go to them.
		 *
		 * @return {Array}
		 */
		errorList() {
			return Object.keys(this.errors).map((fieldName) => {
				const field = this.fields.find((field) => field.name === fieldName);
				const label = field ? field.label : fieldName;
				let errorMessage;
				if (
					this.errors[fieldName] !== null &&
					typeof this.errors[fieldName] === 'object'
				) {
					errorMessage =
						this.errors[fieldName][Object.keys(this.errors[fieldName])[0]];
				} else {
					errorMessage = this.errors[fieldName];
				}
				return {fieldName: fieldName, label: label, message: errorMessage};
			});
		},
	},
	methods: {
		/**
		 * Emit an event to display the next error in the list
		 */
		showNextError() {
			this.showError(Object.keys(this.errors)[0]);
		},

		/**
		 * Emit an event to display a specific error
		 *
		 * @param {String} fieldName
		 */
		showError: function (fieldName) {
			const error = this.errors[fieldName];
			if (error && typeof error === 'object' && error.constructor === Object) {
				this.$emit('showLocale', Object.keys(error)[0]);
			}
			this.$emit('showField', fieldName);
		},
	},
};
</script>

<style lang="less">
@import '../../styles/_import';

.pkpFormErrors {
	font-size: 0.9rem;
}

.pkpFormErrors__goTo {
	border: none;
	box-shadow: none;
	background: transparent;
	padding: 0;
	font-size: 0.9rem;
	font-weight: @bold;
	color: @no;
	cursor: pointer;

	&:hover,
	&:focus {
		text-decoration: underline;
		outline: 0;
	}
}
</style>
