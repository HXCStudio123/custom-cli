#!/usr/bin/env node

const program = require('commander')  // npm i commander -D

program.version('1.0.0')
	.usage('<command> [项目名称]')
  .command('init', '创建新项目')
  .command('hello', '测试hello')
	.parse(process.argv)

