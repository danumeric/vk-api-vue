<template>
  <div class="list">
    <div class="list__header">
      Пользователь находится в друзьях у выбранных пользователей:
    </div>
    <div
      class="list__cards"
      v-for="user in userPickedFriends(idsFriendsFromList)"
      :key="user.id"
    >
      <UserCard :user="user" :addDeleteButton="false" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import UserCard from "@/components/targetedUsers/UserCard.vue";

//getChoosedUsers
export default {
  name: "UserPickedFriends",
  data() {
    return {};
  },
  components: {
    UserCard,
  },
  computed: {
    ...mapGetters(["getChoosedUsers"]),
  },
  props: ["idsFriendsFromList"],
  methods: {
    userPickedFriends(ids) {
      return this.getChoosedUsers.filter((u) => ids.includes(u.id.toString()));
    },
  },
  mounted() {},
};
</script>

<style lang="scss" scoped>
.list {
  width: 500px;
  margin: 10px auto 0 auto;
  padding: 15px 0px 15px 0px;
  &__cards {
    width: 250px;
    margin: 0 auto;
  }
  &__header {
    padding: 5px 0px 0px 0px;
  }
  background: rgb(230, 250, 239);
  border-radius: 10px;
}
</style>