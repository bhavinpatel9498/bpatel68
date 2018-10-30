const express = require('express')
const app = express()
const port = 3000


app.use(express.json());


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/booksdb', { useNewUrlParser: true, useFindAndModify: false }, function(err, res){

	if(err)
		console.log("Error in Mongoose");
	else
		console.log("Mongoose Successful");
});



/* Creating a Schema */


let Schema = mongoose.Schema;

let booksSchema = new Schema({

title		: { type: String, required: true},
author		: { type: String, required: true},
numPages	: { type: Number, required: true}   
	
	});
	//end schema


let BookModel = mongoose.model('BookModel', booksSchema);


app.get('/books', function(req, res){


		BookModel.find({}, function(err, books){

		if(err)
		{
			console.log("Error in fetch");
			res.status(500).send("Internal Server Error");
		}
		else
		{
			console.log(books);

			if (books)
			{
				res.status(200).send(books);
			}
			else
			{
				res.status(200).send("No Books Available");
			}
		}
	});  		
});
//End get function all


app.get('/books/:id', function(req, res){

	if(req.params.id && mongoose.Types.ObjectId.isValid(req.params.id))
	{  		
  		BookModel.findById(mongoose.Types.ObjectId(req.params.id), function(err, book){

			if(err)
			{
				console.log("Error in fetch");
				//console.log(err);
				let response = {
					error: "Error in fetch",
					_id:"Book Not Found",
					title: "",
					author: "",
					numPages: ""
				};

				res.status(200).send(response);
			}
			else
			{
				console.log(book);

				if (book)
				{
					res.status(200).send(book);
				}
				else
				{
					let response = {
						_id:"Book Not Found",
						title: "",
						author: "",
						numPages: ""
					};
					res.status(200).send(response);
				}
			}
		});  		
	}
	else
	{
		console.log("Invalid Book Id");
		
		let response = {
			error: "Invalid Book Id",
			_id:"",
			title: "",
			author: "",
			numPages: ""
		};
		
		res.status(200).send(response);
	}
});
//End get function single


app.post('/books', function(req, res){


	let book = new BookModel(req.body);

	if(book)
	{

		book.save(function(err, savedBook) {
	
			if (err)
			{
				console.log("Error in save");
				//console.log(err);
				let response = {
					error: "Internal Server Error",
					_id:"",
					title: "",
					author: "",
					numPages: ""
				};
				res.status(200).send(response);					
			}
			else
			{
				console.log("Save Successful");
				res.status(200).send(savedBook);
			}
		});
	}
});
//end post function


app.put('/books/:id', function(req, res) {

	if(req.params.id && mongoose.Types.ObjectId.isValid(req.params.id))
	{  

		let book = new BookModel({_id: mongoose.Types.ObjectId(req.params.id), author: req.body.author, title: req.body.title, numPages: req.body.numPages});

		console.log(book);

		if(book)
		{

			BookModel.findOneAndUpdate({_id: mongoose.Types.ObjectId(req.params.id)}, book, {new:true}, function(err, updatedBook) {
		
				if (err)
				{
					console.log("Error in save");
					//console.log(err);
					res.status(204).send("Internal Server Error");					
				}
				else
				{					
					if(updatedBook)
					{
						console.log("Update Successful");						
						res.status(204).send("Update Successful");
					}
					else
					{
						console.log("No Book found for Update.");
						res.status(204).send("No Book found for Update.");
					}
				}
			});
		}
	}
	else
	{
		console.log("Invalid Book Id");
		res.status(204).send("Invalid Book Id");
	}
});
//End put block


app.delete('/books/:id', function(req, res){

	if(req.params.id && mongoose.Types.ObjectId.isValid(req.params.id))
	{
		BookModel.findOneAndDelete({_id:mongoose.Types.ObjectId(req.params.id)}, function(err, deletedBook){

			if (err)
			{
				console.log("Error in Delete");
				//console.log(err);
				res.status(204).send("Internal Server Error");					
			}
			else
			{
				if(deletedBook)
				{
					console.log("Delete Successful");						
					res.status(204).send("Delete Successful");
				}
				else
				{
					console.log("No Book found for delete.");
					res.status(204).send("No Book found for delete.");
				}
			}
		});
	}
	else
	{
		console.log("Invalid Book Id");
		res.status(204).send("Invalid Book Id");
	}
});
//end delete block

/* Handling error display scenario in case of wrong path */
app.all('*', function(req, res){
	console.log('Invalid URL invoked.');
	res.status(404).send('Invalid URL invoked.');
});
	

app.listen(port, function() {

	console.log('Counter application runnning on port '+port+'.');
});


module.exports = app;