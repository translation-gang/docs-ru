# Условный рендеринг {#conditional-rendering}

Мы можем использовать директиву `v-if` для условного отображения элемента:

```vue-html
<h1 v-if="awesome">Vue - это потрясающе!</h1>
```

Это `<h1>` будет отображаться только в том случае, если значение `awesome` равно [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy ). Если `awesome` изменится на значение [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy ), оно будет удалено из DOM.
Также можно использовать `v-else` и `v-else-if` для обозначения других ветвей условия:

```vue-html
<h1 v-if="awesome">Vue - это потрясающе!</h1>
<h1 v-else>О нет 😢</h1>
```

В настоящее время демонстрация показывает оба `<h1>` одновременно, а кнопка ничего не делает. Попробуйте добавить к ним директивы `v-if` и `v-else` и реализовать метод `toggle()`, чтобы можно было использовать кнопку для переключения между ними.

Подробнее о `v-if`: <a target="_blank" href="/guide/essentials/conditional.html">Руководство - Условный рендеринг</a>
