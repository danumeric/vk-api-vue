const jsonp = require('jsonp-promise')
const tokenVk = process.env.VUE_APP_TOKEN

export default ({
  state: {
    searchedUsers: [], //хранилище для отображения юзеров при поиске через форму
    choosedUsers: [], // пользователи в левом списке
    preparedUsers: [], // выбранные пользователи в левом списке
    friendsDB: [], // БД друзей для пользователей из preparedUsers
    queueTimeouts: [], //Очередь макрозадач по запросу друзей друзей. в случае изменения списка друзей необъодимо очистить очередь callback у settimeout
    sortedFriendsDB: [], //отсортированная БД друзей с удалёнными DELETED и объединёнными дубликатами
    wall: [] //записи стены пользователей
  },

  getters: {
    getChoosedUsers(state) {
      return state.choosedUsers;
    },
    getSearchedUsers(state) {
      return state.searchedUsers;
    },
    getPreparedUsers(state) {
      return state.preparedUsers;
    },
    getUnsortedFriendsDB(state) {
      return state.friendsDB;
    },
    getQueueTimeouts(state) {
      return state.queueTimeouts;
    },
    getFriendsDB(state) {//сортировка по фамилии и имени, удаление DELETED, 

      if (state.sortedFriendsDB.length > 0) return state.sortedFriendsDB;
      if (state.friendsDB.length === 0) return []

      let sortedFriendsDB = state.friendsDB.slice().filter(item => item.deactivated != "deleted")

      sortedFriendsDB.sort((a, b) => {
        if (a.last_name > b.last_name) return 1;
        if (a.last_name === b.last_name) {
          if (a.first_name > b.first_name) return 1;
          if (a.first_name < b.first_name) return -1;
        }
        if (a.last_name < b.last_name) return -1;
      });
      //поиск дубликатов, их удаление и добавление свойства coincidenceFriends
      for (let i = 1; i < sortedFriendsDB.length; i++) {
        if (!sortedFriendsDB[i - 1].coincidenceFriends) {
          sortedFriendsDB[i - 1].coincidenceFriends = [];
          sortedFriendsDB[i - 1].coincidenceFriends.push(sortedFriendsDB[i - 1].ownerOfFriends)
        }

        if (sortedFriendsDB[i].id === sortedFriendsDB[i - 1].id) {
          sortedFriendsDB[i - 1].coincidenceFriends.push(sortedFriendsDB[i].ownerOfFriends);
          sortedFriendsDB.splice(i, 1);
          i--;
        }
      }

      for (let i = 0; i < sortedFriendsDB.length; i++) {
        sortedFriendsDB[i].positionForLatency = i;
      }
      state.sortedFriendsDB = sortedFriendsDB;
      return state.sortedFriendsDB;
    },
    getWall(state) {
      return state.wall;
    }
  },

  mutations: {
    updateSearchedUsers(state, db) {
      state.searchedUsers = db;
    },
    updateChoosedUsers(state, db) {
      state.choosedUsers = db;
    },
    updatePreparedUsers(state, db) {
      state.preparedUsers = db;
    },
    pushQueueTimeouts(state, id) {
      state.queueTimeouts.push(id);
    },
    clearQueueTimeouts(state) {//отмена очереди задач по fetch
      for (let timerId of state.queueTimeouts) {
        clearTimeout(timerId);
      }
      state.queueTimeouts = [];
    },
    updateFriendsDB(state, db) {
      state.friendsDB = db;
    },
    updateSortedFriendsDB(state, db) {
      state.sortedFriendsDB = db;
    },
    updateWall(state, db) {
      state.wall = db;
    },

    setKnownCountOfFriends(state, payload) {//{poition, countOfFriends}
      state.sortedFriendsDB[payload.position].knownCountOfFriends = payload.countOfFriends;
    },

    addUserToChoosed(state, user) {
      for (let u of state.choosedUsers) { //check duplicate users
        if (u.id === user.id) return
      }
      user.isChoosed = 'no-choosed';//установка по умолчанию fetchFriends
      state.choosedUsers.push(user);
      let newSearchedUsers = state.searchedUsers.filter(item => item.id !== user.id)
      state.searchedUsers = newSearchedUsers;
      document.forms.addUser.ids.value = '';
      state.searchedUsers = [];
    },

    addUserToPrepared(state, user) {
      for (let u of state.preparedUsers) { //В случае возврата на домашнюю страницу эти не будут запрашиваться повторно
        if (u.id === user.id) {
          let newPreparedUsers = state.preparedUsers.filter(item => item.id !== u.id)
          state.preparedUsers = newPreparedUsers;
          state.choosedUsers.map((item) => {
            if (item.id === user.id) item.isChoosed = 'no-choosed';
          })
          return;
        }

      }

      state.preparedUsers.push(user);
      state.choosedUsers.map((item) => {
        if (item.id === user.id) item.isChoosed = 'choosed';
      })
    },

    removeCard(state, user) {//нажатие крестика в левой карточке пользователя
      setTimeout(() => {
        const newChoosedUsers = state.choosedUsers.filter(item => item.id !== user.id)
        state.choosedUsers = newChoosedUsers;
        const newPreparedUsers = state.preparedUsers.filter(item => item.id !== user.id)
        state.preparedUsers = newPreparedUsers;
      }, 50);

    }
  },

  actions: {
    async fetchSearchedUser(ctx, inp) { //запрос данных по пользователям из поисковой строки
      try {
        if (inp === "") {
          ctx.commit('updateSearchedUsers', [])
          return;
        }
        if (inp.indexOf(',') >= 0) {  //если id через запятую
          const res = await jsonp(`https://api.vk.com/method/users.get?user_ids=${inp}&fields=photo_50&access_token=${tokenVk}&v=5.131`).promise;
          for (let item of res.response) {//установка по умолчанию 
            item.isChoosed = 'no-choosed';
          }
          await ctx.commit('updateChoosedUsers', res.response)
          return res.response;
        }
        //В случае если запрос начинается с id*
        if (inp.slice(0, 2) === 'id' && inp.slice(2) == +inp.slice(2)) {
          let res = await jsonp(`https://api.vk.com/method/users.get?user_ids=${inp.slice(2)}&fields=photo_50&access_token=${tokenVk}&v=5.131`).promise;
          res.response.isChoosed = 'no-choosed'
          await ctx.commit('updateSearchedUsers', res.response)
          return res.response;
        } else {
          //обычный поиск по ФИО
          let res = await jsonp(`https://api.vk.com/method/users.search?q=${inp}&count=5&fields=photo_50&access_token=${tokenVk}&v=5.131`).promise;
          for (let u of res.response.items) {
            u.isChoosed = 'no-choosed'
          }
          await ctx.commit('updateSearchedUsers', res.response.items)
          return res.response.items
        }
      } catch (e) { console.log(e); }
    },

    async fetchFriends(ctx, users) {//запрос количества друзей друзей
      try {
        await ctx.commit('clearQueueTimeouts')//отменить очередь fetchFriends при нажатии кнопки построить
        await ctx.commit('updateFriendsDB', [])
        await ctx.commit('updateSortedFriendsDB', [])

        let tempStorageFriends = [] // чтобы геттер не обновлялся после каждого пуша

        for (let i = 0; i < users.length; i++) {
          let res = await jsonp(`https://api.vk.com/method/friends.get?user_id=${users[i].id}&fields=bdate,sex&access_token=${tokenVk}&v=5.131`).promise;
          if (res.error) {
            console.log('профиль с id ', users[i].id, ' является приватным, список друзей получить нельзя');
            break;
          }
          for (let fr of res.response.items) {
            fr.ownerOfFriends = users[i].id;
            tempStorageFriends.push(fr);
          }
        }
        await ctx.commit('updateFriendsDB', tempStorageFriends)
      } catch (e) { console.log(e); }
    },

    async fetchWall(ctx, id) {
      try {
        let res = await jsonp(`https://api.vk.com/method/wall.get?owner_id=${id}&count=10&access_token=${tokenVk}&v=5.131`).promise;
        await ctx.commit('updateWall', res.response.items)
      }
      catch (e) { console.log(e); }
    }
  },



})
