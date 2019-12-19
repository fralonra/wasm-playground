const path = require('path')
const Felid = require('felid')

const app = new Felid()

app.plugin(require('felid-serve'), {
  root: path.resolve(__dirname, '../static'),
})
app.plugin(require('felid-handlebars'), {
  root: path.resolve(__dirname, 'views')
})

app.get('/public/:file', (req, res) => {
  res.serve(req.params.file)
})

app.get('/', (req, res) => {
  res.render('index.hbs', {
    logoPath: 'public/logo.svg',
    title: 'Felid Now'
  })
})

module.exports = app.lookup()
