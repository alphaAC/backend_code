var express = require('express'); //require 是node.js裡的include
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) { //if user put url to root 
	res.render('index', {
		title: 'Express'
	});
});

router.get('/helloworld', function (req, res) { // if url is 140.119.x.x/helloworld
	res.render('helloworld', {
		title: 'fuck that!'
	});
});

/*GET Userlist page. */
router.get('/userlist', function (req, res) {
	var db = req.db;
	var collection = db.get('usercollection');
	collection.find({}, {}, function (e, docs) {
		res.json(docs.filter(d => !(d.username.includes('鮑聖文') || d.username.includes('測試'))));
	});
});


/* GET New User page. */
router.get('/newuser', function (req, res) {
	res.render('newuser', {
		title: 'Add New User'
	});
});


router.get('/emailduplication', function (req, res) {
	res.render('emailduplication', {
		title: 'emailduplication'
	});
});


/* POST to Add User Service */
router.post('/adduser', function (req, res) {

	// Set our internal DB variable
	var db = req.db;

	// Get our form values. These rely on the "name" attributes
	var userName = req.body.username;
	var userEmail = req.body.useremail;

	// Set our collection
	var collection = db.get('usercollection');

	/*var num_of_row = collection.find({"email":userEmail}).count();    
	if ( num_of_row != 0 ){
    	res.send("This email has been used. Please try another");
    }
	wrong statement,don't know why
	*/

	collection.findOne({
		email: userEmail
	}, function (err, doc) {
		if (doc) {
			res.status(400).json({
				status: 'duplicated'
			});
		} else {
			collection.insert({
				"username": userName,
				"email": userEmail
			}, function (err, doc) {
				if (err) {
					// If it failed, return error
					res.status(500).json({
						status: false
					});

					console.log(err)
				} else {
					// And forward to success page
					//res.redirect("userlist");
					res.status(201).json({
						status: true
					});
				}
			});
		}

	});

});

module.exports = router;

//app.listen(3000); this will cause error