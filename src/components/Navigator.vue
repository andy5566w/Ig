<template>
  <nav class="navigator">
    <router-link to="/">
      <img src="../assets/logo.svg" alt="" />
    </router-link>
    <div class="searchInput">
      <input type="text" />
      <the-icon icon="search" />
    </div>
    <div class="navigator__items">
      <router-link to="/">
        <the-icon icon="home" />
      </router-link>

      <button><the-icon icon="publish" /></button>

      <div class="profileDropDown">
        <img
          src="../assets/avatarDefault.png"
          width="42"
          height="42"
          alt="defaultAvatar"
        />
        <div class="dropdownMenu">
          <ul class="profileMenu">
            <li>
              <router-link to="/profile">personal page</router-link>
            </li>
            <li>exit</li>
          </ul>
        </div>
      </div>
    </div>
  </nav>
</template>
<script setup>
import TheIcon from './TheIcon.vue';
</script>

<style scoped lang="scss">
.navigator {
  width: 80vw;
  height: 80px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-items: center;
  svg {
    width: 38px;
    height: 38px;
  }

  .searchInput {
    position: relative;
    input {
      width: 100%;
      padding: 12px 12px 12px 36px;

      background: #f1f1f1;
      border-radius: 14px;
      border: none;
    }

    & > svg {
      position: absolute;
      top: 11px;
      left: 12px;
    }
  }

  &__items {
    justify-self: end;
    display: flex;
    gap: 24px;
    align-items: center;

    & > button {
      border: none;
      background: none;
    }

    .profileDropDown {
      position: relative;
    }
  }
}

.profileMenu {
  position: absolute;
  width: max-content;
  padding: 24px 26px;
  list-style: none;
  background: white;
  box-shadow: 0px 0px 24px rgba(0, 0, 0, 0.08);
  border-radius: 4px;
  right: 0;
  display: grid;
  row-gap: 18px;
  transform: translateY(18px);
}

.profileMenu::before {
  content: '';
  display: block;
  position: absolute;
  width: 0;
  height: 0;
  top: -12px;
  right: 10px;
  border-bottom: 12px solid white;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
}

.profileMenu a,
.profileMenu li {
  text-decoration: none;
  cursor: pointer;
}

.profileMenu a:visited {
  color: initial;
}
</style>
