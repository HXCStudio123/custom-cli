#!/usr/bin/env node

const download = require('download-git-repo')
const path = require('path')
const url = 'HXCStudio123/wxapp-h-template'

module.exports = function (target) {
  target = path.join(target || '.')
  return new Promise((resolve, reject) => {
    // download 参数：git地址，本地文件地址，是否clone，是否成功
    download(url, target, error => {
      error ? reject(error) : resolve(target)
    })
  })
}
