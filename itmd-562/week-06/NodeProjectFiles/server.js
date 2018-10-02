/* Web counter using ExpressJS */

const express = require('express')
const app = express()
const port = 3000
const staticPath = require('path')

/* Declaring counter value */

let counter = 0;

/* Using static files for response html */

app.use(express.static('public'));

/* Handling get request to return the counter value*/

app.get('/counter', function(req, res){
  
  const getHtml = '<html><h1>Counter Value : '+counter+'</h1></html>';
  console.log('Counter Value : '+counter);
  res.status(200).send(getHtml);
});

/* Handling post request to increment the counter */

app.post('/counter', function(req, res){
  
  const postHtml = '<html><h1>Counter incremented by one.</h1></html>';
  counter = counter + 1;
  console.log('Counter incremented by one.');
  //res.status(200).send(postHtml);
  res.status(204).send(postHtml)
});


/* Handling delete request to reset the counter */

app.delete('/counter', function(req, res){
  
  const deleteHtml = '<html><h1>Counter value reset to zero.</h1></html>';
  counter = 0;
  console.log('Counter value reset to zero.');
  //res.status(200).send(deleteHtml);
  res.status(204).send(deleteHtml);

});


/* Handling error display scenario in case of wrong path */
app.all('*', function(req, res){
	console.log('Invalid URL invoked.');
	res.status(404).sendFile(staticPath.join(__dirname + '/public/error.html'));
});


app.listen(port, function() {

	console.log('Counter application runnning on port '+port+'.');
});