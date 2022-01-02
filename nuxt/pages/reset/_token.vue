<template>
  <main class="container container--center">
    <section class="form__wrapper">
      <div class="form">
        <div v-if="!sent" class="form__header">
          <h2>Reset your password</h2>
          <p>Make sure to make your password something memorable and secure.</p>
        </div>
        <div v-else class="form__header">
          <h2>Your password has been changed</h2>
        </div>
        <div v-if="!sent" class="form__body">
          <form @submit.prevent="changePassword">
            <Input
              id="password"
              v-model="form.password.value"
              autocomplete="new-password"
              type="password"
              label="Password"
              :error="form.password.error"
            />
            <Input
              id="confirmPassword"
              v-model="form.confirmPassword.value"
              type="password"
              label="Confirm password"
              :error="form.password.error"
            />

            <Button type="submit">Reset password</Button>
          </form>
        </div>
        <div v-else class="form__body">
          <p>
            Your password has been changed successfully. Please press the link
            below to sign in with your new credentials.
          </p>
          <nuxt-link to="/login">Login</nuxt-link>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Button from '@/components/Button.vue';
import Input from '@/components/Input.vue';

export default {
  name: 'ResetTokenPage',
  components: {
    Button,
    Input,
  },
  middleware: 'guest',
  data() {
    return {
      formError: undefined,
      sent: true,
      form: {
        password: {
          value: '',
          error: undefined,
        },
        confirmPassword: {
          value: '',
          error: undefined,
        },
      },
    };
  },
  computed: {
    passwordValue() {
      return this.form.password.value;
    },
    confirmPasswordValue() {
      return this.form.confirmPassword.value;
    },
  },
  watch: {
    passwordValue(newV, oldV) {
      if (this.form.password.error) {
        this.form.password.error = undefined;
      }
    },
    confirmPasswordValue(newV, oldV) {
      if (this.form.confirmPassword.error) {
        this.form.confirmPassword.error = undefined;
      }
    },
  },
  methods: {
    async changePassword() {
      try {
        await this.$axios.patch(
          `${process.env.SERVER_URL}/api/auth/reset/${this.$route.params.token}`,
          {
            password: this.form.password.value,
            confirmPassword: this.form.confirmPassword.value,
          }
        );

        this.sent = true;
      } catch (error) {
        this.formError = error.response.data.data;

        // Assign the right error to the right input
        const fields = error.response.data.fields;
        if (fields) {
          Object.keys(fields).forEach((field) => {
            this.form[field].error = fields[field].join(' ');
          });
        }

        throw new Error(error);
      }
    },
  },
};
</script>

<style></style>
