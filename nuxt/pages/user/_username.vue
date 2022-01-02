<template>
  <div>
    <Modal name="editUser" title="Edit your profile" @click="editUser">
      <form class="edit" @submit.prevent="submitEdits">
        <Input id="name" v-model="form.name.value" label="Name" name="name" />
        <Input
          id="email"
          v-model="form.email.value"
          label="Email address"
          name="email"
        />
        <Button type="submit">Save changes</Button>
      </form>
    </Modal>
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
  </div>
</template>

<script>
import Button from '@/components/Button';
import Input from '@/components/Input';

export default {
  name: 'ProfilePage',
  components: {
    Button,
    Input,
  },
  middleware: 'auth',
  data() {
    return {
      user: null,
      form: {
        name: {
          value: '',
          error: undefined,
        },
        email: {
          value: '',
          error: undefined,
        },
      },
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
      this.$store.commit('modal/open', 'editUser');
    },
    async submitEdits() {
      try {
        const body = {};

        if (this.form.name.value.length > 0) body.name = this.form.name.value;
        if (this.form.email.value.length > 0)
          body.email = this.form.email.value;

        await this.$axios.put(`http://localhost:8080/api/user`, body, {
          withCredentials: true,
        });

        this.$store.commit('modal/close', 'editUser');

        this.$router.push(`/user/${body.name || this.user.name}`);
      } catch (error) {
        throw new Error(error);
      }
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

.edit {
  .tc-input {
    margin-bottom: 1.5rem;
  }
}
</style>
