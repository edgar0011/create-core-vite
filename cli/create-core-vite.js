#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs')

const fsPromises = fs.promises

const inquirer = require('inquirer')
const shell = require('shelljs')
const chalkPipe = require('chalk-pipe')

const pckReplacer = require('./packageJson.replacer').replacer

console.log('chalkPipe', chalkPipe)

let folderName = 'my-core-vite-app'
let folderSet = false

const GIT_REPO_CORE_VITE = 'git@github.com:edgar0011/core-vite.git'
const GIT_REPO_CORE_VITE_LITE = 'git@github.com:edgar0011/core-vite-lite.git'

let gitRepo = GIT_REPO_CORE_VITE

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
  {
    type: 'list',
    message: () => chalkPipe('green.bold')('Type of app:'),
    name: 'appType',
    choices: ['complex', 'lite'],
    default: 'complex',
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

  if (answers.appType === 'lite') {
    gitRepo = GIT_REPO_CORE_VITE_LITE
  }

  shell.exec(`git clone ${gitRepo} ${folderName}`)

  shell.cd(folderName)

  const pkg = await fsPromises.readFile('package.json', 'utf8')

  await fsPromises.writeFile('package.json', pckReplacer(pkg, folderName))

  console.log('Package json ', pkg)

  // TODO inquirer npm or yarn
  shell.exec(`${answers.installer} install`, { silent: false }, function(code, stdout, stderr) {
    if (stderr) {
      console.error(stderr)
    }
    console.log(stdout)
  })
}())
