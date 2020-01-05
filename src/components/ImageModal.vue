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