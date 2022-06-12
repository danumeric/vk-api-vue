<template>
  <div class="list">
    <div class="list__header">
      Найденные пользователи. Кликните для добавления в список слева
    </div>
    <div
      class="list__cards"
      v-for="user in this.getSearchedUsers"
      :key="user.id"
    >
      <UserCard
        :user="user"
        @click="addUserToChoosed(user)"
        :addDeleteButton="false"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import UserCard from "./UserCard";

export default {
  name: "ListSearchedUser",
  data() {
    return {};
  },
  components: {
    UserCard,
  },
  computed: {
    ...mapGetters(["getSearchedUsers"]),
  },
  methods: {
    ...mapMutations(["addUserToChoosed"]),
  },
};
</script>

<style lang="scss" scoped>
.list {
  padding: 15px 0px 15px 0px;

  &__header {
    padding: 5px 0px 0px 0px;
  }
  background: rgb(230, 250, 239);
  border-radius: 10px;
}
</style>