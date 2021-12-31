<template>
  <button class="tc-button" :class="{ secondary: variant === 'secondary' }">
    <slot />
  </button>
</template>

<script>
export default {
  name: 'ButtonComponent',
  inheritAttrs: true,
  props: {
    variant: {
      type: String,
      default: 'primary',
    },
  },
};
</script>

<style lang="scss">
.tc-button {
  border: none;

  width: 100%;
  padding: 0.5rem 1rem;

  height: 2.5rem;
  border-radius: 0.5rem;
  color: white;
  background-color: rgb(69, 101, 243);

  &:hover {
    background-color: rgb(69, 101, 243);
  }

  &.secondary {
    background: transparent;
    color: rgb(69, 101, 243);
    border: 1px solid rgb(69, 101, 243);

    &:hover {
      color: white;
      background-color: rgb(69, 101, 243);
    }
  }

  cursor: pointer;
}
</style>
