<template>
  <div>
    <main class="container">
      <section class="section">
        <h2>Uh Oh!</h2>
        <p>
          This page does not exists, please click here to
          <nuxt-link to="/">return home</nuxt-link>
        </p>
      </section>
    </main>
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data() {
    return {
      username: this.$store.state.user.name,
    };
  },
  computed: {
    isOpen() {
      return this.$store.getters['modal/active'];
    },
  },
  watch: {
    isOpen(newVal, oldVal) {
      if (newVal) {
        document.querySelector('body').classList.add('isOpen');
      } else {
        document.querySelector('body').classList.remove('isOpen');
      }
    },
  },
  methods: {
    async logout() {
      await this.$axios.get(`${process.env.SERVER_URL}/api/auth/logout`, {
        withCredentials: true,
      });
      this.$store.commit('setUser', {});
      this.$store.commit('setLoggedIn', false);

      this.$router.push('/login');
    },
  },
};
</script>
