#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')

const inquirer = require('inquirer')
const shell = require('shelljs')
const chalkPipe = require('chalk-pipe')

console.log('chalkPipe', chalkPipe)

let folderName = './__create-vite-app'
let folderSet = false

if (process.argv.length >= 3) {
  folderName = process.argv?.[2]
  folderSet = true
}

const prompts = [
  {
    type: 'input',
    message: () => chalkPipe('green.bold')('Target folder name:'),
    name: 'folderName',
    default: folderName,
    transformer(text) {
      return chalkPipe('blue.bold')(text)
    },
  },
  {
    type: 'list',
    message: () => chalkPipe('green.bold')('Package installer:'),
    name: 'installer',
    choices: ['npm', 'yarn'],
    default: 'npm',
    transformer(text) {
      return chalkPipe('blue.bold')(text)
    },
  },
]

if (folderSet) {
  prompts.shift()
}

(async function () {
  const answers = await inquirer.prompt(prompts)

  if (answers.folderName) {
    folderName = answers.folderName
  }
  // folder
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName)
  }

  shell.exec(`git clone https://github.com/edgar0011/core-vite.git ${folderName}`)

  shell.cd(folderName)

  // TODO inquirer npm or yarn
  shell.exec(`${answers.installer} install`, { silent: false }, function(code, stdout, stderr) {
    if (stderr) {
      console.error(stderr)
    }
    console.log(stdout)
  })
}())
