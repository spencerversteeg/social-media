<template>
  <main class="container">
    <header>
      <h2>Homepage</h2>
    </header>
    <section class="home">
      <!-- New Post -->
      <form
        class="new-post"
        @submit.prevent="submitPost"
        @keydown.enter="submitPost"
      >
        <textarea v-model="newPost.value" />
        <Button type="submit">Create post</Button>
      </form>
      <!-- Posts -->
      <div class="posts">
        <div v-for="post in posts" :key="post.id">
          <Post :post="post" />
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Button from '@/components/Button';
import Post from '@/components/Post';

export default {
  name: 'IndexPage',
  components: {
    Button,
    Post,
  },
  middleware: 'auth',
  data() {
    return {
      posts: [],
      newPost: {
        value: '',
        error: undefined,
      },
    };
  },
  async mounted() {
    try {
      const { data } = await this.$axios.get(`http://localhost:8080/api/post`, {
        withCredentials: true,
      });
      this.posts = data.data.reverse();
    } catch (error) {}
  },
  methods: {
    async submitPost() {
      try {
        const { data } = await this.$axios.post(
          `http://localhost:8080/api/post`,
          { message: this.newPost.value },
          { withCredentials: true }
        );

        // Fix array sorting
        this.posts.unshift(data.data);

        this.newPost.value = '';
      } catch (error) {
        this.$router.push('/login');
      }
    },
  },
};
</script>

<style lang="scss">
.home {
  .post {
    margin-bottom: 1rem;
  }

  .new-post {
    width: 100%;
    display: flex;
    flex-flow: column nowrap;
    margin-bottom: 2rem;

    textarea {
      border: 1px solid #c9d1d6;
      border-radius: 0.5rem;
      padding: 0.5rem;
      font-family: 'Noto Sans', sans-serif;
      resize: none;
      margin-bottom: 0.5rem;
      outline: none;

      &:focus {
        border-color: #111;
      }
    }
  }
}
</style>
