<template>
  <main class="container">
    <div v-if="!user">Loading...</div>
    <div v-else class="profile">
      <div class="profile__top">
        <div class="profile__info">
          <h2>@{{ user.name }}</h2>
          <p>{{ user.followers }} followers</p>
          <span>&bullet;</span>
          <p>{{ user.following }} following</p>
        </div>
        <div
          v-if="$store.state.user.id === user.id"
          class="profile__follow"
          @click="editUser"
        >
          <Button variant="secondary">Edit profile</Button>
        </div>
        <div v-else class="profile__follow" @click="followUser">
          <Button v-if="user.followed" variant="secondary">Unfollow</Button>
          <Button v-else>Follow</Button>
        </div>
      </div>
      <div class="profile__posts">
        <Post v-for="post in user.Post" :key="post.id" :post="post" />
      </div>
      <pre>{{ JSON.stringify(user, 0, 2) }}</pre>
    </div>
  </main>
</template>

<script>
import Button from '@/components/Button';

export default {
  name: 'ProfilePage',
  components: {
    Button,
  },
  middleware: 'auth',
  data() {
    return {
      user: null,
    };
  },
  async mounted() {
    try {
      const { data } = await this.$axios.get(
        `http://localhost:8080/api/user/${this.$route.params.username}`,
        { withCredentials: true }
      );

      this.user = data.data;
    } catch (error) {
      throw new Error(error);
    }
  },
  methods: {
    // TODO: Setup following/not following
    // TODO: Fix "liked" posts
    // TODO: Update profile
    async followUser() {
      try {
        const { data } = await this.$axios.get(
          `http://localhost:8080/api/user/${this.$route.params.username}/follow`,
          { withCredentials: true }
        );

        this.user = { ...this.user, ...data.data };
        this.user.followed = !this.user.followed;
      } catch (error) {
        throw new Error(error);
      }
    },
    editUser() {
      console.log('add editing state');
    },
    submitEdits() {
      console.log('SUBMIT');
    },
  },
};
</script>

<style lang="scss">
.profile {
  &__top {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;
  }

  &__info {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;

    h2 {
      margin-right: 1rem;
    }

    p {
      &:first-of-type {
        margin-right: 0.5rem;
      }
    }

    span {
      margin-right: 0.5rem;
    }
  }

  .post {
    margin-bottom: 1rem;
  }
}
</style>
