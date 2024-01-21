# Условная отрисовка {#conditional-rendering}

<div class="options-api">
  <VueSchoolLink href="https://vueschool.io/lessons/conditional-rendering-in-vue-3" title="Бесплатный урок про условную отрисовку во Vue.js"/>
</div>

<div class="composition-api">
  <VueSchoolLink href="https://vueschool.io/lessons/vue-fundamentals-capi-conditionals-in-vue" title="Бесплатный урок про условную отрисовку во Vue.js"/>
</div>

<script setup>
import { ref } from 'vue'
const awesome = ref(true)
</script>

## `v-if` {#v-if}

Для отрисовки блока по условию используется директива `v-if`. Блок будет отображаться только в случае, если выражение директивы возвращает значение, которое приводится к `true`.

```vue-html
<h1 v-if="awesome">Vue восхитителен!</h1>
```

## `v-else` {#v-else}

Для указания блока «иначе» для `v-if` можно использовать директиву `v-else`:

```vue-html
<button @click="awesome = !awesome">Переключить</button>

<h1 v-if="awesome">Vue восхитителен!</h1>
<h1 v-else>О, нет 😢</h1>
```

<div class="demo">
  <button @click="awesome = !awesome">Переключить</button>
  <h1 v-if="awesome">Vue восхитителен!</h1>
  <h1 v-else>О, нет 😢</h1>
</div>

<div class="composition-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNpFjkEOgjAQRa8ydIMulLA1hegJ3LnqBskAjdA27RQXhHu4M/GEHsEiKLv5mfdf/sBOxux7j+zAuCutNAQOyZtcKNkZbQkGsFjBCJXVHcQBjYUSqtTKERR3dLpDyCZmQ9bjViiezKKgCIGwM21BGBIAv3oireBYtrK8ZYKtgmg5BctJ13WLPJnhr0YQb1Lod7JaS4G8eATpfjMinjTphC8wtg7zcwNKw/v5eC1fnvwnsfEDwaha7w==)

</div>
<div class="options-api">

[Попробовать в песочнице](https://play.vuejs.org/#eNpFjj0OwjAMha9iMsEAFWuVVnACNqYsoXV/RJpEqVOQqt6DDYkTcgRSWoplWX7y56fXs6O1u84jixlvM1dbSoXGuzWOIMdCekXQCw2QS5LrzbQLckje6VEJglDyhq1pMAZyHidkGG9hhObRYh0EYWOVJAwKgF88kdFwyFSdXRPBZidIYDWvgqVkylIhjyb4ayOIV3votnXxfwrk2SPU7S/PikfVfsRnGFWL6akCbeD9fLzmK4+WSGz4AA5dYQY=)

</div>

Элемент с директивой `v-else` должен следовать сразу за элементом с директивой `v-if` или `v-else-if` — иначе он не будет распознан.

## `v-else-if` {#v-else-if}

Как следует из названия, `v-else-if` служит в качестве блока «else if» директивы `v-if`. Её можно использовать для создания цепочек из условий:

```vue-html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Точно не A, B или C
</div>
```

Как и `v-else`, `v-else-if` должен следовать сразу за элементом с `v-if` или `v-else-if`.

## Условные группы с помощью `v-if` и `<template>` {#v-if-on-template}

Поскольку `v-if` является директивой, то она должна быть указана на одном элементе. Но что если потребуется управлять отображением сразу нескольких элементов? В этом случае можно использовать `v-if` на элементе `<template>`, который работает как невидимая обёртка и в результатах отрисовки не появится.

```vue-html
<template v-if="ok">
  <h1>Заголовок</h1>
  <p>Параграф 1</p>
  <p>Параграф 2</p>
</template>
```

Директивы `v-else` и `v-else-if` также можно использовать на `<template>`.

## `v-show` {#v-show}

Ещё одним вариантом условного отображения является директива `v-show`. Используется очень похоже:

```vue-html
<h1 v-show="ok">Привет!</h1>
```

Отличия в том, что элемент с `v-show` будет всегда отрисовываться и оставаться в DOM, а переключаться будет лишь его CSS свойство `display`.

`v-show` нельзя использовать на элементе `<template>` и она не работает с `v-else`.

## `v-if` или `v-show` {#v-if-vs-v-show}

`v-if` выполняет «настоящую» условную отрисовку, так как гарантирует, что слушатели событий и дочерние компоненты внутри блока должным образом уничтожаются и воссоздаются при переключениях условия.

`v-if` также **ленивый**: если условие ложно на момент первоначальной отрисовки, то он ничего не сделает — условный блок не будет отрисован до тех пор, пока условие не станет истинным.

Для сравнения, `v-show` намного проще — элемент всегда отрисовывается, вне зависимости от исходного состояния с переключением на основе CSS.

В целом, у `v-if` выше затраты на переключение, в то время как `v-show` имеет больше затрат на первичную отрисовку. Так что используйте `v-show`, если переключения будут частыми, и предпочитайте `v-if`, если условие может и не измениться во время исполнения.

## `v-if` вместе с `v-for` {#v-if-with-v-for}

:::warning Примечание
Совместное использование `v-if` и `v-for` **не рекомендуется**. Подробнее можно прочитать в разделе [рекомендаций](/style-guide/rules-essential#avoid-v-if-with-v-for).
:::

При одновременном использовании `v-if` и `v-for` на одном элементе, `v-if` будет исполняться первым. Подробнее в разделе [отрисовки списков](list#v-for-with-v-if).
