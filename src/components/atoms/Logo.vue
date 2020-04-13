<template>
  <svg
    id="Calque_1"
    data-name="Calque 1"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 480 500"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <g>
      <path
        class="cls-1"
        d="M29.58,250.07c0-127,103-230,230-230V.07c-138.07,0-250,111.93-250,250s111.93,250,250,250v-20C132.56,480.07,29.58,377.1,29.58,250.07Z"
        transform="translate(-9.58 -0.07)"
      />
      <animateTransform
        v-if="this.rotate"
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        from="360 250 250"
        to="0 250 250"
        dur="3s"
        repeatCount="indefinite"
      />
    </g>
    <g>
      <path
        class="cls-2"
        d="M259.58,20.07v47a183,183,0,0,1,0,366v47c127,0,230-103,230-230S386.61,20.07,259.58,20.07Z"
        transform="translate(-9.58 -0.07)"
      />
      <animateTransform
        v-if="this.rotate"
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        from="0 250 250"
        to="360 250 250"
        dur="2s"
        repeatCount="indefinite"
      />
    </g>
    <g>
      <path
        class="cls-3"
        d="M76.58,250.07a183,183,0,0,0,183,183v-366A183,183,0,0,0,76.58,250.07Z"
        transform="translate(-9.58 -0.07)"
      />
      <animateTransform
        v-if="this.rotate"
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        from="360 250 250"
        to="0 250 250"
        dur="4s"
        repeatCount="indefinite"
      />
    </g>
  </svg>
</template>

<style>
.cls-1 {
  fill: #9e9e9e;
}
.cls-2 {
  fill: #ccc;
}
.cls-3 {
  fill: #ccb147;
}
</style>

<script>
export default {
  props: {
    active: {
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
    rotate() {
      return this.active || this.hover;
    }
  }
};
</script>
