<template>
  <div>
    <h2 class="title">Editing personal file</h2>
    <div class="changeAvatar">
      <TheAvatar :width="48" :height="48" :src="profileData.avatar" />
      <TheButton>change avatar</TheButton>
      <input type="file" class="inputFile" @change="uploadAvatar" />
    </div>
    <form class="profileForm" @submit.prevent="updateUser">
      <label for="username">name：</label>
      <input type="text" v-model="profileData.username" />
      <label for="name">nick name：</label>
      <input type="text" v-model="profileData.name" />
      <label for="intro">profile：</label>
      <textarea rows="12" v-model="profileData.intro"></textarea>
      <label for="mobilePhone">mobile：</label>
      <input type="text" v-model="profileData.mobilePhone" />
      <label>gender：</label>
      <div class="genderRadios">
        <input
          type="radio"
          name="gender"
          id="M"
          value="M"
          v-model="profileData.gender"
        />
        male
        <input
          type="radio"
          name="gender"
          id="F"
          value="F"
          v-model="profileData.gender"
        />
        female
      </div>
      <label for="website">website：</label>
      <input type="text" v-model="profileData.website" />
      <div class="actions">
        <TheButton type="reset" reverse @click.prevent="router.push('/profile')"
          >cancel</TheButton
        >
        <TheButton type="submit">confirm</TheButton>
      </div>
    </form>
  </div>
</template>
<script setup>
import TheButton from '../components/TheButton.vue';
import TheAvatar from '../components/TheAvatar.vue';
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const user = computed(() => store.state.user.user);
const profileData = reactive({
  avatar: user.value.avatar,
  username: user.value.username,
  name: user.value.name,
  intro: user.value.intro,
  mobilePhone: user.value.mobilePhone,
  gender: user.value.gender,
  website: user.value.website,
});

async function uploadAvatar(e) {
  const file = e.target.files[0];
}

async function updateUser() {
  await store.dispatch('updateUser', profileData);
  await router.push('/profile');
}
</script>
<style scoped lang="scss">
.title {
  margin-bottom: 42px;
  font-size: 24px;
  font-weight: 600;
}

.changeAvatar {
  display: flex;
  align-items: center;
  position: relative;
  .button {
    margin-left: 26px;
  }
}

.inputFile {
  opacity: 0;
  position: absolute;
  cursor: pointer;
  top: 0;
  bottom: 0;
}

.profileForm {
  display: grid;
  grid-template-columns: max-content 1fr;
  row-gap: 32px;
  column-gap: 10px;
  margin-top: 38px;
  & > label {
    grid-column: 1 / 2;
    justify-self: end;
    position: relative;
    top: 6px;
  }
  .actions {
    grid-column: 1 / 3;
    justify-self: end;
    display: flex;
    gap: 16px;
  }
}
</style>
