<template>
  <b-navbar-item
    @mouseover.native="isHovered = true"
    @mouseleave.native="isHovered = false"
    class="brand-link"
    tag="router-link"
    :to="{ name: 'catalogue' }"
  >
    <logo :rotate="isHovered" class="logo" />
    <h1 class="is-size-3 brand-title">Collector</h1>
  </b-navbar-item>
</template>

<script>
import Logo from "./atoms/Logo";

export default {
  components: {
    Logo
  },

  data() {
    return {
      isHovered: true
    };
  },

  mounted() {
    this.isHovered = false;
  }
};
</script>

<style scoped>
.logo {
  width: 2.5rem;
  height: 2.5rem;
  margin-right: 0.5rem;
}

.brand-link {
  padding: 0;
  margin-left: 0.5rem;
}

.brand-title {
  padding-top: 5px;
  line-height: 1;
}
</style>
