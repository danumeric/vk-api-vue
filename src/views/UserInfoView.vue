<template>
  <div class="user-info">
    <div class="user-info__button" @click="this.$router.back()">
      <h1>Вернуться назад</h1>
    </div>
    <UserPickedFriends :idsFriendsFromList="idsFriendsFromList" />
    <!-- <div class="test">{{ payload }}</div> -->
    <WallUser />
  </div>
</template>
<script>
import UserPickedFriends from "@/components/userInfoWall/UserPickedFriends.vue";
import WallUser from "@/components/userInfoWall/WallUser.vue";
import { mapActions } from "vuex";

export default {
  data() {
    return {
      idTargetUser: "",
      idsFriendsFromList: [],
    };
  },
  components: {
    UserPickedFriends,
    WallUser,
  },
  props: ["payload"],

  mounted() {
    let payloadArray = this.payload.split("&");
    if (payloadArray[0].slice(0, 3) === "id=") {
      this.idTargetUser = payloadArray[0].slice(3);
    }
    if (payloadArray[1].slice(0, 7) === "fr_ids=") {
      this.idsFriendsFromList = payloadArray[1].slice(7).split(",");
    }
    this.fetchWall(this.idTargetUser);
    //this.fetchWall(733734293);
  },
  methods: {
    ...mapActions(["fetchWall"]),
  },
};
</script>
<style lang="scss" scoped>
.user-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 500px;
  padding: 50px 0px 0px 0px;
  margin: auto;
  &__button {
    align-self: flex-start;
    cursor: pointer;
    background: rgba(45, 245, 129, 0.5);
    padding: 7px;
    border-radius: 10px;
  }
}
</style>