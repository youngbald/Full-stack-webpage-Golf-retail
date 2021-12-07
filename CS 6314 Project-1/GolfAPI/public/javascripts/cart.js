$(document).ready(function(){

  //Show Total on Cart Page
  var prices = document.getElementsByClassName('price');
  var total = 0;
  Array.from(prices).forEach(function(price){
    var text = price.innerHTML;
    var raw_price = text.substring(1);
    total += parseFloat(raw_price);
  });
  var price_goes_here = document.getElementById('price-here')
  price_goes_here.append(`Total Price: $${total.toFixed(2)}`)

  // DELETE item from cart
  $('.delete-item-in-cart').click(function(){
    var cart_item_id = $(this).attr('id');
    var product_id = $(this).attr('for');
    var current_stock = parseInt($(this).attr('label'));

    //object to perform partial update of stock
    var update_stock = {
      stock: current_stock+1
    }

    if(current_stock > 0){
      //Update stock of clubs (add) when deleting item from cart
      $.ajax({
        method: 'PATCH',
        url: '/club-rental/stock/'+ product_id,
        data: update_stock,
        success: function(item){
          return item;
        },
        error: function(){
          alert("error updating stock for rental item");
        }
      })
    }
  
    //After updating stock, perform actual delete of item from cart
    $.ajax({
      method: 'DELETE',
      url: '/cart/'+cart_item_id,
      success: function(item){
        location.reload();
      },
      error: function(){
        alert("error removing item from cart");
      }
    })
  })

  //Submit Order
  $('.submit-order').click(function(){
    var cart_rows = document.getElementsByTagName('tr');
    var iusername = document.getElementById("welcome-cart").getAttribute("for");
    cart_rows_arr = Array.from(cart_rows);
    var orders = [];
    var cart_item_ids = [];

    //for each row in the cart get important information
    for(var i=1; i < cart_rows_arr.length; i++){
      var ititle = cart_rows_arr[i].children[0].innerHTML;
      var itype = cart_rows_arr[i].children[1].innerHTML;
      var iprice = cart_rows_arr[i].children[2].innerHTML;
      var cart_item_id = cart_rows_arr[i].children[3].children[0].getAttribute('id')
      
      //object to hold cart items
      var order_item = {
        username: iusername,
        title: ititle,
        type: itype,
        price: iprice
      }
      cart_item_ids.push(cart_item_id);
      orders.push(order_item);
    }
    
    //add list of cart items for the user to the orders collection
    orders.forEach(function(order){
      $.ajax({
        method: 'POST',
        url: '/orders',
        data: order,
        success: function(){},
        error: function(){
          alert("error adding club rental item to order");
        }
      });
    });
    //remove list of items for the user from the cart collection
    cart_item_ids.forEach(function(item){
      $.ajax({
        method: 'DELETE',
        url: '/cart/'+item,
        success: function(item){
          return item;
        },
        error: function(){
          alert("error removing item from cart after submit");
        }
      });
    });
    location.reload();
  });
});