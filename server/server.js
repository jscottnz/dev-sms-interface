var express = require('express');
var router = express();
var Db = require('db4js');
var cors = require('cors');
var bodyParser = require('body-parser');

if(process.argv.length != 4) {
	console.log("Expect db file and port param i.e.")
	console.log("node server.js sms.db 3000")
	process.exit(1)
}

var DBFILE = process.argv[2]
var PORT = process.argv[3]

router.use(bodyParser.json());
router.listen(PORT);
console.error("Server ready");

require('shutdown-handler').on('exit', function() {
  console.log("Shutdown...");
});

var smsDb = Db.create();
smsDb.loadFromFile(DBFILE, {
	keyField : "id",
	indexes : {
		id : Db.indexBuilders.fromKey
	}
}, "id")

router.options('*', cors());


router.get("/list/:id", function(request, response) {

	smsDb.get("id", request.params.id)
	.then(function(data) {
		respond(response, data);
	}, function(message) {
		error(response, message);
	}).done();

})

router.get("/:id", function(request, response) {

	smsDb.get("id", request.params.id)
	.then(function(data) {

		if(data.indexItems && data.indexItems[0][0]
			&& data.indexItems[0][0].queue && data.indexItems[0][0].queue.length > 0) {

			var saveData = data.indexItems[0][0];
			var sms = data.indexItems[0][0].queue.shift();

			smsDb.save(request.params.id, saveData, true)
		}


		respond(response, sms);
	}, function(message) {
		error(response, message);
	}).done();

})

router.post("/:id", function(request, response) {

	console.log(request.body)

	smsDb.get("id", request.params.id)
	.then(function(data) {
		
		var saveData = { 
			id : request.params.id,
			queue : []
		}
		if(data.indexItems) {
			saveData = data.indexItems[0][0]
		}

		saveData.queue.push(request.body)

		smsDb.save(request.params.id, saveData, true)

	}, function(message) {
		error(response, message);
	}).done();

})

function respond(response, data) {
	response.writeHead(200, {'Access-Control-Allow-Origin' : '*'});

	if(data) {
		data = JSON.stringify(data)
	}
	response.end(data);
}