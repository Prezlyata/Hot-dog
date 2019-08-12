const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const hotDogSchema = new Schema(
	{
		title: { type: String, required: true }
	},
	{ collection: 'hotdoglist' }
);

const HotDog = mongoose.model('HotDog', hotDogSchema);

module.exports = HotDog;
