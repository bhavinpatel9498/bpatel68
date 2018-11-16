const express = require('express')
const app = express()
const port = 3000

const s3BucketName = "bpatel68-data-mp2";
const sqsName	= "bpatel68-sqs-mp2-msg";

let AWS = require('aws-sdk');

let s3 = new AWS.S3();
let sns = new AWS.SNS({region: 'us-west-2'});
let sqs = new AWS.SQS({region: 'us-west-2'});
let rds = new AWS.RDS({region: 'us-west-2'});


let rdsParsms = {

	DBInstanceIdentifier: "bhavin-mp2-db"
}

rds.describeDBInstances(rdsParsms, function(errRds, dataRds) {

  if (errRds)
  { 
  	console.log(errRds);
  }
  else     
  {
  		//console.log((dataRds[0].Endpoint).Address);

  		let dbUrl = ((dataRds.DBInstances[0]).Endpoint).Address;




const mysql = require('mysql');

/*
let con = mysql.createConnection({
  host: "localhost",
  user: "nodedbuser",
  password: "nodedbuser",
  database: "nodedb"
});
*/

let con = mysql.createConnection({
  host: dbUrl,
  user: "dbuser",
  password: "dbpassword",
  //database: "nodedb"
});

app.set('views', './views')
app.set('view engine', 'pug')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


//creating database

con.connect(function(err){

	if(err)
	{
		console.log(err);	
	}
	else
	{
		con.query("create database nodedb;", function (err, result, fields)
		{
			if (err) 
			{				
				console.log();
			}    	




let createTableQuery = "CREATE TABLE IF NOT EXISTS nodedb.messages ("+
						"id INT AUTO_INCREMENT,"+
						"messageuuid VARCHAR(255) NOT NULL,"+
						"username VARCHAR(255) NOT NULL,"+
						"email VARCHAR(255) NOT NULL,"+
						"phone VARCHAR(255) NOT NULL,"+
						"s3urlraw VARCHAR(255) NOT NULL,"+
						"s3urlprocessed VARCHAR(255),"+
						"jobstatus VARCHAR(255),"+
						"notifyurl VARCHAR(255),"+
						"PRIMARY KEY (id)"+
						");"

con.query(createTableQuery, function (err, result, fields)
{
	if (err) 
	{
		console.log("table creation failed");
		//console.log(err);
	}    		
});	


//get all messages from DB

app.get('/messages', function(req, res){

	con.query("SELECT * FROM nodedb.messages", function (err, result, fields)
	{
		if (err)
		{
			res.status(200).render('ErrorPage', { errMsg: err });				
		}
		else
		{
			//console.log(result);
			res.status(200).render('messageList', { messageList: result });
		}

	});
  		
});
//End get function all


app.get('/messages/add', function(req, res){


	const uuidv4 = require('uuid/v4');

	res.status(200).render('messageForm', {msguuid: uuidv4()});

});


app.post('/messages/add', function(req, res){

	let valuesObj = req.body;

	//Putting the details in S3 Bucket'

	let myKey = valuesObj.messageuuid+"/original";
	let bodyText = valuesObj.inputmessage;
	let params = {Bucket: s3BucketName, Key: myKey, Body: bodyText, ACL: 'public-read'};

     s3.putObject(params, function(err, data) {

         if (err) {

             res.status(200).render('ErrorPage', { errMsg: err });

         } 

      });

     //console.log("s3 uploaded");
    //Creating SNS topic for the user

    let arn='';

    let snsParams = {
  			Name: valuesObj.username+'-sns'
  	};

	sns.createTopic(snsParams, function(err, data) 
	{
  		if (err) 
  		{
  			console.log(err);
  			res.status(200).render('ErrorPage', { errMsg: err });
  		}
  		else
  		{
  		  
  		    arn = data.TopicArn;

			//Subscribe email

			let subParamsEmail = {
				Protocol: "email",
			  	TopicArn: arn,
			  	Endpoint: valuesObj.email			  
			};

			sns.subscribe(subParamsEmail, function(err1, data1) {
			  if (err1) 
			  		console.log(err1);
			});


			//Subscribe phone

			let subParamsPhone = {
				Protocol: "sms",
			  	TopicArn: arn,
			  	Endpoint: valuesObj.phone			  
			};

			sns.subscribe(subParamsPhone, function(err2, data2) {
			  if (err2) 
			  		console.log(err2);
			});


  		}

  		let sqsParams = {
			QueueName: sqsName						
		};

		sqs.getQueueUrl(sqsParams, function(errsqs, datasqs) 
		{
  			if (errsqs) 
  				console.log(err);
  			else 
  			{
  		
  				let sqsUrl = datasqs.QueueUrl;

  				let sqsMsgParams = {
  					MessageBody: valuesObj.messageuuid,
  					QueueUrl: sqsUrl
  				};

  				sqs.sendMessage(sqsMsgParams, function(errsqsmsg, datasqsmsg) {
  					if (errsqsmsg) 
  						console.log(errsqsmsg);

  					let insertQuery = "INSERT INTO nodedb.messages (messageuuid, username, email, phone, jobstatus, s3urlraw, notifyurl) VALUES "+
					"('"+valuesObj.messageuuid+"', '"+valuesObj.username+"', '"+valuesObj.email+"', '"+
					valuesObj.phone+"', 'Pending', '"+myKey+"', '"+arn+"')";

					con.query(insertQuery, function (errquery, result, fields)
					{
						if (errquery)
						{
							res.status(200).render('ErrorPage', { errMsg: errquery });				
						}
						else
						{
							//console.log(result);
							res.status(204).redirect('/messages');
						}

					});


				});

  			}   
		});


	});//end create topic


});

//Display Single Msg

app.get('/messages/view/:id', function(req, res){

	let msgid = req.params.id;

	if(msgid)
	{
		con.query("SELECT * FROM nodedb.messages where id = "+msgid, function (err, result, fields)
		{
			if (err)
			{
				res.status(200).render('ErrorPage', { errMsg: err });				
			}
			else
			{				

				if(!result[0])
				{
					res.status(204).redirect('/messages');
					return;
				}

				
				//Getting Text from S3

				let params = {
  					Bucket: s3BucketName, 
  					Key: result[0].s3urlraw
 				};

 				s3.getObject(params, function(err1, data){

 					if(err1)
 					{
 						res.status(200).render('ErrorPage', { errMsg: err1 });
 					}

 					else
 					{
	 					const buf = data.Body;
	 					const orgText = buf.toString('utf8');

	 					result[0].s3urlraw = orgText;

	 					//console.log(buf.toString('base64'));

	 					let paramsTranslated = {
  							Bucket: s3BucketName, 
  							Key: result[0].s3urlprocessed
 						};

 						s3.getObject(paramsTranslated, function(err2, data2){

 							if(err2)
		 					{
		 						res.status(200).render('ErrorPage', { errMsg: err2 });
		 					}
		 					else
		 					{
		 						const buf2 = data2.Body;
	 							const processedText = buf2.toString('utf8');

	 							result[0].s3urlprocessed = processedText;

	 							res.status(200).render('messageDisplay', { messageResult: result });
		 					}

 						});

	 					
	 				}

 				});
				
			}

		});
	}
	else
	{
		res.status(204).redirect('/messages');
	}
});


/* Handling error display scenario in case of wrong path */
app.all('*', function(req, res){
	//console.log('Invalid URL invoked.');
	//res.status(404).send('Invalid URL invoked.');
	res.status(204).redirect('/messages');
});



			

		});	//end create DB

	}

});

 

   }

});//end get rds

app.listen(port, function() {

	console.log('Translation application runnning on port '+port+'.');
});
