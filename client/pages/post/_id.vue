<template>
  <main class="container">
    <header>
      <h2><span @click="$router.back()">&larr;</span>Post</h2>
    </header>
    <section v-if="!loading">
      <div class="fs-post">
        <p class="fs-post__author">
          <nuxt-link tag="span" :to="`/user/${post.user.name}`"
            >@{{ post.user.name || undefined }}</nuxt-link
          >
          &bullet;
          {{ $moment(post.createdAt).fromNow() }}
        </p>
        <p class="fs-post__message">{{ post.message }}</p>
        <div class="fs-post__actions">
          <div class="post__action post__action--like" @click="like">
            <p>
              <Icon v-if="post.liked" name="heart" class="liked" />
              <Icon v-else name="heart-outline" />
              {{ post._count.Like }}
            </p>
          </div>
          <div
            class="fs-post__action fs-post__action--comment"
            @click="
              () => {
                showNewComment = !showNewComment;
              }
            "
          >
            <Icon name="comment-outline" />
          </div>
        </div>
        <div class="fs-post__comments">
          <form
            v-if="showNewComment"
            class="fs-post__new-comment"
            @submit.prevent="postComment"
          >
            <textarea
              id="new-comment"
              v-model="newComment.value"
              name="new-comment"
              cols="30"
              rows="4"
            ></textarea>
            <Button>Post comment</Button>
          </form>
          <div
            v-for="comment in post.Comment"
            :key="comment.id"
            class="comment"
          >
            <p class="comment__author">
              <nuxt-link tag="span" :to="`/user/${comment.user.name || ''}`"
                >@{{ comment.user.name || '' }}</nuxt-link
              >
              &bullet;
              {{ $moment(comment.createdAt).fromNow() }}
              <span v-if="comment.owner"
                >&bullet;
                <span @click="deleteComment(comment.id)">delete</span></span
              >
            </p>
            <p>{{ comment.message }}</p>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import Button from '@/components/Button';

export default {
  name: 'PostPage',
  components: {
    Button,
  },
  middleware: 'auth',
  data() {
    return {
      loading: true,
      post: null,
      showNewComment: false,
      newComment: {
        value: '',
        error: null,
      },
    };
  },
  computed: {
    postId() {
      return this.$route.params.id;
    },
  },
  async mounted() {
    try {
      const { data } = await this.$axios.get(
        `${process.env.SERVER_URL}/api/post/${this.postId}`,
        {
          withCredentials: true,
        }
      );
      this.post = data.data;
      this.post.Comment.reverse();
      this.loading = false;
    } catch (error) {
      throw new Error(error);
    }
  },
  methods: {
    async postComment() {
      try {
        const { data } = await this.$axios.post(
          `${process.env.SERVER_URL}/api/post/${this.postId}/comment`,
          { message: this.newComment.value },
          { withCredentials: true }
        );

        this.post.Comment.unshift(data.data);
        this.newComment.value = '';
      } catch (error) {
        throw new Error(error);
      }
    },
    async deleteComment(commentId) {
      try {
        const { data } = await this.$axios.delete(
          `${process.env.SERVER_URL}/api/post/${this.postId}/comment/${commentId}`,
          { withCredentials: true }
        );

        this.post.Comment = data.data;
      } catch (error) {
        throw new Error(error);
      }
    },
    async like() {
      try {
        if (!this.post.id) {
          throw new Error('Missing ID');
        }
        const newLike = await this.$axios.post(
          `${process.env.SERVER_URL}/api/post/${this.post.id}/like`,
          {},
          {
            withCredentials: true,
          }
        );

        this.post = newLike.data.data;
        this.post.Comment.reverse();
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
</script>

<style lang="scss">
.container {
  header span {
    cursor: pointer;
    margin-right: 0.5rem;
  }
}

.fs-post {
  padding: 0.5rem 1.5rem;

  border: 1px solid #c9d1d6;
  border-radius: 0.5rem;

  &__author {
    font-size: 0.75rem;
    margin-top: 0;
    margin-bottom: 1.5rem;

    span {
      &:hover {
        text-decoration: underline;
      }
    }
  }

  &__date {
    margin: 0;
    font-size: 0.75rem;
  }

  &__message {
    margin-top: 0;
    margin-bottom: 1.5rem;
  }

  &__actions {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin-bottom: 1.5rem;
  }

  &__action {
    cursor: pointer;

    &--like {
      &:hover {
        fill: violet;
      }
    }

    &--comment {
      &:hover {
        fill: rgb(69, 101, 243);
      }
    }

    svg {
      width: 1rem;
      height: 1rem;
    }
    margin-right: 1rem;
  }

  &__comments {
    margin-bottom: 1rem;
  }

  &__new-comment {
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

.comment {
  margin-left: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #c9d1d6;

  &:last-of-type {
    border-bottom: none;
  }

  &__author {
    span {
      &:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    }
    font-size: 0.75rem;
  }
}
</style>
