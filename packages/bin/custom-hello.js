#!/usr/bin/env node

console.log('hello, commander,我正在测试脚手架的开发')
const inquirer = require('inquirer') // 命令行交互插件

inquirer.prompt([
  {
    name: 'projectName',
    message: '脚手架名称：'
  }
]).then(res => {
  console.log('项目称：', res.projectName)
})
