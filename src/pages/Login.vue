<template>
  <div class="loginPage">
    <img src="../assets/phone.png" alt="" class="phoneImage" />
    <div class="loginForm">
      <img src="../assets/logo.svg" alt="" />
      <form @submit.prevent id="form">
        <input type="email" placeholder="type your email..." v-model="email" />
        <input type="password" placeholder="password" v-model="password" />
        <input
          v-if="!isLogin"
          type="password"
          placeholder="password"
          v-model="confirmPassword"
        />
        <button
          type="submit"
          class="loginButton"
          @click="isLogin ? login() : register()"
        >
          {{ isLogin ? 'login' : 'signup' }}
        </button>
        <p @click="isLogin = !isLogin" class="info">
          {{ isLogin ? 'click for signing up' : 'login in' }}
        </p>
        <div v-if="!isLogin" class="agreement">
          <input type="checkbox" v-model="agreementChecked" />checked for
          agreement
        </div>
      </form>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const isLogin = ref(true);
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const agreementChecked = ref(false);
const router = useRouter();
const store = useStore();

async function register() {
  if (!agreementChecked.value) {
    alert('you need to check regular before you sign up');
    return;
  }
  const { ok } = await store.dispatch('user/createAccount', {
    email: email.value,
    password: password.value,
  });
  if (ok) {
    await router.replace('/');
  }
}

async function login() {
  const { ok } = await store.dispatch('user/signIn', {
    email: email.value,
    password: password.value,
  });
  if (ok) {
    await router.replace('/');
  }
}
</script>
<style scoped lang="scss">
.loginPage {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 5vw;
  width: 100vw;
  height: 100vh;
  max-width: 100%;
  background: #f8f9fb;

  padding: 0 10vw;
}

.phoneImage {
  max-width: 400px;
  position: relative;
  top: 36px;
  justify-self: end;
}

.loginForm {
  justify-self: start;
  box-shadow: 0px 4px 48px rgba(0, 0, 0, 0.06);
  border-radius: 32px;
  background: white;
  padding: 74px 60px;

  display: grid;
  place-items: center;
  row-gap: 52px;
  width: 380px;

  & > form {
    display: grid;
    row-gap: 24px;
    width: 100%;
    height: 100%;
  }
}

input {
  background: #fafafa;
  border-radius: 4px;
  border: none;
}

input::placeholder {
  color: #9e9e9e;
}

.loginButton {
  background: linear-gradient(89.93deg, #00c2ff 0.06%, #0047ff 105.68%);
  padding: 12px 0;
  color: white;
  border: none;
}

.info {
  color: #1da0ff;
  text-align: center;
  cursor: pointer;
}

.agreement {
  color: #a1a1a1;
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
