<template>
  <div>
    <v-navigation-drawer class="side-bar" permanent mini-variant>
      <img class="image-logo" src="../assets/logo.png" height="50px" />
      <v-tooltip right color="black" transition="slide-x-transition">
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
        <span class="grey--text text--lighten-2">Add new item</span>
      </v-tooltip>

      <v-tooltip right color="black" transition="slide-x-transition">
        <template v-slot:activator="{ on, attrs }">
          <div
            v-on="on"
            v-bind="attrs"
            class="menu-icon-wrapper"
            @click="goToPageNamed('categories')"
          >
            <Ico
              type="mdi-format-list-text"
              :color="
                currentRoute === 'Categories'
                  ? 'green lighten-4 black--text rounded'
                  : ''
              "
            />
          </div>
        </template>
        <span class="grey--text text--lighten-2">Record</span>
      </v-tooltip>

      <v-tooltip right color="black" transition="slide-x-transition">
        <template v-slot:activator="{ on, attrs }">
          <div
            v-on="on"
            v-bind="attrs"
            class="menu-icon-wrapper"
            @click="goToPageNamed('logs')"
          >
            <Ico
              type="mdi-clipboard-text-clock"
              :color="
                currentRoute === 'Logs'
                  ? 'green lighten-4 black--text rounded'
                  : ''
              "
            />
          </div>
        </template>
        <span class="grey--text text--lighten-2">Log</span>
      </v-tooltip>

      <v-tooltip right color="black" transition="slide-x-transition">
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
        <span class="grey--text text--lighten-2">Dashboard</span>
      </v-tooltip>

      <v-tooltip right color="black" transition="slide-x-transition">
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
        <span class="grey--text text--lighten-2">Settings</span>
      </v-tooltip>
    </v-navigation-drawer>

    <Modal
      :dialog="show"
      @close="showForm"
      title="New db entry"
      bgColor="rgb(10,10,10)"
      borderColor="rgba(200,200,200,0.3)"
      iconTitle="mdi-database-plus"
      textColor="rgb(200,200,200)"
    >
      <v-card-text class="white--text mt-5">
        <v-row>
          <v-col class="col-12">
            <v-select
              dark
              :items="entryTypes"
              label="Category"
              v-model="entryType"
            ></v-select>
          </v-col>

          <v-col class="col12">
            <v-text-field
              v-model="entryTitle"
              dark
              label="Title"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col class="col12">
            <v-textarea
              dark
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
import { getJson } from "@/api/json.js";

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
    };
  },
  computed: {
    currentRoute() {
      return this.$route.name;
    },
    entryTypes() {
      return store.state.storedCategories.map((category) => category.name);
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
  },
  created() {
    api.getJson("category").then((res) => {
      const resData = res.data;
      if (resData.data) {
        store.commit("GET_CATEGORIES", resData.data);
      } else {
        store.commit("GET_CATEGORIES", resData);
      }
    });
    api.getJson("log").then((res) => {
      const resData = res.data;
      if (resData.data) {
        store.commit("GET_LOGS", resData.data);
      } else {
        store.commit("GET_LOGS", resData);
      }
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
  background: rgb(0, 0, 14);
  border-right: 1px solid rgba(255, 255, 255, 0.137);
  font-family: var(--roboto);
  left: 0;
  position: fixed;
  top: 0;
  z-index: 1;
  padding-top: 70px;
}
</style>
