# Хуки жизненного цикла {#lifecycle-hooks}

При создании каждый экземпляр проходит через серию шагов инициализации — устанавливает наблюдение за данными, компилирует шаблон, монтирует экземпляр в DOM, обновляет DOM при изменении данных. Между шагами вызываются функции, называемые **хуками жизненного цикла**, предоставляющие возможность выполнять код на определённых этапах.

## Регистрация хуков жизненного цикла {#registering-lifecycle-hooks}

Например, хук <span class="composition-api">`onMounted`</span><span class="options-api">`mounted`</span> можно использовать для запуска кода после того, как компонент завершил первоначальную отрисовку и создал узлы в DOM:

<div class="composition-api">

```vue
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log(`компонент теперь примонтирован.`)
})
</script>
```

</div>
<div class="options-api">

```js
export default {
  mounted() {
    console.log(`компонент теперь примонтирован.`)
  }
}
```

</div>

Также есть и другие хуки, которые будут вызываться на различных этапах жизненного цикла экземпляра, например <span class="composition-api">[`onMounted`](/api/composition-api-lifecycle#onmounted), [`onUpdated`](/api/composition-api-lifecycle#onupdated) и [`onUnmounted`](/api/composition-api-lifecycle#onunmounted).</span><span class="options-api">[`mounted`](/api/options-lifecycle#mounted), [`updated`](/api/options-lifecycle#updated) и [`unmounted`](/api/options-lifecycle#unmounted).</span>

<div class="options-api">

Все хуки вызываются с контекстом `this`, указывающим на текущий активный экземпляр, который их вызвал. Обратите внимание, что поэтому следует избегать использования стрелочных функций при объявлении хуков, так как в этом случае не удастся получить доступ к экземпляру компонента через `this`.

</div>

<div class="composition-api">

При вызове `onMounted` Vue автоматически связывает зарегистрированную функцию коллбэка с текущим активным экземпляром компонента. Это требует, чтобы эти хуки были зарегистрированы **синхронно** во время настройки компонента. Например, не следует делать так:

```js
setTimeout(() => {
  onMounted(() => {
    // ЭТО НЕ СРАБОТАЕТ
  })
}, 100)
```

Обратите внимание, что это не означает, что вызов должен быть размещён внутри `setup()` или `<script setup>`. `onMounted()` может быть вызван во внешней функции, если стек вызовов синхронный и происходит изнутри `setup()`.

</div>

## Диаграмма жизненного цикла {#lifecycle-diagram}

Ниже представлена диаграмма жизненного цикла экземпляра. Необязательно запоминать всё полностью прямо сейчас, но, по мере изучения и практики разработки, будет полезно к ней обращаться.

![Диаграмма жизненного цикла компонента](./images/lifecycle.png)

<!-- https://www.figma.com/file/Xw3UeNMOralY6NV7gSjWdS/Vue-Lifecycle -->

Consult the <span class="composition-api">[Lifecycle Hooks API reference](/api/composition-api-lifecycle)</span><span class="options-api">[Lifecycle Hooks API reference](/api/options-lifecycle)</span> for details on all lifecycle hooks and their respective use cases.
