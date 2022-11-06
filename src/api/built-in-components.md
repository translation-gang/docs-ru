---
pageClass: api
---

# Встроенные компоненты {#built-in-components}

:::info Регистрация и использование
Встроенные компоненты можно использовать в шаблонах без из регистрации. Так же они являются tree-shakeable: они включаются в сборку только тогда, когда они используются.

При использовании в [функции рендеринга](/guide/extras/render-function.html), они должны быть импортированы в явном виде. Например:

```js
import { h, Transition } from 'vue'

h(Transition, {
  /* props */
})
```
:::

## `<Transition>`

Provides animated transition effects to a **single** element or component.

- **Входные параметры:**

  ```ts
  interface TransitionProps {
    /**
     * Used to automatically generate transition CSS class names.
     * e.g. `name: 'fade'` will auto expand to `.fade-enter`,
     * `.fade-enter-active`, etc.
     */
    name?: string
    /**
     * Whether to apply CSS transition classes.
     * Default: true
     */
    css?: boolean
    /**
     * Specifies the type of transition events to wait for to
     * determine transition end timing.
     * Default behavior is auto detecting the type that has
     * longer duration.
     */
    type?: 'transition' | 'animation'
    /**
     * Specifies explicit durations of the transition.
     * Default behavior is wait for the first `transitionend`
     * or `animationend` event on the root transition element.
     */
    duration?: number | { enter: number; leave: number }
    /**
     * Controls the timing sequence of leaving/entering transitions.
     * Default behavior is simultaneous.
     */
    mode?: 'in-out' | 'out-in' | 'default'
    /**
     * Whether to apply transition on initial render.
     * Default: false
     */
    appear?: boolean

    /**
     * Props for customizing transition classes.
     * Use kebab-case in templates, e.g. enter-from-class="xxx"
     */
    enterFromClass?: string
    enterActiveClass?: string
    enterToClass?: string
    appearFromClass?: string
    appearActiveClass?: string
    appearToClass?: string
    leaveFromClass?: string
    leaveActiveClass?: string
    leaveToClass?: string
  }
  ```

- **События:**

  - `@before-enter`
  - `@before-leave`
  - `@enter`
  - `@leave`
  - `@appear`
  - `@after-enter`
  - `@after-leave`
  - `@after-appear`
  - `@enter-cancelled`
  - `@leave-cancelled` (`v-show` only)
  - `@appear-cancelled`

- **Пример:**

  Simple element:

  ```vue-html
  <Transition>
    <div v-if="ok">toggled content</div>
  </Transition>
  ```

  Dynamic component, with transition mode + animate on appear:

  ```vue-html
  <Transition name="fade" mode="out-in" appear>
    <component :is="view"></component>
  </Transition>
  ```

  Listening to transition events:

  ```vue-html
  <Transition @after-enter="onTransitionComplete">
    <div v-show="ok">toggled content</div>
  </Transition>
  ```

- **См. также:** [`<Transition>` Guide](/guide/built-ins/transition.html)

## `<TransitionGroup>`

Provides transition effects for **multiple** elements or components in a list.

- **Входные параметры:**

  `<TransitionGroup>` accepts the same props as `<Transition>` except `mode`, plus two additional props:

  ```ts
  interface TransitionGroupProps extends Omit<TransitionProps, 'mode'> {
    /**
     * If not defined, renders as a fragment.
     */
    tag?: string
    /**
     * For customizing the CSS class applied during move transitions.
     * Use kebab-case in templates, e.g. move-class="xxx"
     */
    moveClass?: string
  }
  ```

- **События:**

  `<TransitionGroup>` emits the same events as `<Transition>`.

- **Подробности:**

  By default, `<TransitionGroup>` doesn't render a wrapper DOM element, but one can be defined via the `tag` prop.

  Note that every child in a `<transition-group>` must be [**uniquely keyed**](/guide/essentials/list.html#maintaining-state-with-key) for the animations to work properly.

  `<TransitionGroup>` supports moving transitions via CSS transform. When a child's position on screen has changed after an update, it will get applied a moving CSS class (auto generated from the `name` attribute or configured with the `move-class` prop). If the CSS `transform` property is "transition-able" when the moving class is applied, the element will be smoothly animated to its destination using the [FLIP technique](https://aerotwist.com/blog/flip-your-animations/).

- **Пример:**

  ```vue-html
  <TransitionGroup tag="ul" name="slide">
    <li v-for="item in items" :key="item.id">
      {{ item.text }}
    </li>
  </TransitionGroup>
  ```

- **См. также:** [Guide - TransitionGroup](/guide/built-ins/transition-group.html)

## `<KeepAlive>`

Caches dynamically toggled components wrapped inside.

- **Входные параметры:**

  ```ts
  interface KeepAliveProps {
    /**
     * If specified, only components with names matched by
     * `include` will be cached.
     */
    include?: MatchPattern
    /**
     * Any component with a name matched by `exclude` will
     * not be cached.
     */
    exclude?: MatchPattern
    /**
     * The maximum number of component instances to cache.
     */
    max?: number | string
  }

  type MatchPattern = string | RegExp | (string | RegExp)[]
  ```

- **Подробности:**

  When wrapped around a dynamic component, `<KeepAlive>` caches the inactive component instances without destroying them.

  There can only be one active component instance as the direct child of `<KeepAlive>` at any time.

  When a component is toggled inside `<KeepAlive>`, its `activated` and `deactivated` lifecycle hooks will be invoked accordingly, providing an alternative to `mounted` and `unmounted`, which are not called. This applies to the direct child of `<KeepAlive>` as well as to all of its descendants.

- **Пример:**

  Basic usage:

  ```vue-html
  <KeepAlive>
    <component :is="view"></component>
  </KeepAlive>
  ```

  When used with `v-if` / `v-else` branches, there must be only one component rendered at a time:

  ```vue-html
  <KeepAlive>
    <comp-a v-if="a > 1"></comp-a>
    <comp-b v-else></comp-b>
  </KeepAlive>
  ```

  Used together with `<Transition>`:

  ```vue-html
  <Transition>
    <KeepAlive>
      <component :is="view"></component>
    </KeepAlive>
  </Transition>
  ```

  Using `include` / `exclude`:

  ```vue-html
  <!-- comma-delimited string -->
  <KeepAlive include="a,b">
    <component :is="view"></component>
  </KeepAlive>

  <!-- regex (use `v-bind`) -->
  <KeepAlive :include="/a|b/">
    <component :is="view"></component>
  </KeepAlive>

  <!-- Array (use `v-bind`) -->
  <KeepAlive :include="['a', 'b']">
    <component :is="view"></component>
  </KeepAlive>
  ```

  Usage with `max`:

  ```vue-html
  <KeepAlive :max="10">
    <component :is="view"></component>
  </KeepAlive>
  ```

- **См. также:** [Guide - KeepAlive](/guide/built-ins/keep-alive.html)

## `<Teleport>`

Renders its slot content to another part of the DOM.

- **Входные параметры:**

  ```ts
  interface TeleportProps {
    /**
     * Required. Specify target container.
     * Can either be a selector or an actual element.
     */
    to: string | HTMLElement
    /**
     * When `true`, the content will remain in its original
     * location instead of moved into the target container.
     * Can be changed dynamically.
     */
    disabled?: boolean
  }
  ```

- **Пример:**

  Specifying target container:

  ```vue-html
  <teleport to="#some-id" />
  <teleport to=".some-class" />
  <teleport to="[data-teleport]" />
  ```

  Conditionally disabling:

  ```vue-html
  <teleport to="#popup" :disabled="displayVideoInline">
    <video src="./my-movie.mp4">
  </teleport>
  ```

- **См. также:** [Guide - Teleport](/guide/built-ins/teleport.html)

## `<Suspense>` <sup class="vt-badge experimental" />

Used for orchestrating nested async dependencies in a component tree.

- **Входные параметры:**

  ```ts
  interface SuspenseProps {
    timeout?: string | number
  }
  ```

- **События:**

  - `@resolve`
  - `@pending`
  - `@fallback`

- **Подробности:**

  `<Suspense>` accepts two slots: the `#default` slot and the `#fallback` slot. It will display the content of the fallback slot while rendering the default slot in memory.

  If it encounters async dependencies ([Async Components](/guide/components/async.html) and components with [`async setup()`](/guide/built-ins/suspense.html#async-setup)) while rendering the default slot, it will wait until all of them are resolved before displaying the default slot.

- **См. также:** [Guide - Suspense](/guide/built-ins/suspense.html)
