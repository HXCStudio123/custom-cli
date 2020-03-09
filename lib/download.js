#!/usr/bin/env node

const download = require('download-git-repo')
const ora = require('ora')
const path = require('path')

module.exports = function (target) {
  target = path.join(target || '.')
  return new Promise((resolve, reject) => {
    // 克隆后存放在一个临时文件夹
    const url = 'HXCStudio123/wxapp-h-template'
    const spinner = ora(`正在下载项目模板，源地址：${url}`)
    spinner.start()
    download(url, target, error => {
      // error ? reject(error) : resolve(target)
      if (error) {
        spinner.fail()
        reject(error)
      } else {
        spinner.succeed()
        resolve(target)
      }
    })
  })
}
