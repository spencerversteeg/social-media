<template>
  <div class="tc-input" :class="{ error: !!error }">
    <label v-if="label" :for="id">{{ label }}</label>
    <input
      v-bind="$attrs"
      :value="value"
      v-on="$listeners"
      @input="$emit('update', $event.target.value)"
    />
    <span v-if="error">{{ error }}</span>
  </div>
</template>

<script>
export default {
  name: 'InputComponent',
  inheritAttrs: true,
  model: {
    prop: 'value',
    event: 'update',
  },
  props: {
    id: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: false,
      default: undefined,
    },
    error: {
      type: String,
      required: false,
      default: undefined,
    },
    value: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.tc-input {
  display: flex;
  flex-flow: column nowrap;

  label {
    margin-bottom: 0.5rem;
  }

  input {
    border-radius: 0.5rem;
    border: 1px solid #c9d1d6;
    padding: 0 0.25rem;
    height: 2rem;
    outline: none;

    &:focus {
      border-color: #111;
    }
  }

  &.error {
    input {
      border-color: red;
    }
  }

  span {
    margin-top: 0.5rem;
    color: red;
  }
}
</style>
