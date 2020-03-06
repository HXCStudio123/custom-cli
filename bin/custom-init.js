#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const fs = require('fs')
const glob = require('glob') // npm i glob -D
const download = require('../lib/download')
program.usage('<project-name>').parse(process.argv)

// 根据输入，获取项目名称
let projectName = program.args ? program.args[0] : ''

if (!projectName) {  // project-name 必填
  // 相当于执行命令的--help选项，显示help信息，这是commander内置的一个命令选项
  program.help()
  return
}

// 遍历当前目录
const list = glob.sync('*')
// process.cwd() 当前文件路径
let rootName = path.basename(process.cwd())
console.log(list, rootName)

if (list.length) {  // 如果当前目录不为空
  if (list.filter(name => {
    const fileName = path.resolve(process.cwd(), path.join('.', name))
    const isDir = fs.statSync(fileName).isDirectory()
    return name.indexOf(projectName) !== -1 && isDir
  }).length !== 0) {
    console.log(`项目${projectName}已经存在`)
    return
  }
  rootName = projectName
} else if (rootName === projectName) {
  rootName = '.'
} else {
  rootName = projectName
}

// 预处理
go()

function go () {
  // 预留，处理子命令  
  console.log('输出了最终路径', path.resolve(process.cwd(), path.join('.', rootName)))
  download(rootName)
    .then(target => console.log(target))
    .catch(error => console.log(error))
}
