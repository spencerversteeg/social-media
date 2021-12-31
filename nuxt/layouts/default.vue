<template>
  <div>
    <!-- nav -->
    <div class="nav__container">
      <nav class="nav">
        <div class="nav__left">
          <nuxt-link to="/">
            <h1>Twitter Clone</h1>
          </nuxt-link>
        </div>
        <div class="nav__right">
          <ul v-if="$store.state.loggedIn">
            <nuxt-link tag="li" :to="`/user/${username}`">Profile</nuxt-link>
            <li @click="logout">Logout</li>
          </ul>

          <ul v-else>
            <nuxt-link tag="li" to="/login">Login</nuxt-link>
            <nuxt-link tag="li" to="/register">Register</nuxt-link>
          </ul>
        </div>
      </nav>
    </div>
    <Nuxt />
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
      await this.$axios.get(`http://localhost:8080/api/auth/logout`, {
        withCredentials: true,
      });
      this.$store.commit('setUser', {});
      this.$store.commit('setLoggedIn', false);

      this.$router.push('/login');
    },
  },
};
</script>

<style lang="scss">
.isOpen {
  overflow: hidden;
}

.nav {
  &__container {
    color: white;
    background-color: rgb(57, 89, 230);
  }

  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  height: 3rem;

  margin: 0 auto;
  max-width: 1200px;

  &__left {
    a {
      color: inherit;
      text-decoration: none;
    }
  }

  &__right {
    ul {
      list-style: none;
      display: flex;
      flex-flow: row nowrap;
      align-items: center;

      li {
        cursor: pointer;
        margin-right: 1.5rem;
        &:last-of-type {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
