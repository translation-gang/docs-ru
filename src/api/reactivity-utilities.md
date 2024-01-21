# Reactivity API: Утилиты {#reactivity-api-utilities}

## isRef() {#isref}

Проверяет, является ли значение объектом ref.

- **Тип**

  ```ts
  function isRef<T>(r: Ref<T> | unknown): r is Ref<T>
  ```

  Обратите внимание, что возвращаемый тип является [предикатом типа](https://www.typescriptlang.org/docs/handbook/2/narrowing#using-type-predicates), это значит что `isRef` может быть использован в качестве type guard'a:

  ```ts
  let foo: unknown
  if (isRef(foo)) {
    // тип foo уточняется до Ref<unknown>
    foo.value
  }
  ```

## unref() {#unref}

Возвращает внутреннее значение, если аргумент является ref-ссылкой, в противном случае возвращает сам аргумент. Это вспомогательная функция для `val = isRef(val) ? val.value : val`.

- **Тип**

  ```ts
  function unref<T>(ref: T | Ref<T>): T
  ```

- **Пример**

  ```ts
  function useFoo(x: number | Ref<number>) {
    const unwrapped = unref(x)
    // unwrapped теперь гарантированно будет иметь числовой тип
  }
  ```

## toRef() {#toref}

Can be used to normalize values / refs / getters into refs (3.3+).

Может использоваться для создания ссылки на свойство исходного реактивного объекта. Созданная ref-ссылка синхронизируется с входными параметрами источника: изменение входных параметров источника приведет к обновлению ссылки, и наоборот.

- **Тип**

  ```ts
  // normalization signature (3.3+)
  function toRef<T>(
    value: T
  ): T extends () => infer R
    ? Readonly<Ref<R>>
    : T extends Ref
    ? T
    : Ref<UnwrapRef<T>>

  // object property signature
  function toRef<T extends object, K extends keyof T>(
    object: T,
    key: K,
    defaultValue?: T[K]
  ): ToRef<T[K]>

  type ToRef<T> = T extends Ref ? T : Ref<T>
  ```

- **Пример**

  Normalization signature (3.3+):

  ```js
  // returns existing refs as-is
  toRef(existingRef)

  // creates a readonly ref that calls the getter on .value access
  toRef(() => props.foo)

  // creates normal refs from non-function values
  // equivalent to ref(1)
  toRef(1)
  ```

  Object property signature:

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  // a two-way ref that syncs with the original property
  const fooRef = toRef(state, 'foo')

  // мутация ref обновляет оригинал
  fooRef.value++
  console.log(state.foo) // 2

  // мутация оригинала также обновляет ref
  state.foo++
  console.log(fooRef.value) // 3
  ```

  Обратите внимание, что это отличается от:

  ```js
  const fooRef = ref(state.foo)
  ```

  Приведенная выше ref-ссылка **не синхронизируется** с `state.foo`, потому что `ref()` получает значение обыкновенного числа.

  Функция `toRef()` полезна, когда вы хотите передать ссылку входного параметра в функцию композиции:

  ```vue
  <script setup>
  import { toRef } from 'vue'

  const props = defineProps(/* ... */)

  // преобразуем `props.foo` в ссылку, и затем передаем в функцию композиции
  useSomeFeature(toRef(props, 'foo'))

  // getter syntax - recommended in 3.3+
  useSomeFeature(toRef(() => props.foo))
  </script>
  ```

  Когда `toRef` используется с входными параметрами компонента, обычные ограничения на изменение входных параметров остаются в силе. Попытка присвоить новое значение входным параметрам эквивалентна попытке изменить входные параметры напрямую, что в свою очередь - не допустимо. В этом случае вы можете рассмотреть возможность использования [`computed`](./reactivity-core#computed) с `get` и `set` вместо этого. Для получения дополнительной информации смотрите руководство по [использованию `v-model` в компонентах](/guide/components/events#usage-with-v-model).

  When using the object property signature, `toRef()` will return a usable ref even if the source property doesn't currently exist. This makes it possible to work with optional properties, which wouldn't be picked up by [`toRefs`](#torefs).

## toValue() <sup class="vt-badge" data-text="3.3+" /> {#tovalue}

Normalizes values / refs / getters to values. This is similar to [unref()](#unref), except that it also normalizes getters. If the argument is a getter, it will be invoked and its return value will be returned.

This can be used in [Composables](/guide/reusability/composables.html) to normalize an argument that can be either a value, a ref, or a getter.

- **Тип**

  ```ts
  function toValue<T>(source: T | Ref<T> | (() => T)): T
  ```

- **Example**

  ```js
  toValue(1) //       --> 1
  toValue(ref(1)) //  --> 1
  toValue(() => 1) // --> 1
  ```

  Normalizing arguments in composables:

  ```ts
  import type { MaybeRefOrGetter } from 'vue'

  function useFeature(id: MaybeRefOrGetter<number>) {
    watch(() => toValue(id), id => {
      // react to id changes
    })
  }

  // this composable supports any of the following:
  useFeature(1)
  useFeature(ref(1))
  useFeature(() => 1)
  ```

## toRefs() {#torefs}

Преобразует реактивный объект в обычный объект, где каждое свойство результирующего объекта является ref-ссылкой, указывающей на соответствующее свойство исходного объекта. Каждая отдельная ref-ссылка создается с помощью [`toRef()`](#toref).

- **Тип**

  ```ts
  function toRefs<T extends object>(
    object: T
  ): {
    [K in keyof T]: ToRef<T[K]>
  }

  type ToRef = T extends Ref ? T : Ref<T>
  ```

- **Пример**

  ```js
  const state = reactive({
    foo: 1,
    bar: 2
  })

  const stateAsRefs = toRefs(state)
  /*
  Type of stateAsRefs: {
    foo: Ref<number>,
    bar: Ref<number>
  }
  */

  // ref-ссылка и исходное свойство "связаны"
  state.foo++
  console.log(stateAsRefs.foo.value) // 2

  stateAsRefs.foo.value++
  console.log(state.foo) // 3
  ```

  `toRefs` полезно при возврате реактивного объекта из функции композиции, чтобы потребляющий компонент мог деструктурировать/распространить возвращаемый объект без потери реактивности:

  ```js
  function useFeatureX() {
    const state = reactive({
      foo: 1,
      bar: 2
    })

    // логика, работающая с состоянием

    // конвертация в ref-ссылку при возврате
    return toRefs(state)
  }

  // может быть деструктурировано без потери реактивности
  const { foo, bar } = useFeatureX()
  ```

  `toRefs` будет генерировать ссылки только для тех свойств, которые являются перечислимыми для исходного объекта на момент вызова. Чтобы создать ссылку для свойства, которое может еще не существовать, используйте [`toRef`](#toref).

## isProxy() {#isproxy}

Проверяет, является ли объект прокси, созданным с помощью [`reactive()`](./reactivity-core#reactive), [`readonly()`](./reactivity-core#readonly), [`shallowReactive()`](./reactivity-advanced#shallowreactive) или [`shallowReadonly()`](./reactivity-advanced#shallowreadonly).

- **Тип**

  ```ts
  function isProxy(value: unknown): boolean
  ```

## isReactive() {#isreactive}

Проверяет, является ли объект прокси, созданным [`reactive()`](./reactivity-core#reactive) или [`shallowReactive()`](./reactivity-advanced#shallowreactive).

- **Тип**

  ```ts
  function isReactive(value: unknown): boolean
  ```

## isReadonly() {#isreadonly}

Checks whether the passed value is a readonly object. The properties of a readonly object can change, but they can't be assigned directly via the passed object.

The proxies created by [`readonly()`](./reactivity-core#readonly) and [`shallowReadonly()`](./reactivity-advanced#shallowreadonly) are both considered readonly, as is a [`computed()`](./reactivity-core#computed) ref without a `set` function.

Прокси, созданные [`readonly()`](./reactivity-core#readonly) и [`shallowReadonly()`](./reactivity-advanced#shallowreadonly), считаются readonly, как и ref-ссылка [`computed()`](./reactivity-core#computed) без функции `set`.

- **Тип**

  ```ts
  function isReadonly(value: unknown): boolean
  ```
