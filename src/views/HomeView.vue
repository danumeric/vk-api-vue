<template>
  <div class="home">
    <div class="targeted-container">
      <ListChoosedUsers class="targeted-container__choosed" />
      <div class="targeted-container__central">
        <FormAddUser class="targeted-container__form" />
        <FriendsList />
      </div>
      <ListSearchedUser
        v-if="this.isSearchedResults"
        class="targeted-container__search"
      />
      <div class="targeted-container__plug" v-else></div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import FormAddUser from "@/components/targetedUsers/FormAddUser.vue";
import ListChoosedUsers from "@/components/targetedUsers/ListChoosedUsers.vue";
import ListSearchedUser from "@/components/targetedUsers/ListSearchedUser.vue";
import FriendsList from "@/components/friendsList/FriendsList.vue";

import { mapGetters } from "vuex";

export default {
  name: "HomeView",
  components: {
    FormAddUser,
    ListSearchedUser,
    ListChoosedUsers,
    FriendsList,
  },
  computed: {
    ...mapGetters(["getSearchedUsers"]),
    isSearchedResults() {
      return this.getSearchedUsers.length > 0 ? true : false;
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  // min-height: 100vh;
  display: flex;
  justify-content: center;
  width: 1000px;
  padding: 50px 0px 0px 0px;
  margin: auto;
  .targeted-container {
    display: flex;

    &__choosed {
      align-self: flex-start;
      flex: 0 0 25%;
    }
    &__central {
      align-self: flex-start;
      padding: 0 10px;
      flex: 0 0 50%;
    }
    &__search {
      align-self: flex-start;
      flex: 0 0 25%;
    }
    &__plug {
      flex: 0 0 25%;
    }
  }
}
</style>