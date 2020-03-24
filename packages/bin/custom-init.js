#!/usr/bin/env node

const program = require('commander')
const path = require('path')
const fs = require('fs')
const glob = require('glob') // npm i glob -D
const inquirer = require('inquirer') // 命令行交互插件
const latestVersions = require('latest-version') // 获取node包的最新版本
// 美化
const chalk = require('chalk')
const logSymbols = require('log-symbols')
// lib
const download = require('../lib/download')
const generator = require('../lib/generator')

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
let next = undefined

if (list.length) {  // 如果当前目录不为空
  if (list.filter(name => {
    const fileName = path.resolve(process.cwd(), path.join('.', name))
    const isDir = fs.statSync(fileName).isDirectory()
    return name.indexOf(projectName) !== -1 && isDir
  }).length !== 0) {
    console.log(`项目${projectName}已经存在`)
    return
  }
  next = Promise.resolve(projectName)
} else if (rootName === projectName) {
  // rootName = '.'
  next = inquirer.prompt([
    {
      name: 'buildInCurrent',
      message: '当前目录为空，且目录名称和项目名称相同，是否直接在当前目录下创建新项目？',
      type: 'confirm',
      default: true
    }
  ]).then(res => {
    return Promise.resolve(res.buildInCurrent ? '.' : projectName)
  })
} else {
  // rootName = projectName
  next = Promise.resolve(projectName)
}

// 预处理
next && go()

function go () {
  // 预留，处理子命令  

  // next.then(root => {
  //   if (root !== '.') {
  //     fs.mkdirSync(root)
  //   }
  //   download(root)
  //     .then(target => console.log(target))
  //     .catch(error => console.log(error))
  // })
  next
    // 先确定是哪一个文件夹中创建
    .then(root => {
      if (root !== '.') {
        // 同步创建目录，在当前文件夹下创建目录
        fs.mkdirSync(root)
      }
      return download(root).then(target => {
        // 返回下一级当前对象信息
        return {
          name: root,
          root,
          downloadTemp: target
        }
      })
    })
    // 
    .then(context => {
      // 获取数据后进行二次输入, 输入版本
      return inquirer.prompt([
        {
          name: 'name',
          message: '项目名称: ',
          default: context.name
        }, {
          name: 'version',
          message: '项目版本号: ',
          default: '1.0.0'
        }, {
          name: 'description',
          message: '项目介绍: ',
          default: `A project named ${context.name}`
        }
      ]).then(res => {
        return {
          ...context,
          metadata: {
            ...res
          }
        }
      })
    })
    // .then(context => {
    //   // 添加生成的逻辑
    //   // 删除临时文件夹，将文件移动到目标目录下
    //   return generator(context)
    // })
    .then(context => {
      console.log(logSymbols.success, chalk.green('创建成功:)'))
      console.log()
      console.log(chalk.green('cd ' + context.name + '\nnpm install\nnpm run dev'))
    })
    .catch(err => {
      console.log(err);
      console.error(logSymbols.error, chalk.red(`创建失败：${err.message}`))
    })
}
