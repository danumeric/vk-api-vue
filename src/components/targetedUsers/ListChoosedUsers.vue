<template>
  <div class="list">
    <div class="list__header">
      Добавленные пользователи. Кликните для выбора пользователя для дальнейшего
      построения списка друзей
    </div>
    <div
      class="list__cards"
      v-for="user in this.getChoosedUsers"
      :key="user.id"
    >
      <UserCard
        :user="user"
        @click="addUserToPrepared(user)"
        :addDeleteButton="true"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";
import UserCard from "./UserCard";

export default {
  name: "ListChoosedUser",
  data() {
    return {};
  },
  components: {
    UserCard,
  },
  computed: {
    ...mapGetters(["getChoosedUsers"]),
  },
  methods: {
    ...mapMutations(["addUserToPrepared"]),
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