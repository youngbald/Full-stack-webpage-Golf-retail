$(document).ready(function(){
  
  // Add item to cart
  $('.add-to-cart-rangeball').click(function(){
    // Get important info from page
    var ititle = $(this).siblings('.card-title')[0].innerHTML;
    var iprice = $(this).siblings('.card-text')[0].innerHTML;
    var itype = "rangeball";
    var iusername = $('#welcome-rangeball').attr('for');

    // Object to add to cart
    var cart_item = {
      username: iusername,
      title: ititle,
      type: itype,
      price: iprice
    }

    // Add item to cart
    $.ajax({
      method: 'POST',
      url: '/cart',
      data: cart_item,
      success: function(item){
        location.reload();
      },
      error: function(){
        alert("error adding club rental item");
      }
    })
  })

  // CREATE
  $('#add').click(function(){
    var rtitle = $('#title').val();
    var rquantity = $('#quantity').val();
    var rimagefile = $('#image').val();
    var rprice = $('#price').val();

    var range_item = {
      title: rtitle,
      quantity: rquantity,
      image: rimagefile,
      price: rprice
    }

    $.ajax({
      method: 'POST',
      url: '/driving-range',
      data: range_item,
      success: function(page){
        return page;
      },
      error: function(){
        alert("error adding range item");
      }
    })
  })

  // UPDATE
  $('#update').click(function(){
    var rid = $('#update-id').val();
    var rtitle = $('#update-title').val();
    var rquantity = $('#update-quantity').val();
    var rimagefile = $('#update-image').val();
    var rprice = $('#update-price').val();

    var range_item = {
      title: rtitle,
      quantity: rquantity,
      image: rimagefile,
      price: rprice
    }
    console.log(rid);
    console.log(range_item);
    $.ajax({
      method: 'PUT',
      url: '/driving-range/'+rid,
      data: range_item,
      success: function(){
        location.href = '/driving-range/1';
      },
      error: function(){
        alert("error updating range ball item");
      }
    })
  })

  // SOFT DELETE
  $(document).on('click', '.btn-danger', function(){
    var rangeball_id = $(this).attr('id');
    console.log(rangeball_id);
    $.ajax({
      type: 'PUT',
      url: '/driving-range/delete/'+rangeball_id,
      data: JSON.stringify({ is_deleted: true }),
      success: function(){
        location.href = '/driving-range/1';
      },
      error: function(){
        alert("error soft deleting range ball item");
      }
    });
  });

  $('#search-btn').click(function(){
    var search = $('#search-input').val();
    console.log(search);
    $.ajax({
      type: 'GET',
      url: '/driving-range-search',
      contentType: "application/json",
      data: search,
      success: function(page){
        return page;
      },
      error: function(){
        // alert("error searching for item");
      }
    });
  });

  $('#less-than-20').click(function(){   
    var filter_data = {filter: "less"}; 
    $.ajax({
      type: 'GET',
      url: '/driving-range-search',
      contentType: 'application/json',
      data: filter_data,
      success: function(page){
        console.log(page);
        return page;
      },
      error: function(){
        alert("error filtering for item");
      }
    });
  });

  $('#greater-than-20').click(function(){   
    var filter_data = {filter: "more"}; 
    $.ajax({
      type: 'GET',
      url: '/driving-range-search',
      contentType: 'application/json',
      data: filter_data,
      success: function(page){
        console.log(page);
        return page;
      },
      error: function(){
        alert("error filtering for item");
      }
    });
  });
});