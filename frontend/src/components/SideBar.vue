<template>
  <div>
    <v-navigation-drawer
      :class="`${isDarkMode ? 'black-bg' : 'white'} side-bar`"
      permanent
      mini-variant
    >
      <img class="image-logo" src="../assets/logo.png" height="50px" />
      <!-- <v-tooltip
        right
        :color="isDarkMode ? 'black' : 'white'"
        transition="slide-x-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <div
            v-on="on"
            v-bind="attrs"
            class="menu-icon-wrapper"
            @click="showForm"
          >
            <Ico type="mdi-folder-plus-outline" />
          </div>
        </template>
        <span
          :class="
            isDarkMode
              ? 'grey--text text--lighten-2'
              : 'grey--text text--darken-2'
          "
          >Add new item</span
        >
      </v-tooltip> -->

      <v-tooltip
        right
        :color="isDarkMode ? 'black' : 'white'"
        transition="slide-x-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <div
            v-on="on"
            v-bind="attrs"
            class="menu-icon-wrapper"
            @click="goToPageNamed('categories')"
          >
            <Ico
              type="mdi-view-grid-plus"
              :color="
                currentRoute === 'Categories'
                  ? 'green lighten-4 black--text rounded'
                  : ''
              "
            />
          </div>
        </template>
        <span
          :class="
            isDarkMode
              ? 'grey--text text--lighten-2'
              : 'grey--text text--darken-2'
          "
          >Record</span
        >
      </v-tooltip>

      <v-tooltip
        right
        :color="isDarkMode ? 'black' : 'white'"
        transition="slide-x-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <div
            v-on="on"
            v-bind="attrs"
            class="menu-icon-wrapper"
            @click="goToPageNamed('logs')"
          >
            <Ico
              :type="
                isLogActive
                  ? 'mdi-clipboard-text-clock'
                  : 'mdi-clipboard-text-off-outline'
              "
              :color="
                currentRoute === 'Logs'
                  ? 'green lighten-4 black--text rounded'
                  : ''
              "
            />
          </div>
        </template>
        <span
          :class="
            isDarkMode
              ? 'grey--text text--lighten-2'
              : 'grey--text text--darken-2'
          "
          >Log <span class="green--text" v-if="isLogActive">(active)</span
          ><span v-else class="error--text">(inactive)</span></span
        >
      </v-tooltip>

      <v-tooltip
        right
        :color="isDarkMode ? 'black' : 'white'"
        transition="slide-x-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <div
            v-on="on"
            v-bind="attrs"
            class="menu-icon-wrapper"
            @click="goToPageNamed('dashboard')"
          >
            <Ico
              type="mdi-view-dashboard"
              :color="
                currentRoute === 'Dashboard'
                  ? 'green lighten-4 black--text rounded'
                  : ''
              "
            />
          </div>
        </template>
        <span
          :class="
            isDarkMode
              ? 'grey--text text--lighten-2'
              : 'grey--text text--darken-2'
          "
          >Dashboard</span
        >
      </v-tooltip>

      <v-tooltip
        right
        :color="isDarkMode ? 'black' : 'white'"
        transition="slide-x-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <div
            v-on="on"
            v-bind="attrs"
            class="menu-icon-wrapper"
            @click="goToPageNamed('components')"
          >
            <Ico
              type="mdi-package-variant"
              :color="
                currentRoute === 'Components'
                  ? 'green lighten-4 black--text rounded'
                  : ''
              "
            />
          </div>
        </template>
        <span
          :class="
            isDarkMode
              ? 'grey--text text--lighten-2'
              : 'grey--text text--darken-2'
          "
          >Components</span
        >
      </v-tooltip>

      <v-tooltip
        right
        :color="isDarkMode ? 'black' : 'white'"
        transition="slide-x-transition"
      >
        <template v-slot:activator="{ on, attrs }">
          <div
            v-on="on"
            v-bind="attrs"
            class="menu-icon-wrapper"
            @click="goToPageNamed('settings')"
          >
            <Ico
              type="mdi-cog"
              :color="
                currentRoute === 'Settings'
                  ? 'green lighten-4 black--text rounded'
                  : ''
              "
            />
          </div>
        </template>
        <span
          :class="
            isDarkMode
              ? 'grey--text text--lighten-2'
              : 'grey--text text--darken-2'
          "
          >Settings</span
        >
      </v-tooltip>
      <v-switch
        :dark="isDarkMode"
        color="green"
        v-model="isDark"
        @click.prevent="toggleSetting('isDarkMode', isDark)"
        class="ml-2"
      ></v-switch>
    </v-navigation-drawer>

    <Modal
      :dialog="show"
      @close="showForm"
      title="New db entry"
      :bgColor="isDarkMode ? 'rgb(0,0,15)' : 'white'"
      borderColor="rgba(200,200,200,0.3)"
      iconTitle="mdi-database-plus"
      :textColor="isDarkMode ? 'rgb(200,200,200)' : 'rgb(100,100,100)'"
    >
      <v-card-text class="white--text mt-5">
        <v-row>
          <v-col class="col-12">
            <v-select
              :dark="isDarkMode"
              :items="entryTypes"
              label="Category"
              v-model="entryType"
            ></v-select>
          </v-col>

          <v-col class="col12">
            <v-text-field
              v-model="entryTitle"
              :dark="isDarkMode"
              label="Title"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="col12">
            <v-textarea
              :dark="isDarkMode"
              filled
              name="entry-description"
              label="Description"
              v-model="entryDescription"
            ></v-textarea>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions class="ma-2">
        <v-btn outlined class="error--text" @click="show = !show"
          ><v-icon class="mr-2">mdi-close</v-icon>CANCEL</v-btn
        >
        <v-spacer />
        <v-btn class="green" @click="saveEntry"
          ><v-icon class="mr-2">mdi-check</v-icon>SAVE</v-btn
        >
      </v-card-actions>
    </Modal>
    <div class="white--text" style="position: fixed">
      {{ items }}
    </div>
  </div>
</template>

<script>
import Ico from "@/components/Ico.vue";
import Modal from "@/components/Modal.vue";
import Vue from "vue";
import store from "@/store";
import Tooltip from "@/components/Tooltip.vue";

import api from "@/api";

export default Vue.extend({
  name: "SideBar",
  components: { Ico, Modal, Tooltip },
  data() {
    return {
      entryDescription: "",
      entryTitle: "",
      entryType: "",
      items: [],
      show: false,
      category: [],
      isDark: true,
    };
  },
  computed: {
    isDarkMode() {
      return store.state.settings.isDarkMode;
    },
    currentRoute() {
      return this.$route.name;
    },
    entryTypes() {
      return store.state.storedCategories.map((category) => category.name);
    },
    isLogActive() {
      return store.state.settings.isLogActive;
    },
    storedCategories() {
      return store.state.storedCategories || [];
    },
  },
  methods: {
    capitalizeFirstLetter(string) {
      return string[0].toUpperCase() + string.slice(1);
    },

    goToPageNamed(name) {
      if (this.currentRoute !== this.capitalizeFirstLetter(name)) {
        this.$router.push(`/${name}`);
      }
    },

    saveEntry() {
      const timeOfBirth = new Date().getTime();
      const newEntry = {
        description: this.entryDescription,
        title: this.entryTitle,
        id: timeOfBirth,
        createdAt: timeOfBirth,
        updatedAt: null,
      };

      const category = this.storedCategories.find(
        (category) => category.name === this.entryType
      );

      store
        .dispatch("ADD_ITEM_TO_CATEGORY", {
          categoryId: category.id,
          item: newEntry,
        })
        .then(() => {
          this.entryDescription = "";
          this.entryTitle = "";
          this.entryType = "";
          this.show = false;
        })
        .catch((err) => err.message);
    },
    showForm() {
      this.show = !this.show;
    },
    toggleSetting(setting, value) {
      store.commit("CHANGE_SETTING", {
        setting,
        value,
      });
      store.dispatch("UPDATE_SETTINGS", store.state.settings);
    },
  },
  created() {
    store.commit("SET_LOADING_STATE", true);
    api.getJson("category").then((res) => {
      const resData = res.data;
      store.commit("GET_CATEGORIES", resData.data || resData);
    });

    api.getJson("log").then((res) => {
      const resData = res.data;
      store.commit("GET_LOGS", resData.data || resData);
    });
    api
      .getJson("settings")
      .then((res) => {
        const resData = res.data;
        store.commit("GET_SETTINGS", resData.data || resData);
      })
      .finally(() => {
        setTimeout(() => {
          store.commit("SET_LOADING_STATE", false);
        }, 1000);
      });
  },
});
</script>

<style lang="scss" scoped>
.image-logo {
  position: fixed;
  top: 10px;
  left: 2px;
}
.menu-icon-wrapper {
  border-radius: 0 6px 6px 0;
  border-right: 1px solid transparent;
  cursor: pointer;
  padding: 10px 0;
  transition: all 0.15s ease-in-out;
  &:first-of-type {
    margin-top: 36px;
  }
  &:hover {
    background: linear-gradient(to left, transparent, rgba(0, 200, 0, 0.2));
    border-right: 1px solid greenyellow;
    i {
      color: greenyellow !important;
    }
  }
}

.v-tooltip__content {
  align-items: center;
  border-left: 1px solid greenyellow !important;
  border-radius: 6px;
  border-right: 1px solid greenyellow !important;
  display: flex;
  height: 46px;
  justify-content: center;
  &::after {
    background: greenyellow;
    content: "";
    display: block;
    height: 2px;
    left: -11px;
    position: absolute;
    width: 10px;
    animation: widen 0.2s ease-in;
  }
}

@keyframes widen {
  0% {
    opacity: 0;
    transform: scale(0, 0);
  }
  100% {
    opacity: 1;
    transform: scale(1, 1);
  }
}

.side-bar {
  z-index: 1000;
  font-family: var(--roboto);
  left: 0;
  position: fixed;
  top: 0;
  z-index: 1;
  padding-top: 70px;
}
</style>
