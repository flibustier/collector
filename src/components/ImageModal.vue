<template>
  <div style="text-align: center" @click="$emit('close')">
    <img :src="imgSrc" />
  </div>
</template>

<script>
export default {
  props: {
    imgSrc: String
  }
};
</script>

<style scoped>
img {
  max-height: 90vh;
}
</style>