<template>
  <main class="container container--center">
    <section class="form__wrapper">
      <div class="form">
        <div v-if="!sent" class="form__header">
          <h2>Create an account</h2>
          <p>Welcome to Social Media</p>
        </div>
        <div v-else class="form__header">
          <h2>Account created</h2>
        </div>
        <div v-if="!sent" class="form__body">
          <form @submit.prevent="registerUser">
            <Input
              id="name"
              v-model="register.name.value"
              autocomplete="nickname"
              type="text"
              label="Name"
              :error="register.name.error"
            />
            <Input
              id="email"
              v-model="register.email.value"
              autocomplete="username"
              type="email"
              label="Email"
              :error="register.email.error"
            />
            <Input
              id="password"
              v-model="register.password.value"
              autocomplete="new-password"
              type="password"
              label="Password"
              :error="register.password.error"
            />
            <Input
              id="confirmPassword"
              v-model="register.confirmPassword.value"
              type="password"
              label="Confirm password"
              :error="register.password.error"
            />

            <Button type="submit">Sign in</Button>

            <nuxt-link to="/login">Already have an account?</nuxt-link>
          </form>
        </div>
        <div v-else class="form__body">
          <p>
            Your account has been created. Please check the email address you
            provided to verify your account.
          </p>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Button from '@/components/Button.vue';
import Input from '@/components/Input.vue';

export default {
  name: 'RegisterPage',
  components: {
    Button,
    Input,
  },
  middleware: 'guest',
  data() {
    return {
      sent: false,
      formError: undefined,
      register: {
        name: {
          value: '',
          error: undefined,
        },
        email: {
          value: '',
          error: undefined,
        },
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
    nameValue() {
      return this.register.name.value;
    },
    emailValue() {
      return this.register.email.value;
    },
    passwordValue() {
      return this.register.password.value;
    },
    confirmPasswordValue() {
      return this.register.confirmPassword.value;
    },
  },
  watch: {
    nameValue(newV, oldV) {
      if (this.register.name.error) {
        this.register.name.error = undefined;
      }
    },
    emailValue(newV, oldV) {
      if (this.register.email.error) {
        this.register.email.error = undefined;
      }
    },
    passwordValue(newV, oldV) {
      if (this.register.password.error) {
        this.register.password.error = undefined;
      }
    },
    confirmPasswordValue(newV, oldV) {
      if (this.register.confirmPassword.error) {
        this.register.confirmPassword.error = undefined;
      }
    },
  },
  methods: {
    async registerUser() {
      try {
        await this.$axios.post(
          `${process.env.SERVER_URL}/api/auth/register`,
          {
            name: this.register.name.value,
            email: this.register.email.value,
            password: this.register.password.value,
            confirmPassword: this.register.confirmPassword.value,
          },
          { withCredentials: true }
        );

        this.sent = true;
      } catch (error) {
        this.formError = error.response.data.data;

        // Assign the right error to the right input
        const fields = error.response.data.fields;
        if (fields) {
          Object.keys(fields).forEach((field) => {
            this.register[field].error = fields[field].join(' ');
          });
        }

        throw new Error(error);
      }
    },
  },
};
</script>

<style></style>
