const fs = require('fs')
const path = require('path')
const Felid = require('felid')

const app = new Felid()

app.plugin(require('felid-serve'), {
  root: path.resolve(__dirname, '../static'),
})
app.plugin(require('felid-handlebars'), {
  root: path.resolve(__dirname, 'views'),
  onInit (hbs) {
    const partialPath = path.resolve(__dirname, 'views/partials')
    const files = fs.readdirSync(partialPath).filter(f => f.endsWith('.hbs'))
    files.forEach(file => {
      hbs.registerPartial(file.split('.hbs')[0], fs.readFileSync(path.resolve(partialPath, file), 'utf8'))
    })
  }
})

app.get('/public/*', (req, res) => {
  res.serve(req.params['*'])
})

app.get('/', (req, res) => {
  res.render('index.hbs', {
    logoPath: 'public/logo.svg',
    title: 'Felid Now'
  })
})

app.get('/wasm/:path', (req, res) => {
  res.render('wasm.hbs', {
    path: req.params.path
  })
})

app.get('/:path', (req, res) => {
  res.render('path.hbs', {
    path: req.params.path
  })
})

module.exports = app.lookup()
