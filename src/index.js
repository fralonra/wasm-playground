const fs = require('fs')
const path = require('path')
const Felid = require('felid')

const globalTitle = 'Wasm Playground'

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
app.plugin((felid) => {
  felid.decorate('content', require(path.resolve(__dirname, 'content')))
})

app.use(checkPage)

app.get('/public/*', (req, res) => {
  res.serve(req.params['*'])
})

app.get('/', (req, res) => {
  res.render('index.hbs', {
    logoPath: 'public/logo.svg',
    title: globalTitle,
    content: app.content
  })
})

app.get('/wasm/:page', (req, res) => {
  res.render('wasm.hbs', {
    page: req.params.page
  })
})

app.get('/:page', (req, res) => {
  res.render('page.hbs', {
    content: res.content,
    page: res.page,
    title: `${res.content.title} - ${globalTitle}`
  })
})

if (process.env.NODE_ENV !== 'production') {
  app.listen(3000)
}

function checkPage (req, res) {
  const page = req.params.page
  if (!page) return
  const content = app.content[page]
  if (!content) {
    res.code(404).send('Not found')
    return
  }
  res.page = page
  res.content = content
}

module.exports = app.lookup()
