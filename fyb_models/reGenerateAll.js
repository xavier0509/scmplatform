
var url = 'mongodb://localhost:27017/fybv2';

function reset()
{
	var mongo = require("mongodb");
	var client = mongo.MongoClient;
	var assert = require('assert');
	
	// Use connect method to connect to the server
	client.connect(url, function(err, db) 
	{
		if (err)
		{
			console.log("connect database error!  : " + url); 
		}
		
		assert.equal(null, err);
		console.log("Connected successfully to server");
		
		var collection = db.collection('products');
		
		collection.find({"gerritState":0}).toArray(function(err, docs) 
		{
			if (err)
			{
				console.log("query database table error!"); 
			}
		
            assert.equal(null, err);
            //console.log(docs);
			db.close();
			
			var infos = new Array();
			
			for (var i in docs)
			{
				var record = docs[i];
				var curmodel = record.model;
				var curchip = record.chip;
				infos[i] = {"model":curmodel, "chip":curchip};
			}
			
			console.log(infos);
			generateAll(infos);
        });
	});
}

function generateAll(infos)
{
	var Generator = require("../fyb_models/generate");
	
	Generator.generate(infos, "Rel6.0", function(err,result){
		if(err != 0){
			console.log("err = " + err + ", result = " + result);
		}else{
			console.log("err = " + err + ", result = " + result);
		}
	});
}




reset();












