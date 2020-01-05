<template>
  <div class="card">
    <div class="card-content">
      <div class="header">
        <div>
        <span :class="`flag-icon flag-icon-${coin.country.toLowerCase()}`"></span>
        <span class="subtitle is-6">{{ coin.fr.country }}</span>
        </div>
        <p class="subtitle is-6">{{ coin.fr.date }}</p>
      </div>

      <figure v-if="coin.image.fullsize.file" class="image">
        <img :src="imgSrc" @click="showFullSizeImage" />
      </figure>

      <div class="content">
        <p class="title is-6">{{ coin.fr.title }}</p>
        <br />
        <p class="subtitle is-6">{{ coin.fr.volume }} - {{ coin.id }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import ImageModal from './ImageModal'

export default {
  props: {
    coin: Object
  },

  computed: {
    imgSrc() {
      return `/images/fullsize/${this.coin.image.fullsize.file}`;
    }
  },

  methods: {
    showFullSizeImage() {
      this.$buefy.modal.open({
        parent: this,
        component: ImageModal,
        props: {
          imgSrc: this.imgSrc
        }
      });
    }
  }
};
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
}

.flag-icon {
  align-self: flex-start;
  margin-right: 0.5rem;
}

.image {
  margin: auto;
  margin-top: 1rem;
  height: 200px;
  width: 200px;
}

.content {
  margin-top: 1.5rem;
}

.is-rare:hover {
  border: rgba(13, 50, 141, 0.3) solid 2px;
}
</style>