<template>
  <main class="container container--center">
    <section class="form__wrapper">
      <div class="form">
        <div class="form__header">
          <h2>Success!</h2>
        </div>
        <div class="form__body">
          <p>
            Welcome to Twitter Clone! To continue to login, please click the
            link below.
          </p>
          <nuxt-link to="/login">Login</nuxt-link>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'VerifyPage',
  async mounted() {
    try {
      await this.$axios.get(
        `http://localhost:8080/api/auth/verify/${this.$route.params.token}`
      );
    } catch (error) {
      throw new Error(error);
    }
  },
};
</script>

<style></style>
