<template>
  <div>
    <h2 class="title">Editing personal file</h2>
    <div class="changeAvatar">
      <TheAvatar :width="48" :height="48" :src="profileData.avatar" />
      <TheButton>change avatar</TheButton>
      <input type="file" class="inputFile" @change="handleChange" />
    </div>
    <form class="profileForm" @submit.prevent="updateUser">
      <label for="name">name：</label>
      <input type="text" v-model="profileData.name" />
      <label for="intro">profile：</label>
      <textarea
        rows="12"
        v-model="profileData.intro"
        placeholder="please type something to introduce yourself..."
      ></textarea>
      <div class="actions">
        <TheButton type="reset" reverse @click.prevent="router.push('/profile')"
          >cancel</TheButton
        >
        <TheButton type="submit">
          <div class="loading" v-if="isLoading"></div>
          <span v-else>confirm</span>
        </TheButton>
      </div>
    </form>
  </div>
</template>
<script setup>
import TheButton from '../components/TheButton.vue';
import TheAvatar from '../components/TheAvatar.vue';
import { reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const router = useRouter();
const store = useStore();
const avatarFile = ref(null);
const isLoading = ref(false);
const profileData = reactive({
  avatar: '',
  name: '',
  intro: '',
});

watch(
  () => store.state.user.userDoc,
  (userDoc) => {
    if (userDoc.id) {
      const { avatar, name, intro } = userDoc;
      profileData.avatar = avatar;
      profileData.name = name;
      profileData.intro = intro;
    }
  },
  { immediate: true },
);

async function handleChange(e) {
  const file = e.target.files[0];
  profileData.avatar = URL.createObjectURL(file);
  avatarFile.value = file;
}

async function updateUser() {
  try {
    isLoading.value = true;
    await store.dispatch('user/updateUser', {
      profileData,
      file: avatarFile.value,
    });
  } catch (error) {
    console.log(error);
  } finally {
    isLoading.value = false;
  }
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

.loading {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style>
