# Hot reload Chrome Extension
Watcher, hot reload, monitoring changes in the development of Google Chrome extensions.

## How To Use

1. Drop hot-reloader.js to your extension's directory.

2. Put the following into your `manifest.json` file:

```json
"background": { 
  "scripts": ["hot-reloader.js"] 
  }
```