let AWS = require('aws-sdk');

let s3 = new AWS.S3();
let sns = new AWS.SNS({region: 'us-west-2'});
let sqs = new AWS.SQS({region: 'us-west-2'});
let rds = new AWS.RDS({region: 'us-west-2'});


const s3BucketName = "bpatel68-data-mp2";
const sqsName	= "bpatel68-sqs-mp2-msg";


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
  database: "nodedb"
});

con.connect(function(err){

	if(err)
	{
		console.log(err);	
	}
	else
	{



let schedule = require('node-schedule');
 
let j = schedule.scheduleJob('*/1 * * * *', function(){

	console.log("Processing job");

//Getting SQS URL
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

  			let sqsGetParams = {
  				QueueUrl: sqsUrl,
  				VisibilityTimeout: 120
  			};

  			sqs.receiveMessage(sqsGetParams, function(err, data) 
  			{
  				if (err) 
  					console.log(err);

  				else
  				{
  					
  					if(!data.Messages)
  						return;

  					let msguuid = (data.Messages)[0].Body

  					let ReceiptHandle = (data.Messages)[0].ReceiptHandle;


  					con.query("SELECT s3urlraw, notifyurl FROM nodedb.messages WHERE messageuuid = '"+msguuid+"'", function (err1, result1, fields1)
					{
						if (err1)
						{
							console.log(err1);				
						}
						else
						{
							//console.log(result1);

							if(!result1[0])
								return;

							let s3url = result1[0].s3urlraw;
							let snsurl = result1[0].notifyurl;


							//Read data from s3

							let paramsS3get = {
  								Bucket: s3BucketName, 
  								Key: s3url
 							};

							s3.getObject(paramsS3get, function(err2, data2){

		 					if(err2)
		 					{
		 						console.log(err2);
		 					}

		 					else
		 					{

			 					const buf = data2.Body;
			 					const orgText = buf.toString('utf8');

			 					
			 					//console.log(orgText);


			 					// Imports the Google Cloud client library
								const {Translate} = require('@google-cloud/translate');

								// Your Google Cloud Platform project ID
								const projectId = 'translate-proj-224011';

								// Instantiates a client
								const translate = new Translate({
  									projectId: projectId,
								});

			 					let translatedText = '';

			 					translate
  									.translate(orgText, "fr")
  									.then(results => {
								   
									    //Put this string in s3

									   // console.log(res);

									    translatedText = results[0];

			
									    let myKey = msguuid+"/translated";
										let bodyText = translatedText;
										let params = {Bucket: s3BucketName, Key: myKey, Body: bodyText, ACL: 'public-read'};

										//console.log("bodyText :"+bodyText);

									    s3.putObject(params, function(err4, data4) {

									        if (err4) {
									            console.log(err4);
									        }
									        else
									        {
									        	//console.log("data put success");

									        	let updateQuery="UPDATE nodedb.messages SET s3urlprocessed = '"+
									        	msguuid+"/translated', jobstatus='Completed' WHERE messageuuid='"+msguuid+"'";
									       

									        	con.query(updateQuery, function (err5, result5, fields5)
												{
													if (err5) 
													{
														console.log(err5);
													}    	
													else
													{
														let snsParams={
															Message: "Translation complete for msg id "+msguuid,
															TopicArn: snsurl
														};

														sns.publish(snsParams, function(err6, data6) {

														  if (err6)
														  	console.log(err6);
														  else
														  {

														  	//console.log("notification sent");

														  	
														  	let sqsDeleteParams = {
														  		QueueUrl: sqsUrl,
														  		ReceiptHandle: ReceiptHandle
														  	};

														  	sqs.deleteMessage(sqsDeleteParams, function(err7, data7) {
																  if (err7) 
																  	console.log(err7); // an error occurred
																  else
																  {
																  	//console.log("Msg deleted");
																  }     
															
															}); //end delete sqs msg
															
														  } 
														

														});//end sns publish


													}	

												});	//end update query

									        }

									    }); //end s3 put

									}).catch(err3 => {
								    	console.log(err3);
									}); //end translate

							}

		 					}); //end read s3 value


							
						}

					});//end fetching query from uuid



  				}             
			});//end receive msg


  		}

  	});//end get sqs url

  
}); //end scheduler



	}

}); //end create connection




   }

});//end get rds


