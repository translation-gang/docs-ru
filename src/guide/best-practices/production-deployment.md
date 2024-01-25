# Публикация на production {#production-deployment}

## Разработка vs. production {#development-vs-production}

В процессе разработки Vue предоставляет ряд возможностей, улучшающих опыт разработки:

- Предупреждение о распространённых ошибках и подводных камнях
- Валидация входных параметров / событий
- [Хуки для отладки реактивности](/guide/extras/reactivity-in-depth#reactivity-debugging)
- Интеграция с инструментами разработчика

Однако в production эти функции становятся бесполезными. Некоторые из проверок также могут привести к небольшим накладным расходам на производительность. При публикации в production следует отказаться от всех неиспользуемых веток кода, предназначенных только для разработки, чтобы уменьшить размер итоговой сборки и повысить производительность.

## Без инструментов для сборки {#without-build-tools}

Если вы используете Vue без инструмента сборки, загружая его из CDN или самостоятельно размещая скрипт на хостинге, при развёртывании на production обязательно используйте production сборку (файлы dist, заканчивающиеся на `.prod.js`). Production сборки предварительно минифицированы, из них удалены все ветви кода, предназначенные только для разработки.

- При использовании глобальной сборки (доступ через глобальный `Vue`): используйте `vue.global.prod.js`.
- При использовании ESM-сборки (доступ через нативные ESM-импорты): используйте `vue.esm-browser.prod.js`.

Более подробная информация приведена в [руководстве по использованию файлов dist](https://github.com/vuejs/core/tree/main/packages/vue#which-dist-file-to-use).

## С помощью инструментов сборки {#with-build-tools}

Проекты, созданные с помощью `create-vue` (на базе Vite) или Vue CLI (на базе webpack), предварительно настроены для production сборок.

При использовании собственных настроек убедитесь, что:

1. `vue` разрешается в `vue.runtime.esm-bundler.js`.
2. [Флаги функций времени компиляции](https://github.com/vuejs/core/tree/main/packages/vue#bundler-build-feature-flags) настроены должным образом.
3. <code>process.env<wbr>.NODE_ENV</code> заменяется на `"production"` во время сборки.

Дополнительные ссылки:

- [Руководство по сборке Vite для production](https://vitejs.dev/guide/build.html)
- [Руководство по развёртыванию Vite](https://vitejs.dev/guide/static-deploy.html)
- [Руководство по развёртыванию Vue CLI](https://cli.vuejs.org/guide/deployment.html)

## Отслеживание ошибок времени выполнения {#tracking-runtime-errors}

[Обработчик ошибок на уровне приложения](/api/application#app-config-errorhandler) может быть использован для сообщения об ошибках службам отслеживания:

```js
import { createApp } from 'vue'

const app = createApp(...)

app.config.errorHandler = (err, instance, info) => {
  // сообщаем об ошибке в сервис трекинга
}
```

Такие сервисы, как [Sentry](https://docs.sentry.io/platforms/javascript/guides/vue/) и [Bugsnag](https://docs.bugsnag.com/platforms/javascript/vue/), также предоставляют официальные интеграции для Vue.
