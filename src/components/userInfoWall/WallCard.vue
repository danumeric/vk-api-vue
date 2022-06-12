<template>
  <div class="card">
    <div v-if="post.copy_history" class="card__repost">
      <div
        class="card__media"
        v-for="repost in post.copy_history[0].attachments"
        :key="repost?.photo?.id || repost?.audio?.id || repost?.video?.id"
      >
        <div class="card__text">{{ post.copy_history[0].text }}</div>
        <div v-if="repost.type === 'photo'" class="card__photo">
          <img :src="repost.photo.sizes[1].url" alt="photo" />
        </div>

        <div v-if="repost.type === 'audio'" class="card__audio">
          <audio controls :src="repost.audio.url" alt="audio"></audio>
          <p>К сожалению, прослушать музыку с помощью API нельзя</p>
        </div>

        <div class="card__video" v-if="repost.type === 'video'">
          Пользовательское видео. Из-за ограничений ВК видео доступно только в
          официальном приложении ВКонтакте
        </div>
      </div>
    </div>

    <div class="card__text">{{ post.text }}</div>
    <div
      class="card__media"
      v-for="media in post.attachments"
      :key="media?.photo?.id || media?.audio?.id || media?.video?.id"
    >
      <img
        v-if="media.type === 'photo'"
        :src="media.photo.sizes[1].url"
        alt="photo"
      />
      <div v-if="media.type === 'audio'" class="card__audio">
        <audio controls :src="media.audio.url" alt="audio"></audio>
        <p>К сожалению, прослушать музыку с помощью API нельзя</p>
      </div>

      <div class="card__video" v-if="media.type === 'video'">
        Пользовательское видео. Из-за ограничений ВК видео доступно только в
        официальном приложении ВКонтакте
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "WallCart",

  props: {
    post: Object,
  },
};
</script>
<style lang="scss" scoped>
.card {
  &__text {
    text-align: justify;
  }
  padding: 10px;
  margin: 0 auto;
  max-width: 360px;
  background: rgba(230, 250, 239, 0.5);
  &__text {
    padding: 5px 0px 0px 0px;
  }
  &__photo {
    padding: 5px 0px 0px 0px;
  }
  &__audio {
    audio {
      display: block;
    }
    p {
      padding: 5px 0px 0px 0px;
    }
  }
  &__video {
    width: 130px;
    margin: 0 auto;
    text-align: justify;
  }
}
</style>