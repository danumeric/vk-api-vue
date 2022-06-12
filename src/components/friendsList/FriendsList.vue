<template>
  <div
    class="friends-list-item"
    v-for="friend in this.getFriendsDB"
    :key="friend.id"
  >
    <FriendCart
      :friend="friend"
      @click="
        goToUserInfo(
          `id=${friend.id}&fr_ids=${friend.coincidenceFriends.join(',')}`
        )
      "
    />
  </div>
</template>

<script>
import router from "@/router";
import { mapGetters } from "vuex";
import FriendCart from "./FriendCart";

export default {
  name: "ListSearchedUser",
  data() {
    return {};
  },
  components: {
    FriendCart,
  },
  computed: {
    ...mapGetters(["getFriendsDB"]),
  },
  methods: {
    goToUserInfo(id) {
      router.push(`/user/${id}`);
    },
  },
};
</script>
.<style lang="scss" scoped>
.friends-list-item {
  padding: 5px 25px 0px 25px;
}
</style>
