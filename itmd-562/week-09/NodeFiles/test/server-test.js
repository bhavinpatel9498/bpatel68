
let chai = require('chai');
let chaiHttp = require('chai-http');

let server = require('../server');

let should = chai.should();
chai.use(chaiHttp);


describe('All End Points', function() {

  it('List all Books on /books GET', getAllBookTest);
  it('List only one book on /books/<id> GET', getBookTest);
  it('Save a new book on /books POST', saveBookTest);
  it('Update the book for passed book id on /books/<id> PUT', updateBookTest);
  it('Delete the book for passed book id on /books/<id> DELETE', deleteBookTest);
});


/* Test for GET /books to list all books */

function getAllBookTest(done)
{
	  chai.request(server)
      .get('/books')
      .end(function(err, res){
        res.should.have.status(200);
        res.should.be.json;
        res.body.should.be.a('array');
        res.body[0].should.have.property('_id');
        res.body[0].should.have.property('title');
        res.body[0].should.have.property('author');
        res.body[0].should.have.property('numPages');
	    done();
      });
}


/* Test for GET /books/<id> to list one book */

function getBookTest(done)
{
	chai.request(server)
	.get('/books')
	.end(function(err, res){

	   chai.request(server)
	  .get('/books/'+res.body[0]._id)
	  .end(function(err, res){	      
	    res.should.have.status(200);
	    res.should.be.json;
	    res.body.should.have.property('_id');
	    res.body.should.have.property('title');
	    res.body.should.have.property('author');
	    res.body.should.have.property('numPages');
	    done();

	  });
	});
}


/* Test for POST /books/ to save one book */


function saveBookTest(done)
{
	let requestBook = {
		title: "Mocha Title",
		author: "Mocha author",
		numPages: 10000
	};

	chai.request(server)
    .post('/books')
    .send(requestBook)
    .end(function(err, res){
 	    res.should.have.status(200);
	    res.should.be.json;
	    res.body.should.have.property('_id');
	    res.body.should.have.property('title');
	    res.body.should.have.property('author');
	    res.body.should.have.property('numPages');
	    done();
      });
}


/* Test for PUT /books/<id> to update one book */

function updateBookTest(done)
{
	let updateName = {
		title: "Mocha Title New"		
	};

	chai.request(server)
	.get('/books')
	.end(function(err, res){

	   chai.request(server)
	  .put('/books/'+res.body[0]._id)
	  .send(updateName)
	  .end(function(err, res){	      
	    res.should.have.status(204);
	    done();

	  });
	});
}


/* Test for DELETE /books/<id> to delete one book */

function deleteBookTest(done)
{

	chai.request(server)
	.get('/books')
	.end(function(err, res){

	   chai.request(server)
	  .delete('/books/'+res.body[0]._id)
	  .end(function(err, res){	      
	    res.should.have.status(204);
	    done();

	  });
	});
}

