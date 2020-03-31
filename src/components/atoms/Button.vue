<template>
  <b-button
    @click="$emit('click')"
    @mouseover="hover = true"
    @mouseleave="hover = false"
    rounded
    class="level-item"
    :type="type"
    :size="isSmall ? 'is-small' : ''"
    outlined
    :icon-left="icon"
    :disabled="disabled"
  >
    <span v-if="hover">{{ text }}</span>
  </b-button>
</template>

<script>
export default {
  props: {
    icon: String,
    text: String,
    disabled: {
      type: Boolean,
      default: () => false
    },
    isSmall: {
      type: Boolean,
      default: () => false
    },
    isInfo: {
      type: Boolean,
      default: () => false
    },
    isDanger: {
      type: Boolean,
      default: () => false
    }
  },

  data() {
    return {
      hover: false
    };
  },

  computed: {
    type() {
      return this.isInfo ? "is-info" : this.isDanger ? "is-danger" : "";
    }
  }
};
</script>

<style scoped>
.button {
  font-size: 0.85rem;
}
</style>