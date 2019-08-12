const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const HotDog = require('./models/hotdog');
const MongoClient = require('mongodb').MongoClient;
const path = require('path');
const app = express();

app.use(bodyParser.json(), cors());
app.use(bodyParser.urlencoded({ extended: true }));

const PORT = 5000;
const MongoAtlasURL = 'mongodb+srv://Taras:Qaz123@cluster0-xhxir.mongodb.net/test?retryWrites=true&w=majority';
const SERVER = '127.0.0.1:27017';
const DB = 'hotdoglist';
const MONGODB_URI = `mongodb://${SERVER}/${DB}`;
const connection = mongoose.connection;
const option = {
	socketTimeoutMS: 30000,
	keepAlive: true,
	reconnectTries: 30000
};

MongoClient.connect(MongoAtlasURL, (err, client) => {
	if (err) {
		console.log('Error occurred while connecting to MongoDB...', err);
	}
	console.log('Connected to Mongodb');
	const collection = client.db('hotdoglist').collection('hotdoglist');
	//const collection_users = client.db("tasks-app").collection("users");
	// perform actions on the collection object
	client.close();
});

mongoose.Promise = Promise;
mongoose.connect(MongoAtlasURL, option);

connection.on('connected', () => console.log('Connected to database'));
connection.on('error', (err) => console.log('Connection failed with - ', err));

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('/', (req, res) => {
	res.sendFile(path.join(__dirname + '/client/build/index.html'));
});

app.get('/hotdoglist', (req, res, next) => {
	HotDog.find((err, hotdoglist) => {
		if (err) return next(err);
		res.json(hotdoglist);
	});
});

app.post('/hotdoglist', (req, res, next) => {
	HotDog.create(req.body, (err, task) => {
		if (err) return next(err);
		res.json(task);
	});
});

app.delete('/hotdoglist:id', function(req, res, next) {
	HotDog.findByIdAndRemove(req.params.id.substr(1), req.body, (err, post) => {
		if (err) return next(err);
		res.json(post);
	});
});

app.put('/hotdoglist:id', function(req, res, next) {
	HotDog.findByIdAndUpdate(req.params.id.substr(1), req.body, (err, post) => {
		if (err) return next(err);
		res.json(post);
	});
});
