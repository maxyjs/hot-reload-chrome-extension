
const reloadOptions = {
    onlyActive: true,
    shouldRunExtNameMark: '',
    reloadPinned: false
}

start()

function start() {
    chrome.management.getSelf(self => {
        if (self.installType === 'development') {
            runWatchByRules(self, reloadOptions)
        }
    })
}

function runWatchByRules(extInfo, reloadOptions) {

    const shouldWatch = detectByExtensionName(extInfo, reloadOptions)

    if (shouldWatch) {
        chrome.runtime.getPackageDirectoryEntry(dir => watchChanges(dir))
    }

    function detectByExtensionName(extInfo, reloadOptions) {
        const mark = reloadOptions.shouldRunExtNameMark
        const extName = extInfo.name
        if (mark && extName.includes(mark)) {
            console.log('Run watcher by name includes mark: ' + mark)
            return true
        }

        return false
    }
}

function watchChanges(dir) {
    watch(dir)

    function watch(dir, lastTimestamp) {
        console.log("watch tick")
        getTimestampForFilesInDirectory(dir).then(timestamp => {
            if (!lastTimestamp || (lastTimestamp === timestamp)) {

                setTimeout(() => watch(dir, timestamp), 1000)

            } else {
                reload()
            }
        })
    }
}

async function getTimestampForFilesInDirectory(dir) {
    const files = await getFilesInDirectory(dir)
    const timestampFiles = files.map(file => file.name + file.lastModifiedDate).join()
    return timestampFiles
}

async function getFilesInDirectory(dir) {
  return new Promise(get)

  async function get(callback) {
    const prepare = handleEntries.bind(null, callback)
    dir.createReader().readEntries(prepare)

    async function handleEntries(cb, entries) {
      // Step dotfiles
      const resultEntries = entries.filter(e => e.name[0] !== '.')

      const resultFiles_promises = resultEntries.map((e) => {
        return e.isDirectory
          ? getFilesInDirectory(e)
          : new Promise(resolve => e.file(resolve))
      })

      const files = await Promise.all(resultFiles_promises)

      cb(files)
    }

  }
}

function reload() {

  chrome.tabs.query({
      active: true,
      currentWindow: true
  }, tabs => {
    if (tabs[0]) {
      chrome.tabs.reload(tabs[0].id, {
          bypassCache: true
      })
    }
    chrome.runtime.reload()
  })

  if (reloadOptions.onlyActive !== true) {
      chrome.tabs.query({
          active: false,
          currentWindow: true,
          pinned: reloadOptions.reloadPinned || false
      }, tabs => {
          tabs.forEach(tab => {
              chrome.tabs.reload(tab.id, {
                  bypassCache: true
              })
          })
      })
  }

}
