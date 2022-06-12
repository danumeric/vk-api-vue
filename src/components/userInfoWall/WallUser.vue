<template>
  <div class="wall">
    Записи на стене выбранного пользователя:
    <div class="wall__cards" v-for="post in this.getWall" :key="post.id">
      <WallCard :post="post" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import WallCard from "./WallCard";

export default {
  name: "WallUser",
  data() {
    return {};
  },
  components: {
    WallCard,
  },
  computed: {
    ...mapGetters(["getWall"]),
  },
};
</script>
<style lang="scss" scoped>
.wall {
  margin: 20px 0px 0px 0px;
  &__cards {
    padding: 10px 0px 0px 0px;
  }
}
</style>