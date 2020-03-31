<template>
  <div>
    <actions />
    <coin-list />
  </div>
</template>

<script>
import Actions from "../Actions.vue";
import CoinList from "../CoinList.vue";

export default {
  components: {
    Actions,
    CoinList
  }
};
</script>