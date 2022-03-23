<template>
  <div>
    <h1 class="green--text text--lighten-4">Settings</h1>
    <v-container class="settings-list px-10">
      <div class="setting">
        <v-switch
          dark
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
    isLogActive: {
      get: function () {
        return store.state.settings.isLogActive;
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
  background: rgba(255, 255, 255, 0.05);
}
</style>
