<template>
  <div
    v-if="isOpen"
    :class="isActive ? 'modal modal--active' : 'modal'"
    @click.self="close"
  >
    <div class="modal__wrapper">
      <div class="modal__header">
        <h2>{{ title }}</h2>
        <div @click="close"><Icon name="x" /></div>
      </div>
      <slot :close="close"></slot>
    </div>
  </div>
</template>

<script>
import Icon from '@/components/Icon';

export default {
  name: 'ModalComponent',
  components: {
    Icon,
  },
  props: {
    title: {
      type: String,
      default: 'Default title',
    },
    name: {
      type: String,
      required: true,
    },
  },
  computed: {
    isActive() {
      return this.$store.getters['modal/active'] === this.name;
    },
    isOpen() {
      return this.$store.getters['modal/allOpen'].includes(this.name);
    },
  },
  beforeDestroy() {
    if (this.isOpen) this.close();
  },
  methods: {
    close() {
      this.$store.commit('modal/close', this.name);
    },
  },
};
</script>

<style scoped lang="scss">
.modal {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 5;
  width: 100vw;
  height: 100vh;

  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s ease-in-out;

  &--active {
    background-color: rgba(0, 0, 0, 0.6);
  }

  &__wrapper {
    border-radius: 0.5rem;
    background-color: #fff;
    padding: 1.5rem;

    max-height: 80vh;
    max-width: 460px;
    width: 100vw;
    position: fixed;
  }

  &__header {
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    justify-content: space-between;

    margin-bottom: 1.5rem;

    h2 {
      margin: 0;
    }

    div {
      cursor: pointer;
    }
  }
}
</style>
