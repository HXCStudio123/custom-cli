const Metalsmith = require('metalsmith')
const Handlebars = require('handlebars')
const rm = require('rimraf').sync

module.exports = function (context) {
  let metadata= context.metadata
  let src = context.downloadTemp
  let dest = './' + context.root
  // console.log(metadata, src, dest)

  if (!src) {
    return Promise.reject(new Error(`无效的source：${src}`))
  }
  
  return new Promise((resolve, reject) => {
    const metals = Metalsmith(process.cwd())
      .metadata(metadata)
      .clean(false)
      .source(src)
      .destination(dest)
    // 判断下载的项目模板中是否有templates.ignore
    // const ignoreFile = path.resolve(process.cwd(), path.join(src, 'templates.ignore'))

    metals.use((files, metalsmith, done) => {
      const meta = metalsmith.metadata()
      // console.log(files)
      Object.keys(files).forEach(fileName => {
        const t = files[fileName].contents.toString()
        console.log('t', t)
        files[fileName].contents = new Buffer(Handlebars.compile(t)(meta))
      })
      done()
      }).build(err => {
      	rm(src)
      	err ? reject(err) : resolve()
      })
  })
}