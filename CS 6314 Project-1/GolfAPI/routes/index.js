var express = require('express');

//establish connection string and collection objects
var monk = require('monk');
var db = monk('localhost:27017/retail_golf');
var range_balls_collection = db.get('rangeballs');
var instructors_collection = db.get('instructors');
var rental_collection = db.get('rentals');
var accounts_collection = db.get('accounts');
var cart_collection = db.get('cart');
var orders_collection = db.get('orders');

var app = express.Router();
var passport = require('passport');
const { title } = require('process');
var Account = require('../models/account');
var RangeBalls = require('../models/RangeBalls');
var Rentals = require('../models/Rentals');
var Instructors = require('../models/Instructors');
const { $where } = require('../models/account');

// Other Routes*********************************************
/* Show landing page */
app.get('/', function (req, res) {
    res.render('index', { user : req.user });
});

/* Used to find potential duplicate usernames */
app.get('/accounts/:username', function(req, res){
  accounts_collection.findOne({username: req.params.username}, function(err, account){
    if (err) throw err;
    res.json(account)
  })
})

/* Page not implemented but prettified */
app.get('/instruction', function (req, res){
  res.render('instruction');
})

/* Page not implemented but prettified */
app.get('/club-fitting', function(req, res){
  res.render('club-fitting');
})

/* Don't believe this is used anywhere but used for debugging */
app.get('/orders/:username', function(req,res){
  orders_collection.find({username: req.user.username}, function(err, items){
    if(err) throw err;
    res.render('home', { results : items, user : req.user });
  });
})

/* Used to insert cart items into orders collection */
app.post('/orders', function(req,res){
  orders_collection.insert(req.body, function(err,item){
    if(err) throw err;
    res.json(item);
  });
});
// END Other Routes*********************************************
// Register Routes*********************************************
app.get('/register', function(req, res) {
    res.render('register', {});
});

app.post('/register', function(req, res) {
  Account.register(new Account({ username : req.body.username, is_admin: false }), req.body.password, function(err, account) {
    if (err) {
      return res.render('user-exists');
    }

    passport.authenticate('local')(req, res, function () {
      res.redirect('home');
    });
  });
});
// END Register Routes*********************************************
// Home Routes*********************************************
app.get('/home', function(req, res){
  orders_collection.find({username: req.user.username}, function(err, items){
    if(err) throw err;
    res.render('home', { results : items, user : req.user });
  });
});
// END Home Routes*********************************************
// Shopping Cart Routes*********************************************
/* Load Page */
app.get('/cart', function(req, res) {
  cart_collection.find({username: req.user.username}, function(err, items){
    if(err) throw err;
    res.render('cart', { results : items, user : req.user });
  });
});

/* GET */
app.get('/cart/:id', function(req, res){
  cart_collection.find({username: req.params.id}, function(err, items){
    if(err) throw err;
    res.render('cart', { results : items, user : req.user });
  });
});

/* CREATE */
app.post('/cart', function(req,res){
  cart_collection.insert({
    username: req.body.username,
    title: req.body.title,
    product_id: req.body.product_id,
    type: req.body.type,
    stock: req.body.stock,
    price: req.body.price
  }, function(err,item){
    if(err) throw err;
    res.json(item);
  });
});

/* DELETE */
app.delete('/cart/:id', function(req, res){
  cart_collection.remove({_id: req.params.id}, function(err, item){
    if(err) throw err;
    res.json(item);
  });
});
//END  Shopping Cart Routes*********************************************
// Driving Range Routes*********************************************
/* GET */
app.get('/driving-range/:page',function(req, res, next){
  var perPage = 2
  var page = req.params.page || 1

  RangeBalls
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, range_balls) {
      RangeBalls.count().exec(function(err, count) {
        if (err) return next(err)
        res.render('driving-range', {
            results: range_balls,
            user : req.user,
            current: page,
            pages: Math.ceil(count / perPage)
        });
      });
    });
});
    
/* Add Update */
app.put('/driving-range/:id', function(req,res){
  range_balls_collection.update(
    {_id: req.params.id}, 
    { $set: {
      title:req.body.title,
      quantity:req.body.quantity,
      image:req.body.image,
      price: req.body.price,
      is_deleted: false
    }},
    function(err,range_balls){
      if(err) throw err;
      res.json(range_balls);
    });
});

/* GET search and filter */
app.get('/driving-range-search', function(req, res){
  if(req.query.search != null){
    var search = req.query.search;
  } else if(req.query.filter != null){
    var filter = req.query.filter;
  }
  var out = [];
  
  if(filter != null){
    if(filter === 'less'){
      range_balls_collection.find({}, function(err, range_balls){
        if(err) throw err;
        range_balls.forEach(function(rangeball){
          if(rangeball.price < 20){
            out.push(rangeball);
          }
        });
        res.render('driving-range-search', { results : out, user : req.user });
      })
    } else if(filter === 'more'){
      range_balls_collection.find({}, function(err, range_balls){
        if(err) throw err;
        range_balls.forEach(function(rangeball){
          if(rangeball.price >= 20){
            out.push(rangeball);
          }
        });
        res.render('driving-range-search', { results : out, user : req.user });
      })
    }
  } else if(search != null){
    range_balls_collection.find({}, function(err, range_balls){
      if(err) throw err;
      range_balls.forEach(function(rangeball){
        if(rangeball.title.toLowerCase().includes(search.toLowerCase())){
          out.push(rangeball);
        }
      });
      res.render('driving-range-search', { results : out, user : req.user });
    });
  } else {
    range_balls_collection.find({}, function(err, range_balls){
      if(err) throw err;
      res.render('driving-range', { results : range_balls, user : req.user });
    });
  }
});

/* Add Update */
app.put('/driving-range/:id', function(req,res){
  range_balls_collection.update(
    {_id: req.params.id}, 
    { $set: {
      title:req.body.title,
      quantity:req.body.quantity,
      image:req.body.image,
      price: req.body.price,
      is_deleted: false
    }},
    function(err,range_balls){
      if(err) throw err;
      res.json(range_balls);
    });
});

/* CREATE */
app.post('/driving-range', function(req, res){
  range_balls_collection.insert({
    title: req.body.title,
    quantity: req.body.quantity,
    image: req.body.image,
    price: req.body.price,
    is_deleted: false
  }, function(err,item){
    if(err) throw err;
    res.redirect('driving-range/1');
  });
});

/* SOFT DELETE */
app.put('/driving-range/delete/:id', function(req,res){
  range_balls_collection.update(
    {_id: req.params.id}, 
    { $set: {
      is_deleted:true
    }},
    function(err,range_balls){
      if(err) throw err;
      res.json(range_balls);
    });
});
// END Driving Range Routes*********************************************
// Instructor Routes*********************************************
app.get('/instructors/:page',function(req, res, next){
  var perPage = 2
  var page = req.params.page || 1

  Instructors
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, instructors) {
      Instructors.count().exec(function(err, count) {
        if (err) return next(err)
        res.render('instructors', {
          results: instructors,
          user : req.user,
          current: page,
          pages: Math.ceil(count / perPage)
        });
      });
    });
});

app.get('/instructors-search', function(req, res){
  if(req.query.search != null){
    var search = req.query.search;
  }
  var out = [];
  
  if(search != null){
    instructors_collection.find({}, function(err, instructors){
      if(err) throw err;
      instructors.forEach(function(instructor){
        if(instructor.name.toLowerCase().includes(search.toLowerCase())){
          out.push(instructor);
        }
      });
      res.render('instructors-search', { results : out, user : req.user });
    });
  } else {
    instructors_collection.find({}, function(err, instructors){
      if(err) throw err;
      res.render('instructors', { results : instructors, user : req.user });
    });
  }
});

app.get('/instructors', function(req, res){
  var request = req.query.search;
  var out = [];

  if(request != null){
    instructors_collection.find({}, function(err, instructors){
      if(err) throw err;
      instructors.forEach(function(instructor){
        if(instructor.name.toLowerCase().includes(request.toLowerCase())){
          out.push(instructor);
        }
      });
      res.render('instructors', { results : out, user : req.user });
    });
  } else {
    instructors_collection.find({}, function(err, instructors){
      if(err) throw err;
      res.render('instructors', { results : instructors, user : req.user });
    });
  }
});

/* UPDATE */
app.put('/instructors/:id', function(req,res){
  instructors_collection.update(
    {_id: req.params.id}, 
    { $set: {
      name:req.body.name,
      image:req.body.image,
      experience:req.body.experience,
      description: req.body.description,
      rate: req.body.rate,
      availability: req.body.availability,
      is_deleted: false
    }},
    function(err,instructors){
      if(err) throw err;
      res.json(instructors);
    });
});

/* CREATE */
app.post('/instructors', function(req, res){
  instructors_collection.insert({
    name: req.body.name,
    image: req.body.image,
    experience: req.body.experience,
    description: req.body.description,
    rate: req.body.rate,
    availability: req.body.availability,
    is_deleted: false
  }, function(err,item){
    if(err) throw err;
    res.redirect('instructors/1');
  })
})

/* SOFT DELETE */
app.put('/instructors/delete/:id', function(req,res){
  instructors_collection.update(
    {_id: req.params.id}, 
    { $set: {
      is_deleted:true
    }},
    function(err,instructors){
      if(err) throw err;
      res.json(instructors);
    });
});
// END Instructor Routes*********************************************
// Club Rental Routes*********************************************
app.get('/club-rental/:page',function(req, res, next){
  var perPage = 2
  var page = req.params.page || 1

  Rentals
    .find({})
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec(function(err, rentals) {
      Rentals.count().exec(function(err, count) {
            if (err) return next(err)
            res.render('club-rental', {
                results: rentals,
                user : req.user,
                current: page,
                pages: Math.ceil(count / perPage)
            });
      });
    });
});

app.get('/club-rental-search', function(req, res){
  if(req.query.search != null){
    var search = req.query.search;
  } else if(req.query.filter != null) {
    var filter = req.query.filter;
  }
  var out = [];

  if(filter != null){
    if(filter === "less"){
      rental_collection.find({}, function(err, rentals){
        if(err) throw err;
        rentals.forEach(function(rental){
          if(rental.price < 100){
            out.push(rental);
          }
        });
        res.render('club-rental-search', { results : out, user : req.user });
      });
    } else if(filter === 'more'){
      rental_collection.find({}, function(err, rentals){
        if(err) throw err;
        rentals.forEach(function(rental){
          if(rental.price >= 100){
            out.push(rental);
          }
        });
        res.render('club-rental-search', { results : out, user : req.user });
      })
    }
  } else if(search != null){
    rental_collection.find({}, function(err, rentals){
      if(err) throw err;
      rentals.forEach(function(rental){
        full_title = rental.brand+" "+rental.title;
        if(full_title.toLowerCase().includes(search.toLowerCase())){
          out.push(rental);
        }
      });
      res.render('club-rental-search', { results : out, user : req.user });
    });
  } else {
    rental_collection.find({}, function(err, rentals){
      if(err) throw err;
      res.render('club-rental', { results : rentals, user : req.user });
    });
  }
});

/* UPDATE */
app.put('/club-rental/:id', function(req,res){
  rental_collection.update(
    {_id: req.params.id}, 
    { $set: {
      title: req.body.title,
      brand: req.body.brand,
      quantity: req.body.quantity,
      description: req.body.description,
      image: req.body.image,
      price: req.body.price,
      stock: req.body.stock,
      is_deleted: false
    }},
    function(err,rentals){
      if(err) throw err;
      res.json(rentals);
    });
});

/* UPDATE stock */
app.patch('/club-rental/stock/:id', function(req,res){
  rental_collection.update(
    {_id: req.params.id}, 
    { $set: {
      stock: req.body.stock
    }},
    function(err,rentals){
      if(err) throw err;
      res.json(rentals);
    });
});

/* CREATE */
app.post('/club-rental', function(req, res){
  rental_collection.insert({
    title: req.body.title,
    quantity: req.body.quantity,
    image: req.body.image,
    price: req.body.price,
    is_deleted: false
  }, function(err,item){
    if(err) throw err;
    res.redirect('club-rental/1');
  })
})

/* SOFT DELETE */
app.put('/club-rental/delete/:id', function(req,res){
  rental_collection.update(
    {_id: req.params.id}, 
    { $set: {
      is_deleted:true
    }},
    function(err,rentals){
      if(err) throw err;
      res.json(rentals);
    });
});
// END Club Rental Routes*********************************************
// Login/Logout Routes*********************************************
app.get('/login', function(req, res) {
    res.render('login');
});

app.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('home');
});

// Logout Route
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
// END Login/Logout Routes*********************************************

module.exports = app;
