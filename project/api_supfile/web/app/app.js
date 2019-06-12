let express = require('express'),
    http = require('http'),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    fs = require('fs'),
    config = require(__dirname + '/config/config'),
    app = express(),
    server = http.createServer(app)

mongoose.connect(config.db.string)

app.use(cors())

app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

let publicRouter = express.Router(),
    authenticatedRouter = express.Router()

publicRouter.use(require(__dirname + '/middlewares/json-response'))
publicRouter.use(require(__dirname + '/middlewares/authentication-sign'))
authenticatedRouter.use(require(__dirname + '/middlewares/json-response'))
authenticatedRouter.use(require(__dirname + '/middlewares/authentication-verify'))

app.use('/files', express.static(__dirname + '/public/files'))
app.use(express.static(__dirname + '/apidoc', {
    index: false,
    redirect: false
}))
app.get('/apidoc', function(req, res){
    res.sendFile(__dirname + '/apidoc/index.html')
})

fs.readdirSync(__dirname + '/controllers').forEach((name) => {
    if (config.routes.public.indexOf(name.slice(0, -3)) !== -1) {
        require(__dirname + '/controllers/' + name)(publicRouter)
    } else require(__dirname + '/controllers/' + name)(authenticatedRouter)
})

app.use('/', publicRouter)
app.use('/', authenticatedRouter)

app.all('*', (req, res) => res.error('Not found', 404))
server.listen(config.app.port)
