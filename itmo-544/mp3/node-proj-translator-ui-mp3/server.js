const express = require('express')
const app = express()
const port = 3000

const s3BucketName = "bpatel68-data-mp2";
const sqsName	= "bpatel68-sqs-mp2-msg";
const elasticacheid = "bpatel68-mp3-cache";

let AWS = require('aws-sdk');

let s3 = new AWS.S3();
let sns = new AWS.SNS({region: 'us-west-2'});
let sqs = new AWS.SQS({region: 'us-west-2'});
let rds = new AWS.RDS({region: 'us-west-2'});
let elasticache = new AWS.ElastiCache({region: 'us-west-2'});

let redis = require('redis');

/*
let client = redis.createClient(6379, 'bhavin-mp3-cache.z1ms9b.0001.usw2.cache.amazonaws.com');

client.set("addbtnConfig", "enable", function(error) { 

	console.log("put error"+error);

} );

client.get("addbtnConfig", function(error, value) {

	if(error)
		console.log("Fetch "+error);

	console.log(value);
 });

*/

let session = require('client-sessions');

app.use(session({
  cookieName: 'session',
  secret: 'dummy_secret_key',
  duration: 10 * 1000,
  activeDuration: 10 * 1000,
}));



let paramsCache = {
  CacheClusterId: elasticacheid,
  ShowCacheNodeInfo: true
};

elasticache.describeCacheClusters(paramsCache, function(errcache, datacache) {

  if (errcache)
  {
  	console.log(errcache);
  }  
  else 
  {
  		//console.log(datacache);

  		const cacheURL = (((datacache.CacheClusters)[0].CacheNodes)[0].Endpoint.Address);
  		const cachePort = (((datacache.CacheClusters)[0].CacheNodes)[0].Endpoint.Port);

  		//console.log(cacheURL);
  		//console.log(cachePort);

  		let redisclient = redis.createClient(cachePort, cacheURL);

  		//let redisclient = redis.createClient("6379", "127.0.0.1");

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

		  		let rdsReadParsms = {

					DBInstanceIdentifier: "bhavin-mp2-db-read"
				}


				rds.describeDBInstances(rdsReadParsms, function(errRdsread, dataRdsread) {

			  		if (errRdsread)
			  		{ 
			  			console.log(errRdsread);
			  		}
			  		else
			  		{

			  			let dbUrlRead = ((dataRdsread.DBInstances[0]).Endpoint).Address;


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


						let conRead = mysql.createConnection({
						  host: dbUrlRead,
						  user: "dbuser",
						  password: "dbpassword",
						  //database: "nodedb"
						});

						app.set('views', './views')
						app.set('view engine', 'pug')

						app.use(express.json());
						app.use(express.urlencoded({ extended: true }));


						//creating database

						con.connect(function(err)
						{

							if(err)
							{
								console.log(err);	
							}
							else
							{
								conRead.connect(function(errdbconn)
								{
									if(errdbconn)
									{
										console.log(errdbconn);
									}
									else
									{


										con.query("create database nodedb;", function (errcreatedb, result, fields)
										{
											if (errcreatedb) 
											{				
												//console.log();
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

											let createTableConfigQuery = "CREATE TABLE IF NOT EXISTS nodedb.config ("+
																	"config VARCHAR(255) NOT NULL,"+
																	"val VARCHAR(255) NOT NULL"+
																	");"

											con.query(createTableConfigQuery, function (err, result, fields)
											{
												if (err) 
												{
													console.log("table creation failed");
													//console.log(err);
												}    		
											});	

											//reading from replica
											conRead.query("SELECT val FROM nodedb.config WHERE config = 'addbtn'", function (err, result, fields)
											{
												if(err)
												{
													console.log(err);
												}
												else
												{
													//console.log(result[0].val);

													if(!result[0])
													{

														let insertQuery = "INSERT INTO nodedb.config(config, val) VALUES ('addbtn','enable');"

														con.query(insertQuery, function (err, result, fields)
														{
															if (err) 
															{														
																//console.log(err);
															}    

															redisclient.set("addbtnConfig", "enable", function(error) { 

																//console.log("put error"+error);

															});		
														});	

													}
													else
													{

														redisclient.set("addbtnConfig", result[0].val, function(error) { 

															//console.log("put error"+error);

														});	
													}

												}

											});


											//get all messages from DB

											app.get('/messages', function(req, res){

												//reading from replica
												//con.query("SELECT * FROM nodedb.messages", function (err, result, fields)
												conRead.query("SELECT * FROM nodedb.messages", function (err, result, fields)
												{
													if (err)
													{
														res.status(200).render('ErrorPage', { errMsg: err });				
													}
													else
													{
														//console.log(result);

														/* Changes for cache */

														redisclient.get("addbtnConfig", function(error, value) {

															if(error)
																console.log("Fetch "+error);

															//console.log("redis fetch :"+value);

															if(value=="enable" || value == "disable")
															{
																res.status(200).render('messageList', { messageList: result, addflag:value });
															}
															else
															{
																conRead.query("SELECT val FROM nodedb.config WHERE config = 'addbtn';", function (err22, result22, fields22)
																{
																	if(err22)
																	{
																		res.status(200).render('ErrorPage', { errMsg: err22 });
																	}
																	else
																	{

																		redisclient.set("addbtnConfig", result22[0].val, function(error) { 

																			//console.log("put error"+error);

																		});

																		//console.log(result22[0].val);
																		res.status(200).render('messageList', { messageList: result, addflag:result22[0].val });

																	}

																});

															}
 														
 														});


														//res.status(200).render('messageList', { messageList: result, addflag:contentsread });
														
													}

												});
											  		
											});
											//End get function all

											app.post('/messages/admin/config', function(req, res){
												
												
												if(req.session.user == "admin")
												{

													conRead.query("SELECT val FROM nodedb.config WHERE config = 'addbtn';", function (err22, result22, fields22)
													{
														if(err22)
														{
															res.status(200).render('ErrorPage', { errMsg: err22 });
														}
														else
														{

															let oldconfig = result22[0].val;
															let newconfig = "";
								

															if(oldconfig == "enable")
															{
																newconfig = "disable"
															}	
															else
															{
																newconfig = "enable";
															}	

															
															let updateQuery = "UPDATE nodedb.config SET val='"+newconfig+"' WHERE config = 'addbtn';"

															con.query(updateQuery, function (err33, result33, fields33)
															{
																if (err33) 
																{														
																	//console.log(err33);
																}   
																else
																{
																	
																	redisclient.set("addbtnConfig", newconfig, function(error) { 

																		//console.log("put error"+error);

																	});


																	res.status(204).send()
																} 		
															});	

														}

													});


													//res.status(204).send()
												}
												else
												{
													req.session.reset();
													res.status(204).redirect('/messages/admin');
												}

											});


											app.post('/messages/admin/home', function(req, res){

												
												if(req.session.user == "admin")
												{


													let fs = require('fs');
													
													fs.unlink(__dirname+ '/dbdump.txt', function (errfs) {            
		              								
		              								if (errfs) {                                                 
		                  								//console.error(errfs);                                    
		              								}                                                          
		             									//console.log('File has been Deleted');                           
		          									});  


													conRead.query("SELECT * FROM nodedb.messages", function (errdb, resultdb, fieldsdb)
													{
														if (errdb)
														{
															res.status(200).render('ErrorPage', { errMsg: errdb });				
														}
														else
														{
															//console.log(resultdb);

															let data="id,messageuuid,username,email,phone,s3urlraw,s3urlprocessed,jobstatus,notifyurl"+"\n";

															for(let k=0; k<resultdb.length;k++)
															{
																data = data+resultdb[k].id+",";
																data = data+resultdb[k].messageuuid+",";
																data = data+resultdb[k].username+",";
																data = data+resultdb[k].email+",";
																data = data+resultdb[k].phone+",";
																data = data+resultdb[k].s3urlraw+",";
																data = data+resultdb[k].s3urlprocessed+",";
																data = data+resultdb[k].jobstatus+",";
																data = data+resultdb[k].notifyurl+"\n";
															}


															fs.writeFile('dbdump.txt', data, function (errfs1) { 
			                        							if (errfs1)
			        												console.log(errfs1);
			                        							else
			                        							{
			        												
																	res.download(("dbdump.txt"), function (errdwn) {
			 
			        													//console.log(errdwn);
			 
			    													});//end download

			                        							}
															});//end write in file											
														}

													}); //end read										


												}
												else
												{
													req.session.reset();
													res.status(204).redirect('/messages/admin');
												}


											}); //end post admin home

											//admin home page

											app.get('/messages/admin/home', function(req, res){

																			
												if(req.session.user == "admin")
												{

													let messages =[];

													let params = {
														  Bucket: s3BucketName, 
														  MaxKeys: 20
													};

													s3.listObjectsV2(params, function(err, data) 
													{
			   											if (err)
			   											{
			   												console.log(err, err.stack);
			   											}
			   											else
			   											{
			   											     //console.log(data);

			   											     let keySize=(data.Contents).length;

			   											     let arrOrgText=[];
			   											     let arrConvText=[];
			   											     let arrMsguuid=[];
			   											     let arrKeys=[];

			   											     for(let i=0; i<keySize;i++)
			   											     {
			   											     	let keyVal= (data.Contents)[i].Key;

			   											     	arrKeys.push(keyVal);

			   											     	let msguuid=keyVal.split("/")[0];
			   											     	let msgtype=keyVal.split("/")[1];

			   											     	arrMsguuid[msguuid]=msguuid;

			   											     }

			   											     let counter = 0;
			   											     let tempfunc = function(key){

			   											       	let params = {
												  					Bucket: s3BucketName, 
												  					Key: key
												 				};

												 				s3.getObject(params, function(errs3, datas3){

												 					if(errs3)
												 					{
												 						console.log(errs3);
												 					}
												 					else
												 					{									 						
												 						
												 						let msgtype=key.split("/")[1];
												 						let msguuidVal=key.split("/")[0];

												 						const buf = datas3.Body;
													 					const text = buf.toString('utf8');


												 						if(msgtype == "original")
												 						{
												 							arrOrgText[msguuidVal] = text;
												 						}
												 						else if(msgtype == "translated")
												 						{
												 							arrConvText[msguuidVal] = text;
												 						}

												 						counter++;				

												 						console.log(counter);					 						

												 						if(counter < keySize)
												 						{
												 							tempfunc(arrKeys[counter]);
												 						}
												 						else
												 						{


												 							for(msgid in arrMsguuid)
												 							{							 								

												 								let msg = {
												 									messageuuid: msgid,
												 									originaltext: arrOrgText[arrMsguuid[msgid]] ,
												 									processedText: arrConvText[arrMsguuid[msgid]]
												 								};

												 								messages.push(msg);

												 							}

												 							console.log("here");
												 							//cache changes

												 							redisclient.get("addbtnConfig", function(error, value) {

																				if(error)
																					console.log("Fetch "+error);

																				console.log("redis login fetch"+value);

																				if(value == "enable" || value == "disable")
																				{
																					res.status(200).render('messageGallery', {messageList:messages, addflag:value});
																				}
																				else
																				{
																					conRead.query("SELECT val FROM nodedb.config WHERE config = 'addbtn';", function (err22, result22, fields22)
																					{
																						if(err22)
																						{

																						}
																						else
																						{
																							redisclient.set("addbtnConfig", result22[0].val, function(error) { 

																								//console.log("put error"+error);

																							});

																							res.status(200).render('messageGallery', {messageList:messages, addflag:result22[0].val});	

																						}
																					});

																				}

 																			});																								 							
												 							
												 						}

												 					}

												 				});//end s3

			   											     };//end tempfunc
														     	
			   											     if(arrKeys.length>0)
			   											     {
			   											     	tempfunc(arrKeys[0]);
			   											     }
			   											     else
			   											     {

											     				redisclient.get("addbtnConfig", function(error, value) {

																	if(error)
																		//console.log("Fetch "+error);

																	console.log(value);

																	if(value == "enable" || value == "disable")
																	{
																		let temparr = [];
																		res.status(200).render('messageGallery', {messageList:temparr, addflag:value});
																	}
																	else
																	{
													     				conRead.query("SELECT val FROM nodedb.config WHERE config = 'addbtn';", function (err33, result33, fields33)
																		{
																			if(err33)
																			{

																			}
																			else
																			{
																				let temparr = [];
																				res.status(200).render('messageGallery', {messageList:temparr, addflag:result33[0].val});	

																			}
																		});

																	}
 																});

			   											     }
			   											     
			   											}

			   										});//end get objects


												}
												else
												{
													req.session.reset();
													res.status(204).redirect('/messages/admin');
													//return;
												}
												

												//res.status(200).render('messageGallery', {messageList:messages});

											}); //end admin get

											//admin login page

											app.get('/messages/admin', function(req, res){

												res.status(200).render('adminPage', {});

											}); //end admin get


											app.post('/messages/admin', function(req, res){

												let valuesObj = req.body;

												if(valuesObj)
												{

													if(valuesObj.username == "admin" && valuesObj.pass == "admin")
													{

														req.session.user = "admin";
														res.status(204).redirect('/messages/admin/home');

													}
													else
													{
														res.status(200).render('ErrorPage', { errMsg: "Invalid Credentials. Please try again." });			
													}

												}


											});//end admin post

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
													//reading from replica
													//con.query("SELECT * FROM nodedb.messages where id = "+msgid, function (err, result, fields)
													conRead.query("SELECT * FROM nodedb.messages where jobstatus = 'Completed' AND id = "+msgid, function (err, result, fields)
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
								});	//end connect db read

							}
						});	//end connect db			 

			
			  		}
			  	});//end rds read inner


		   }
		});//end get rds



  }    
}); //end cache

app.listen(port, function() {

	console.log('Translation application runnning on port '+port+'.');
});
