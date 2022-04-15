# template-vite-vue2-vuetify

`Vite + Vue 2 + Vuex + Vue Router + Vuetify`

## Start

```bash
npx degit slime7/template-vite-vue2-vuetify my-project
```

```bash
yarn dev # start dev server
yarn build # build for production
yarn serve # locally preview production build
```

## WaffleChart.vue API

### series (array)

```
 [
    {
     color: string,
     name: string,
     quantity: number,
     total: number,
     value: number
    }
 ]
```

**color (string)**
All types of color inputs are accepted

**name (string)**
Name of each series

**quantity (number)**
Absolute value of each serie

**total (number)**
Total of all absolute values

**value (number)**
Proportion of each series to total

### funky (boolean, default false)

Adds a funky zoom animation when hovering on legends

### gradient (boolean, default false)

Adds radial gradients to squares and legend markers

### showLabels (boolean, default true)

Show datalabels inside the chart

### tooltip (boolean, default true)

Show tooltip on hovering the waffle
