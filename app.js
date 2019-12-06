var express = require('express');
var axios = require('axios');
var app = express();
app.use(express.urlencoded({ extended: true }));
var token_app = "";

app.get('/', async function (req,res) {
    const token = await axios({
        url: 'http://localhost:4567/token',
        method: 'post'
    }).then(function(token) {
        token_app = token
    }).catch(function(err){
        console.log(err)
    });
    res.redirect('/index')
});

app.get('/index', async function (req, res) {
    

    console.log(token_app.data)
    const tokenString = token_app.data.token
    console.log("token string ", tokenString)

    const response = await axios({
        url: 'http://localhost:4567/api/Admin',
        method: 'get',
        headers: {
            token: tokenString
        }
      }).catch(function(err) {
          console.log(err);
      });
    
      var urlCreadas = response.data['urlCreadas']
      
    res.render('index', {title: 'Rest App Tester', message: 'REST To Client Example', urlList: urlCreadas});
});


app.post('/shorten', async function (req,res, next) {

    // console.log(req.body)
    console.log('params',req.body.urlShorten)
    const tokenString = token_app.data.token
    const response = await axios({
        url: 'http://localhost:4567/api/',
        method: 'post',
        data: {urlOriginal:req.body.urlShorten},
        headers: {
            token: tokenString
        }
    });
    console.log(response.data)
    res.render('short_url', {short: response.data, image: response.data.iamgePreview.toString('base64')})
});

app.listen(8080, function () {
    console.log('Example app listening on port 8080!');
});

app.set('view engine', 'pug');
