<template>
  <div>
    <div
      class="dragrid__chooser"
      @dragenter="dragEnter($event)"
      @dragover="dragOver($event)"
      @drop="drop($event)"
      id="chooser"
    >
      <div
        draggable="true"
        class="dragrid__draggable-item"
        @dragstart="dragStart($event)"
        @drag="dragging($event)"
        @dragend="dragEnd($event)"
        id="01"
      >
        !
      </div>
      <div
        draggable="true"
        class="dragrid__draggable-item"
        @dragstart="dragStart($event)"
        @drag="dragging($event)"
        @dragend="dragEnd($event)"
        id="02"
      >
        ?
      </div>
    </div>
    <div class="dragrid">
      <div
        v-for="(dropzone, i) in 100"
        :key="`dropzone_${i}`"
        class="dragrid__drop-zone"
        @dragenter="dragEnter($event)"
        @dragover="dragOver($event)"
        @drop="drop($event)"
      ></div>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
export default Vue.extend({
  name: "DraGrid",
  components: {},
  data() {
    return {
      draggingId: null,
      mouseX: 0,
      mouseY: 0,
      dropX: 0,
      dropY: 0,
      draggedElement: null,
      dropZone: null,
    };
  },
  computed: {
    chooser() {
      return document.getElementById("chooser");
    },
    dropZones() {
      const dropZones = [];
      for (let x = 0; x < 400; x += 1) {
        for (let y = 0; y < 400; y += 1) {
          dropZones.push({ x, y, available: true });
        }
      }
      return dropZones;
    },
  },
  methods: {
    dragStart(e) {
      const { dataTransfer, clientX, clientY } = e;
      dataTransfer.effectAllowed = "copy";
      dataTransfer.setData("text", e.target.id);
      this.draggingId = e.target.id;
      this.draggedElement = e.target;
    },
    dragging(e) {
      this.draggedElement.style.position = "fixed";
      this.draggedElement.style.top = `${e.clientY}px`;
      this.draggedElement.style.left = `${e.clientX}px`;
      this.draggedElement.style.visibility = "hidden";
      e.preventDefault();
    },
    dragEnd(e) {},
    dragEnter(e) {
      e.preventDefault();
    },
    dragOver(e) {
      this.dropX = e.offsetX;
      this.dropY = e.offsetY;
      e.preventDefault();
    },
    drop(e) {
      e.preventDefault();
      e.dataTransfer.dropEffect = "move";

      let { height, width } = this.draggedElement.getBoundingClientRect();
      height = this.dropY - height / 2;
      width = this.dropX - width / 2;
      this.draggedElement.style.position = "absolute";
      const position = this.dropZones.find(
        (zone) => zone.x === width && zone.y === height
      );

      if (!position || !position.available) {
        this.draggedElement.style.visibility = "initial";
        this.draggedElement.style.top = "0px";
        this.draggedElement.style.left = "0px";

        console.log("ERROR", this.draggedElement);
        this.chooser.appendChild(this.draggedElement);
        return;
      } else {
        e.target.appendChild(this.draggedElement);
      }
      this.dropZone = e.target;
      if (this.dropZone.id === e.target.id) {
        this.styleDropZone(e.target);
      }

      //   this.dropZones.forEach((zone) => {
      //     if (zone.y === height && zone.x === width) {
      //       zone.available = false;
      //     }
      //     if (
      //       zone.y >= height &&
      //       zone.y < this.dropY + height &&
      //       zone.x >= width &&
      //       zone.x < this.dropX + width
      //     ) {
      //       zone.available = false;
      //     } else {
      //       zone.available = true;
      //     }
      //   });
      this.draggedElement.style.top = `${3}px`;
      this.draggedElement.style.left = `${3}px`;
      this.draggedElement.style.visibility = "initial";
      //   this.draggedElement.classList.add("dragrid__dropped-item");
      this.draggedElement = null;
      this.draggingId = null;
    },
    styleDropZone(target) {
      target.style.background = `rgba(255, 0, 0, 0.2)`;
    },
  },
});
</script>

<style lang="scss" scoped>
.hide {
  display: none;
}
.dragrid {
  width: 400px;
  height: 400px;
  border: 1px solid grey;
  margin: 0 auto;
  position: relative;
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  grid-template-rows: repeat(10, 1fr);
  &__chooser {
    height: 100px;
    width: 400px;
    margin-bottom: 12px;
    border: 1px dashed red;
    margin: 0 auto;
    padding: 3px;
    position: relative;
  }
  &__draggable-item {
    display: block;
    height: 30px;
    width: 30px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 3px;
  }
  &__drop-unit {
    display: block;
    height: 100%;
    width: 100%;
    border: 1px solid rgba(128, 128, 128, 0.226);
  }
  &__dropped-item {
    resize: both;
    overflow: auto;
  }
  &__drop-zone {
    display: block;
    position: relative;
    height: 40px;
    width: 40px;
    border: 1px solid grey;
    overflow: visible;
  }
}
.occupancy {
  display: block;
  position: absolute;
  height: 1px;
  width: 1px;
  background: white;
}
</style>
