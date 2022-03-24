<template>
  <div>
    <h1 class="green--text text--lighten-4">Settings</h1>
    <v-container
      :class="
        isDarkMode
          ? 'transparent-bg settings-list px-10'
          : 'white settings-list px-10'
      "
    >
      <div class="setting">
        <v-switch
          :dark="isDarkMode"
          color="green"
          v-model="isLogActive"
          :label="
            isLogActive
              ? 'Log is active : all changes made to the record list are logged.'
              : 'Log is inactive : there will be no trace of changes made to the record list'
          "
          @change="toggleSetting('isLogActive')"
        ></v-switch>
      </div>
      <div class="setting">
        <v-switch
          :dark="isDarkMode"
          color="green"
          v-model="isDarkMode"
          :label="
            isDarkMode
              ? 'Dark mode is on. We care for your eyes.'
              : 'Dark mode is off. At your own risks.'
          "
          @change="toggleSetting('isDarkMode')"
        ></v-switch>
      </div>
    </v-container>
  </div>
</template>

<script>
import Vue from "vue";
import store from "@/store";

export default Vue.extend({
  name: "Settings",
  components: {},
  data() {
    return {};
  },
  computed: {
    isDarkMode() {
      return store.state.settings.isDarkMode;
    },
    isLogActive: {
      get: function () {
        return store.state.settings.isLogActive;
      },
      set: function () {
        return null;
      },
    },
    isDarkMode: {
      get: function () {
        return store.state.settings.isDarkMode;
      },
      set: function () {
        return null;
      },
    },
  },
  methods: {
    toggleSetting(setting) {
      const value = !store.state.settings[setting];
      store.commit("CHANGE_SETTING", {
        setting,
        value,
      });
      store.dispatch("UPDATE_SETTINGS", store.state.settings);
    },
  },
});
</script>

<style lang="scss" scoped>
h1 {
  position: absolute;
  top: 15px;
  left: 80px;
  text-align: left;
}
.settings-list {
  margin: auto;
  margin-top: 80px;
  border-radius: 3px;
}
</style>
