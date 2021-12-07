// in terminal run "node node-js-mongo-insert-doc-script.js"

var url = "mongodb://localhost:27017"
var MongoClient = require('mongodb').MongoClient;

MongoClient.connect(url, function(err, client) {
  if (err) throw err;
  var db = client.db('retail_golf')
  console.log("Switched to "+db.databaseName+" database.");
  
  var rangeball_docs = [{
    "title": "Extra Small Bucket",
    "quantity": "25-30",
    "image": "xs_balls.jpg",
    "price": 4.99,
    "type": "rangeball",
    "is_deleted": false
  },
  {
    "title": "Small Bucket",
    "quantity": "40-50",
    "image": "s_balls.jpg",
    "price": 9.99,
    "type": "rangeball",
    "is_deleted": false
  },
  {
    "title": "Medium Bucket",
    "quantity": "70-75",
    "image": "m_balls.jpg",
    "price": 15.99,
    "type": "rangeball",
    "is_deleted": false
  },
  {
    "title": "Large Bucket",
    "quantity": "100-100",
    "image": "l_balls.jpg",
    "price": 19.99,
    "type": "rangeball",
    "is_deleted": false
  },
  {
    "title": "Extra Large Bucket",
    "quantity": "150-200",
    "image": "xl_balls.jpg",
    "price": 24.99,
    "type": "rangeball",
    "is_deleted": false
  },
  {
    "title": "Super Bucket",
    "quantity": "300-400",
    "image": "xxl_balls.jpg",
    "price": 29.99,
    "type": "rangeball",
    "is_deleted": false
  }]

  var instructor_docs = [{
    "name": "Jordan Deschambeau",
    "image": "deschambeau.jpg",
    "experience": 15,
    "description": "Jordan Deschambeau is the premier short range coach of our establishment. If you need help on your wedge game, Deschambeau will set you right",
    "rate": 50.00,
    "availability": "M-W 10a-3p",
    "is_deleted": false
  },
  {
    "name": "Tiger McIlroy",
    "image": "mcilroy.jpg",
    "experience": 8,
    "description": "Tiger McIlroy has been a member of the PGA coaching association for 5 years and is well-versed on how to extend your range using irons, woods, hybrids, and drivers.",
    "rate": 40.00,
    "availability": "Th-F 9a-5p",
    "is_deleted": false
  },
  {
    "name": "Phil Lee",
    "image": "lee.jpg",
    "experience": 3,
    "description": "Phil Lee is the best putting coach at our establishment. If you need help on the greens, Phil is your man.",
    "rate": 65.00,
    "availability": "M-Th 9a-5p",
    "is_deleted": false
  },
  {
    "name": "Jack McDowell",
    "image": "mcdowell.jpg",
    "experience": 12,
    "description": "Jack McDowell started playing golf in elementary school and has used his years of experience to acquire several championship wins at the Collegiate level.",
    "rate": 55.00,
    "availability": "W-F 9a-1p",
    "is_deleted": false
  },
  {
    "name": "Dustin Casey",
    "image": "casey.jpg",
    "experience": 4,
    "description": "Dustin Casey has been coaching several students of the local high school to great success. If you need a coach for your child there is not anyone better than Dustin.",
    "rate": 30.00,
    "availability": "T-F 3p-7p",
    "is_deleted": false
  }]

  var rental_docs = [{
    "brand": "Titleist",
    "title": "Premium Tier",
    "image": "titleist.jpg",
    "description": "T300 Irons, TSi3 Driver, and SM8 wedges round out one of the best golf kits out there. Try these out to change your golf game forever.",
    "price": 125.00,
    "stock": 2,
    "type": "rental",
    "is_deleted": false
  },
  {
    "brand": "Callaway",
    "title": "Mid Tier",
    "image": "callaway.jpg",
    "description": "Big Bertha Driver, Apex MB Irons, and PM Grind 19 wedges are a solid set of clubs if you get past the beginner stages of golf and want to invest in something better. Try these out today!",
    "price": 60.00,
    "stock": 2,
    "type": "rental",
    "is_deleted": false
  },
  {
    "brand": "Callaway",
    "title": "Premium Tier",
    "image": "callaway2.jpg",
    "description": "Big Bertha Driver, Apex MB Irons, and PM Grind 19 wedges are a solid set of clubs if you get past the beginner stages of golf and want to invest in something better. Try these out today!",
    "price": 160.00,
    "stock": 2,
    "is_deleted": false
  },
  {
    "brand": "Taylormade",
    "title": "Mid Tier",
    "image": "taylormade.jpg",
    "description": "Big Bertha Driver, Apex MB Irons, and PM Grind 19 wedges are a solid set of clubs if you get past the beginner stages of golf and want to invest in something better. Try these out today!",
    "price": 55.00,
    "stock": 12,
    "is_deleted": false
  },
  {
    "brand": "Ping",
    "title": "Mid Tier",
    "image": "ping.jpg",
    "description": "Big Bertha Driver, Apex MB Irons, and PM Grind 19 wedges are a solid set of clubs if you get past the beginner stages of golf and want to invest in something better. Try these out today!",
    "price": 45.00,
    "stock": 8,
    "is_deleted": false
  }]

  db.collection("rangeballs").insertMany(rangeball_docs, function(err, res){
    if (err) throw err
    console.log("Rangeball documents inserted");
  });

  db.collection("instructors").insertMany(instructor_docs, function(err, res){
    if (err) throw err
    console.log("Instructor documents inserted");
  });

  db.collection("rentals").insertMany(rental_docs, function(err, res){
    if (err) throw err
    console.log("Rental documents inserted");
    client.close();
  });
});