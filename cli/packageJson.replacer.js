module.exports = {
  replacer: (source, folderName) => source
    .replace('"name": "coreVite"', `"name": "${folderName}"`)
    .replace('"name": "core-vite"', `"name": "${folderName}"`)
    .replace('"name": "core-vite-lite"', `"name": "${folderName}"`)
    .replace(/"version": "(.*?)"/, '"version": "1.0.0"'),
}
