# Расширение Chrome выполняет горячую перезагрузку вкладки при изменении файлов в редакторе

При разработке расширений для Google Chrome мониторит изменения файлов расширения и выполняет перезагрузку страницы. 

## Использование:

1. Разместите hot-reloader.js в каталоге вашего расширения.
2. Включите hot-reloader.js в бэкграунд скрипты разрабатываемого расширения в файле `manifest.json`:

```json
"background": { 
  "scripts": ["hot-reloader.js"] 
  }
```