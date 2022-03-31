<template>
  <div>
    <h1 class="green--text text--lighten-4">
      Log
      <v-btn v-if="logs.length" @click="clearLog()" class="mt-n1 ml-4 error"
        >CLEAR ALL</v-btn
      >
      <span class="inactive-notifier error--text" v-if="!isLogActive"
        >Log is currently inactive</span
      >
    </h1>
    <div class="checkboxes">
      <template v-for="(category, i) in logCategories">
        <v-checkbox
          :dark="isDarkMode"
          :key="`cat${i}`"
          :label="category"
          :color="colors[i]"
          v-model="selectedCategory[category]"
          class="mr-5"
        ></v-checkbox>
      </template>
    </div>
    <div elevation="16" class="mx-auto log-scroll-card">
      <v-virtual-scroll
        class="log-scroll"
        :bench="benched"
        :items="logs"
        item-height="80"
      >
        <template v-slot:default="{ item }">
          <v-btn
            @click="deleteLogItem(item.id)"
            outlined
            absolute
            top
            left
            height="23"
            width="23"
            class="mt-9 ml-9 grey--text"
            fab
            ><v-icon x-small>mdi-close</v-icon></v-btn
          >
          <v-list-item-content class="scroll-content">
            <span>
              <v-icon :class="`${getColor(item.type)} mr-2 mt-n1`">{{
                getIcon(item.type)
              }}</v-icon>
              <span :class="getColor(item.type)">{{
                new Date(item.logDate).toLocaleDateString()
              }}</span>

              {{ item.type }}
              <strong>{{
                item.item.name ? item.item.name : item.item.title
              }}</strong>
              {{ item.item.title ? "in category" : "" }}
              <strong>{{ item.item.title ? item.category : "" }}</strong>
              <small class="scroll-items-details" v-if="item.item.title">
                <br />
                Created :
                {{ new Date(item.item.createdAt).toLocaleDateString() }}
                <br />
                Description: {{ item.item.description }}
              </small>
            </span>
          </v-list-item-content>
        </template>
      </v-virtual-scroll>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import store from "@/store";

// TODO: add checkboxes to show only selected log categories

export default Vue.extend({
  name: "Logs",
  components: {},
  data() {
    return {
      benched: 10,
      selectedCategory: {
        update_item: true,
        delete_item: true,
        create_item: true,
        create_category: true,
        delete_category: true,
      },
    };
  },
  computed: {
    colors() {
      return ["warning", "error", "green", "green", "error"];
    },
    isDarkMode() {
      return store.state.settings.isDarkMode;
    },
    isLogActive() {
      return store.state.settings.isLogActive;
    },
    logCategories() {
      return [
        "update_item",
        "delete_item",
        "create_item",
        "create_category",
        "delete_category",
      ];
    },
    logs() {
      const storedLogs = [...(store.state.storedLogs || [])];
      const formattedCategories = Object.keys(this.selectedCategory).map(
        (cat) => cat.replace("_", " ")
      );

      const selectedCategories = Object.keys(this.selectedCategory)
        .filter((key) => {
          return this.selectedCategory[key] === true;
        })
        .map((cat) => cat.replace("_", " "));

      return storedLogs
        .filter((log) => {
          return selectedCategories.includes(log.type);
        })
        .sort((a, b) => {
          return b.logDate - a.logDate;
        });
    },
  },
  methods: {
    clearLog() {
      store.dispatch("CLEAR_LOG");
    },
    deleteLogItem(itemId) {
      store.dispatch("DELETE_LOG_ITEM", itemId);
    },
    getIcon(itemType) {
      switch (itemType) {
        case "update item":
          return "mdi-update";
        case "delete item":
          return "mdi-delete-forever-outline";
        case "create item":
          return "mdi-folder-plus-outline";
        case "create category":
          return "mdi-sitemap";
        case "delete category":
          return "mdi-delete-forever-outline";
        default:
          return;
      }
    },
    getColor(itemType) {
      const col = this.colors;
      switch (itemType.replace("_", " ")) {
        case "update item":
          return `${col[0]}--text`;
        case "delete item":
          return `${col[1]}--text`;
        case "create item":
          return `${col[2]}--text`;
        case "create category":
          return `${col[3]}--text`;
        case "delete category":
          return `${col[4]}--text`;
        default:
          return;
      }
    },
  },
});
</script>

<style lang="scss" scoped>
.checkboxes {
  display: flex;
  flex-direction: row;
  padding-left: 78px;
}
.log-scroll-card {
  padding-left: 56px;
  background: transparent;
  color: grey;
}
.log-scroll {
  height: calc(100vh - 200px);
  direction: rtl;
  overflow: auto;
  &::-webkit-scrollbar {
    background: transparent;
    width: 12px;
  }
  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 5px grey;
    border-radius: 10px;
    width: 10px;
  }
  &::-webkit-scrollbar-thumb {
    background: radial-gradient(transparent, green);
    border-radius: 20px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  }
}
.scroll-content {
  direction: ltr;
  text-align: left;
  margin-left: 90px;
}
.scroll-items-details {
  display: block;
  margin-left: 28px;
  margin-top: -10px;
  font-size: 0.65em;
}
h1 {
  text-align: left;
  margin-left: 80px;
  margin-top: 15px;
  display: flex;
  align-items: center;
}
.inactive-notifier {
  font-size: 0.6em;
  padding: 4px 30px;
  animation: blink 1s infinite linear;
}
@keyframes blink {
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
</style>
