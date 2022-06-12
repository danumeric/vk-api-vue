<template>
  <div class="friend-card" :style="style">
    <div class="friend-card__commoninfo">
      <div class="friend-card__name">
        <h3>{{ friend.first_name }} {{ friend.last_name }}</h3>
      </div>
      <div class="friend-card__sex">
        Пол -
        {{ friend.sex === 1 ? "Ж" : friend.sex === 2 ? "М" : "Не указан" }}
      </div>
      <div class="friend-card__age">Возраст - {{ calculateAge() }}</div>
    </div>
    <div class="friend-card__friendsinfo">
      <div class="friend-card__fr-count">{{ counterOfFriends }}</div>
      <!-- {{ friend.coincidenceFriends }} id у кого в друзьязх -->
    </div>
  </div>
</template>
<script>
import { mapMutations } from "vuex";

const jsonp = require("jsonp-promise");
const tokenVk = process.env.VUE_APP_TOKEN;
export default {
  data() {
    return {
      style: "",
      counterOfFriends: "pending",
      transparency: 0.05, //default - данный человек является другом 1 выбранному пользователю
    };
  },
  props: {
    friend: Object,
  },
  computed: {},
  methods: {
    ...mapMutations(["pushQueueTimeouts", "setKnownCountOfFriends"]),
    calculateAge() {
      if (!this.friend.bdate) {
        return "не указана дата рождения";
      }
      let arrCorrectBdate = this.friend.bdate.split(".").reverse();
      if (arrCorrectBdate.length < 3) {
        return "не указан год рождения";
      }
      const correctBdate = Date.parse(arrCorrectBdate.join("-"));
      const nowDate = new Date();
      return Math.floor((nowDate - correctBdate) / 31556952000) + " лет";
    },
    async fetchFriendsCount() {
      //если количество друзей у данного пользователя уже известно
      if (this.friend.knownCountOfFriends) {
        this.counterOfFriends = this.friend.knownCountOfFriends + " друзей";
        // console.log("известно:", this.friend.positionForLatency);
        return;
      }

      // API позволяет только 3 запроса в секунду
      let idQueue = setTimeout(async () => {
        try {
          let countFriend = await jsonp(
            `https://api.vk.com/method/users.get?user_ids=${this.friend.id}&fields=counters&access_token=${tokenVk}&v=5.131`
          ).promise;
          if (!countFriend.response) {
            this.fetchFriendsCount();
            return;
          }
          if (countFriend.response[0].deactivated === "banned") {
            this.counterOfFriends = "user banned! ";
            return;
          }
          this.counterOfFriends =
            countFriend.response[0].counters.friends + " друзей";
          const payload = {
            position: this.friend.positionForLatency,
            countOfFriends: this.counterOfFriends,
          };
          this.setKnownCountOfFriends(payload);
        } catch (e) {
          console.log(e);
        }
      }, +this.friend.positionForLatency * 400);
      this.pushQueueTimeouts(idQueue);
    },
  },
  async mounted() {
    this.fetchFriendsCount();

    //регулировка прозрачности карточки в зависимости от кол-ва совпадающих друзей
    if (this.friend.coincidenceFriends) {
      if (this.friend.coincidenceFriends.length > 1) {
        this.transparency += this.friend.coincidenceFriends.length / 5;
        if (this.transparency > 1) this.transparency = 1;
      }
    }

    this.style = `background-color: rgba(2, 254, 149, ${this.transparency})`;
  },
};
</script>

<style lang="scss" scoped>
.friend-card {
  text-align: left;
  display: flex;
  border-radius: 10px;
  padding: 3px 0px 3px 0px;

  &__commoninfo {
    padding: 0px 0px 0px 15px;
    flex: 0 0 70%;
  }
  &__friendsinfo {
    flex: 0 0 30%;
    padding: 0px 15px 0px 0px;
    text-align: right;
  }
}
</style>