<template>
  <main class="container container--center">
    <section class="form__wrapper">
      <div class="form">
        <div class="form__header">
          <h2>Sign in</h2>
          <p>Welcome back to Social Media</p>
        </div>
        <div class="form__body">
          <form @submit.prevent="loginUser">
            <Input
              id="email"
              v-model="login.email.value"
              autocomplete="username"
              type="email"
              label="Email"
              :error="login.email.error"
            />
            <Input
              id="password"
              v-model="login.password.value"
              autocomplete="current-password"
              type="password"
              label="Password"
              :error="login.password.error"
            />

            <Button type="submit">Sign in</Button>

            <nuxt-link to="/reset">Forgot password?</nuxt-link>
          </form>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Button from '@/components/Button.vue';
import Input from '@/components/Input.vue';

export default {
  name: 'LoginPage',
  components: {
    Button,
    Input,
  },
  middleware: 'guest',
  data() {
    return {
      login: {
        formError: undefined,
        email: {
          value: '',
          error: undefined,
        },
        password: {
          value: '',
          error: undefined,
        },
      },
    };
  },
  computed: {
    emailValue() {
      return this.login.email.value;
    },
    passwordValue() {
      return this.login.password.value;
    },
  },
  watch: {
    emailValue(newV, oldV) {
      if (this.login.email.error) {
        this.login.email.error = undefined;
      }
    },
    passwordValue(newV, oldV) {
      if (this.login.password.error) {
        this.login.password.error = undefined;
      }
    },
  },
  methods: {
    async loginUser() {
      try {
        const { data } = await this.$axios.post(
          `${process.env.SERVER_URL}/api/auth/login`,
          {
            email: this.login.email.value,
            password: this.login.password.value,
          },
          { withCredentials: true }
        );

        this.$store.commit('setUser', data.data);
        this.$store.commit('setLoggedIn', true);
        this.$router.push('/');
      } catch (error) {
        this.formError = error.response.data.data;

        // Assign the right error to the right input
        const fields = error.response.data.fields;
        if (fields) {
          Object.keys(fields).forEach((field) => {
            this.login[field].error = fields[field].join(' ');
          });
        }
      }
    },
  },
};
</script>

<style></style>
