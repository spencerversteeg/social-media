<template>
  <main class="container container--center">
    <section class="form__wrapper">
      <div class="form">
        <div class="form__header">
          <h2>Forgot Password</h2>
          <p v-if="!sent">Send a password reset to your email address.</p>
        </div>
        <div v-if="!sent" class="form__body">
          <form @submit.prevent="sendReset">
            <Input
              id="email"
              v-model="email.value"
              autocomplete="username"
              type="email"
              label="Email"
              :error="email.error"
            />

            <Button type="submit">Send password reset</Button>

            <nuxt-link to="/login">Return to login</nuxt-link>
          </form>
        </div>
        <div v-else class="form__body">
          <p>
            We've send a password reset link to the email address attached to
            your account.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'ResetPage',
  middleware: 'guest',
  data() {
    return {
      sent: false,
      email: {
        value: '',
        error: undefined,
      },
      formError: undefined,
    };
  },
  computed: {
    emailValue() {
      return this.email.value;
    },
  },
  watch: {
    emailValue(newV, oldV) {
      if (this.email.error) {
        this.email.error = undefined;
      }
    },
  },
  methods: {
    async sendReset() {
      try {
        await this.$axios.post(`${process.env.SERVER_URL}/api/auth/reset`, {
          email: this.email.value,
        });

        this.sent = true;
      } catch (error) {
        this.formError = error.response.data.data;

        // Assign the right error to the right input
        const fields = error.response.data.fields;
        if (fields) {
          this.email.error = fields.email.join(' ');
        }

        throw new Error(error);
      }
    },
  },
};
</script>

<style></style>
