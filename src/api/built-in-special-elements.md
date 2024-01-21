# Встроенные специальные элементы{#built-in-special-elements}

:::info Не компоненты
`<component>` и `<slot>` являются компонентоподобными функциями и частью синтаксиса шаблона. Они не являются настоящими компонентами и удаляются при компиляции шаблона. Поэтому в шаблонах их принято писать со строчной буквы.
:::

## `<component>` {#component}

«Мета-компонент» для отрисовки динамических компонентов.

- **Входные параметры**

  ```ts
  interface DynamicComponentProps {
    is: string | Component
  }
  ```

- **Подробности**

  - Фактический компонент, который будет отображаться, определяется параметром `is`.

  - Когда `is` является строкой, это может быть либо имя HTML-тега, либо зарегистрированное имя компонента.

  - Кроме того, `is` может быть непосредственно связано с определением компонента.

- **Пример**

  Рендеринг компонентов по зарегистрированному имени (Options API):

  ```vue
  <script>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'

  export default {
    components: { Foo, Bar },
    data() {
      return {
        view: 'Foo'
      }
    }
  }
  </script>

  <template>
    <component :is="view" />
  </template>
  ```

  Рендеринг компонентов по определению (Composition API с `<script setup>`):

  ```vue
  <script setup>
  import Foo from './Foo.vue'
  import Bar from './Bar.vue'
  </script>

  <template>
    <component :is="Math.random() > 0.5 ? Foo : Bar" />
  </template>
  ```

  Рендеринг HTML-элементов:

  ```vue-html
  <component :is="href ? 'a' : 'span'"></component>
  ```

  Все [встроенные компоненты](./built-in-components) могут быть переданы в `is`, но их необходимо зарегистрировать, если хотите передать их по имени. Например:

  ```vue
  <script>
  import { Transition, TransitionGroup } from 'vue'

  export default {
    components: {
      Transition,
      TransitionGroup
    }
  }
  </script>

  <template>
    <component :is="isGroup ? 'TransitionGroup' : 'Transition'">
      ...
    </component>
  </template>
  ```

  Регистрация не требуется, если передаете сам компонент в `is`, а не его имя, например, в `<script setup>`.

  Если `v-model` используется в теге `<component>`, компилятор шаблона расширит его до входного параметра `modelValue` и прослушивателя событий `update:modelValue`, как и для любого другого компонента. Однако это не будет совместимо с собственными HTML-элементами, такими как `<input>` или `<select>`. В результате использование `v-model` с динамически созданным собственным элементом не будет работать:

  ```vue
  <script setup>
  import { ref } from 'vue'

  const tag = ref('input')
  const username = ref('')
  </script>

  <template>
    <!-- ЭТО НЕ СРАБОТАЕТ, так как 'input' является собственным элементом HTML -->
    <component :is="tag" v-model="username" />
  </template>
  ```

  На практике этот крайний случай встречается нечасто, поскольку в реальных приложениях нативные поля форм обычно оборачиваются в компоненты. Если необходимо использовать нативный элемент напрямую, то можно разделить `v-model` на атрибут и событие вручную.

- **См. также** [Динамические компоненты](/guide/essentials/component-basics#dynamic-components)

## `<slot>` {#slot}

Обозначает выходы содержимого слотов в шаблонах.

- **Входные параметры**

  ```ts
  interface SlotProps {
    /**
     * Любые реквизиты, переданные в <slot>, передаются в качестве аргументов
     * для слотов с ограниченным пространством
     */
    [key: string]: any
    /**
     * Зарезервировано для указания имени слота.
     */
    name?: string
  }
  ```

- **Подробности**

  Элемент `<slot>` может использовать атрибут `name` для указания имени слота. Если `name` не указано, он отобразит слот по умолчанию. Дополнительные атрибуты, переданные элементу slot, будут переданы в качестве реквизита слота в слот с ограниченной областью действия, определенный в родительском элементе.

  Сам элемент будет заменен соответствующим содержимым слота.

  Элементы `<slot>` в шаблонах Vue скомпилированы в JavaScript, поэтому их не следует путать с [собственными элементами `<slot>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot ).

- **См. также** [Компонент - Слоты](/guide/components/slots)

## `<template>` {#template}

The `<template>` tag is used as a placeholder when we want to use a built-in directive without rendering an element in the DOM.

- **Details**

  The special handling for `<template>` is only triggered if it is used with one of these directives:

  - `v-if`, `v-else-if`, or `v-else`
  - `v-for`
  - `v-slot`

  If none of those directives are present then it will be rendered as a [native `<template>` element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/template) instead.

  A `<template>` with a `v-for` can also have a [`key` attribute](/api/built-in-special-attributes#key). All other attributes and directives will be discarded, as they aren't meaningful without a corresponding element.

  Single-file components use a [top-level `<template>` tag](/api/sfc-spec#language-blocks) to wrap the entire template. That usage is separate from the use of `<template>` described above. That top-level tag is not part of the template itself and doesn't support template syntax, such as directives.

- **See also**
  - [Guide - `v-if` on `<template>`](/guide/essentials/conditional#v-if-on-template)
  - [Guide - `v-for` on `<template>`](/guide/essentials/list#v-for-on-template)
  - [Guide - Named slots](/guide/components/slots#named-slots)
