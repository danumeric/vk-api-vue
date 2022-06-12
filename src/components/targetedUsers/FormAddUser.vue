<template>
  <div class="addid">
    <form name="addUser" action="">
      <label for="ids" class="addid__label"
        >Введите id пользователя VK формате id*, либо используйте поиск по имени
        и фамилии</label
      >
      <input
        v-model="idsInput"
        class="addid__input"
        type="text"
        name="ids"
        placeholder="введите id/имя."
      />
      <button class="addid__button" @click="fillFieldDefauldIds">
        Использовать готовый набор пользователей
      </button>

      <button class="addid__button" @click="createUserList" type="submit">
        Построить список друзей
      </button>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";

export default {
  name: "FormAddUser",
  data() {
    return {
      idsInput: "",
      idsArray: [],
    };
  },
  beforeUpdate() {
    this.emitSearchText;
  },
  computed: {
    ...mapGetters(["getPreparedUsers"]),

    emitSearchText() {
      this.fetchSearchedUser(this.idsInput);
      return "";
    },
  },
  methods: {
    ...mapActions(["fetchSearchedUser", "fetchFriends"]),

    async fillFieldDefauldIds(e) {
      //автозаполнение моими юзерами
      e.preventDefault();
      await this.fetchSearchedUser(
        "19736017,19076529,9711731,10925651,18157423,224328578"
      );
    },

    createUserList(e) {
      e.preventDefault();
      this.fetchFriends(this.getPreparedUsers);
    },
  },
};
</script>
<style lang="scss" scoped>
.addid {
  font-size: 20px;

  &__label {
    display: block;
  }
  &__button {
    width: 400px;
    display: block;
    padding: 5px;
    margin: 10px auto 0px auto;
    border-radius: 10px;
    background: rgb(230, 250, 239);
  }
  &__input {
    margin: 10px 0px 0px 0px;
    width: 400px;
    border-radius: 10px;
    background: #e7fdf0;
    color: var(--secondary-color);
    outline: none;
    border: 1px solid transparent;
    &:focus-visible {
      border: 1px solid #36eb84;
      background: transparent;
    }
  }
}
</style>
