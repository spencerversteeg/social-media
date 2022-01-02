<template>
  <div class="post">
    <p class="post__author">
      <nuxt-link tag="span" :to="`/user/${p.user.name || '/'}`"
        >@{{ p.user.name || undefined }}</nuxt-link
      >
      &bullet;
      {{ $moment(p.createdAt).fromNow() }}
    </p>
    <p class="post__message">{{ p.message }}</p>
    <div class="post__actions">
      <div class="post__action post__action--like" @click="like">
        <p>
          <Icon v-if="p.liked" name="heart" class="liked" />
          <Icon v-else name="heart-outline" />
          {{ p._count.Like }}
        </p>
      </div>
      <nuxt-link
        :to="`/post/${p.id}`"
        class="post__action post__action--comment"
      >
        <p>
          <Icon name="comment-outline" />
        </p>
      </nuxt-link>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon';
// import likePost from '@/lib/post';

export default {
  name: 'PostComponent',
  components: {
    Icon,
  },
  props: {
    post: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      p: this.post,
    };
  },
  computed: {
    likeLength() {
      if (this.p.Like) {
        return this.p.Like.length;
      } else {
        return 0;
      }
    },
  },
  methods: {
    fullscreenRedirect() {
      this.$router.push(`/post/${this.p.id}`);
    },
    async like() {
      try {
        if (!this.p.id) {
          throw new Error('Missing ID');
        }
        const newLike = await this.$axios.post(
          `${process.env.SERVER_URL}/api/post/${this.p.id}/like`,
          {},
          {
            withCredentials: true,
          }
        );

        this.p = newLike.data.data;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
</script>

<style lang="scss">
.post {
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
  }

  &__action {
    margin-right: 1.5rem;
    cursor: pointer;

    p {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
    }

    &--like {
      .liked {
        fill: violet;
      }

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
      margin-right: 0.5rem;
    }
  }
}
</style>
