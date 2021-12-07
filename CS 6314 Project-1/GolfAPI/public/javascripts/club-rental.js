$(document).ready(function(){
  
  // Add rental to cart
  $('.add-to-cart-rental').click(function(){
    //get important info from page
    var ititle = $(this).siblings('.card-title')[0].innerHTML;
    var iprice = $(this).siblings('.card-text')[1].innerHTML;
    var istock = parseInt(($(this).siblings('.card-text')[2].innerHTML).substring(7));
    var itype = "rental";
    var iusername = $('#welcome-rental').attr('for');
    var iid = $(this).attr('id');
    
    //object to add item to cart
    var cart_item = {
      username: iusername,
      title: ititle,
      product_id: iid,
      type: itype,
      stock: istock-1,
      price: iprice
    }

    var update_stock = {
      stock: istock-1
    }

    //update stock for rental clubs
    $.ajax({
      method: 'PATCH',
      url: '/club-rental/stock/'+ iid,
      data: update_stock,
      success: function(item){
        return item;
      },
      error: function(){
        alert("error updating stock for rental item");
      }
    })

    //add item to cart
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
    var ctitle = $('#title').val();
    var cbrand = $('#brand').val();
    var cdescription = $('#description')
    var cimagefile = $('#image').val();
    var cprice = $('#price').val();
    var cstock = $('#stock').val();

    var club_rental = {
      title: ctitle,
      brand: cbrand,
      description: cdescription,
      image: cimagefile,
      price: cprice,
      stock: cstock
    }

    $.ajax({
      method: 'POST',
      url: '/club-rental',
      data: club_rental,
      success: function(page){
        return page;
      },
      error: function(){
        alert("error adding club rental item");
      }
    })
  })

  // UPDATE
  $('#update').click(function(){
    var cid = $('#update-id').val();
    var ctitle = $('#update-title').val();
    var cbrand = $('#update-brand').val();
    var cdescription = $('#update-description').val();
    var cimagefile = $('#update-image').val();
    var cprice = $('#update-price').val();
    var cstock = $('#update-stock').val();

    var club_rental = {
      title: ctitle,
      brand: cbrand,
      description: cdescription,
      image: cimagefile,
      price: cprice,
      stock: cstock
    }

    console.log(cid);
    console.log(club_rental);
    $.ajax({
      method: 'PUT',
      url: '/club-rental/'+cid,
      data: club_rental,
      success: function(){
        location.href = '/club-rental/1';
      },
      error: function(){
        alert("error updating club rental item");
      }
    })
  })

  // SOFT DELETE
  $(document).on('click', '.btn-danger', function(){
    var rental_id = $(this).attr('id');
    console.log(rental_id);
    $.ajax({
      type: 'PUT',
      url: '/club-rental/delete/'+rental_id,
      data: JSON.stringify({ is_deleted: true }),
      success: function(){
        location.href = '/club-rental/1';
      },
      error: function(){
        alert("error soft deleting range ball item");
      }
    });
  });

  $('#search-btn').click(function(){
    var search = $('#search-input').val();
    console.log(search);
    var search_obj = {
      searchTerm: search
    }
    console.log(search_obj);
    $.ajax({
      type: 'GET',
      url: '/club-rental-search',
      contentType: "application/json",
      data: search,
      success: function(page){
        return page;
      },
      error: function(){
        // alert("error searching for itm");
      }
    });
  });

  $('#less-than-100').click(function(){   
    var filter_data = {filter: "less"}; 
    $.ajax({
      type: 'GET',
      url: '/club-rental-search',
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

  $('#greater-than-100').click(function(){   
    var filter_data = {filter: "more"}; 
    $.ajax({
      type: 'GET',
      url: '/club-rental-search',
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