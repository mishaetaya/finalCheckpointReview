var express = require('express');
var path = require('path');
var models = require('./models/index.js');
var app = express();
var session = require('express-session')
var parseurl = require('parseurl')

var Promise = require('bluebird');
var bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json 
app.use(bodyParser.json())


var db = models.db;

app.use('/files', express.static(path.join(__dirname, '/public/static')))


app.get('/broken', function(req, res){

	res.sendStatus(500);
})

app.get('/forbidden', function(req,res){
	res.sendStatus(403)
})

app.get('/api/books', function(req,res,next){

	var query = req.query;
	var isThereQuery = Object.keys(query).length ? true : false
	if(!isThereQuery) {
	models.Book.findAll({}).then(result => res.json(result)).catch(next) }
	else {
		models.Book.findOne({where: {title: query.title}}).then(data => res.json([data])).catch(next)}
})

app.post('/api/books', function(req,res,next){

	var book = req.body;
	models.Book.create({
		title: book.title,
		authorId: book.authorId
	}).then((data) => res.status(201).json(data)).catch(next)
})

app.param('bookid',function(req,res,next,id){

	var id = req.params.bookid;
	if(isNaN(id)) req.state = false;	
		else 
		{
			req.state = true;

			req.paramResult = models.Book.findOne({
				where: { id: id }
			})
			.then(data => { return data })
		  	.catch(next) 
		}

	next();

})

app.get('/api/books/:bookid', function(req,res,next){

	if (req.state) {

		req.paramResult.then(data => {
			if (!data) res.sendStatus(404)
				else res.json(data)
		}).catch(next)
	} else res.sendStatus(500)

})


app.put('/api/books/:bookid', function(req, res, next){

	if(req.state) {	 				

	req.paramResult.then(data => { 
			if(data) { return data.update({title: req.body.title})
			} else res.sendStatus(404)
		}
		)
		.then(data => res.json(data)).catch(next)
	
	} else res.sendStatus(500)

})

app.delete('/api/books/:bookid', function(req,res,next){

	if(req.state) {	 				

	req.paramResult.then(data => { 
			if(data) { return data.destroy({title: req.body.title})
			} else res.sendStatus(404)
		}
		)
		.then(data => res.sendStatus(204)).catch(next)
	
	} else res.sendStatus(500)
})


app.get('/api/books/:chapterBook/chapters', function(req,res,next){
	var id = req.params.chapterBook;
	models.Chapter.findAll({where: {bookId: id}}).then(data => res.json(data))
})

app.post('/api/books/:chapterBook/chapters', function(req,res,next){

	var id = req.params.chapterBook;

	models.Chapter.create({
		title: req.body.title,
		text: req.body.text,
		number: req.body.number,
		bookId: id
	}).then(data => res.status(201).json(data)).catch(next)
})

app.get('/api/books/:chapterBook/chapters/:chapter', function(req,res,next){

	var chapter = req.params.chapter;
	var book = req.params.chapterBook;

	if(!isNaN(chapter)){
	models.Chapter.findOne({where: {
		bookId: book,
		id: chapter
	}}).then(data => {
		if(data) res.json(data)
			else res.sendStatus(404)
	}).catch(next) } else res.sendStatus(500)

})

app.put('/api/books/:chapterBook/chapters/:chapter', function(req,res,next){

	var chapter = req.params.chapter;
	var book = req.params.chapterBook;

	if(!isNaN(chapter)) {	 				

	models.Chapter.findOne({where: {
		bookId: book,
		id: chapter
	}})
	.then(data => { 
			if(data) { 
				return data.update({title: req.body.title})
			} else res.sendStatus(404)
		}
		)
	.then(data => res.json(data)).catch(next)
	
	} else res.sendStatus(500)

})

app.delete('/api/books/:chapterBook/chapters/:chapter', function(req,res,next){

	var chapter = req.params.chapter;
	var book = req.params.chapterBook;	

	if(!isNaN(chapter)) {	 				

	models.Chapter.findOne({where: {
		bookId: book,
		id: chapter
	}})
	.then(data => { 
			if(data) { 
				return data.destroy({title: req.body.title})
			} else res.sendStatus(404)
		}
		)
	.then(data => res.sendStatus(204)).catch(next)
	
	} else res.sendStatus(500)

})



app.use(session({
  secret: 'aaaa',
  resave: false,
  saveUninitialized: true,
  cookie: {sameSite: true}
}))


app.use(function (req, res, next) {

  if (!req.session.views) {
    req.session.views = {}
    var views = req.session.views
  } else  var views = req.session.views;

  var pathname = parseurl(req).pathname;

  if(!views[pathname]) views[pathname] = 0
  	else views[pathname]++
	
  next()
})

app.get('/api/numVisits', function (req, res, next) {
 
  var temp = req.session.views['/api/numVisits'];
  var data = {number: temp};
  console.log(data)

  res.status(200).json(data)
  next();
})


module.exports = app;