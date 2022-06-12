<template>
  <div class="user-card" :class="user.isChoosed">
    <div class="user-card__photo">
      <img :src="user.photo_50" :alt="user.last_name" />
    </div>

    <div class="user-card__name">
      <h3>{{ user.first_name }} {{ user.last_name }}</h3>
    </div>

    <div
      v-if="addDeleteButton"
      class="user-card__cross"
      @click="removeCard(user)"
    >
      &#10006;
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";

export default {
  name: "UserCard",

  data() {
    return {};
  },
  props: {
    user: Object,
    addDeleteButton: Boolean,
  },
  methods: {
    ...mapMutations(["removeCard"]),
  },
};
</script>
<style lang="scss" scoped>
.choosed {
  background: rgb(45, 245, 129);
  transition: all 500ms;
}
.no-choosed {
  background: rgb(193, 244, 214);
  transition: all 500ms;
}
.user-card {
  height: 50px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  margin: 10px 0px 0px 0px;
  border-radius: 10px;
  &__photo {
    flex: 0 0 30%;
    img {
      height: 40px;
      width: 40px;
    }
  }
  &__name {
    flex: 0 0 70%;
    font-size: 18px;
    padding: 0 5px;
    line-height: 1.3;
  }
  &__cross {
    z-index: 111;
    position: absolute;
    top: 3px;
    right: 3px;
    &:hover {
      color: red;
    }
  }
}
</style>