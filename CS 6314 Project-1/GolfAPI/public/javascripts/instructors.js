$(document).ready(function(){
  
  // CREATE
  $('#add').click(function(){
    var iname = $('#name').val();
    var iimagefile = $('#image').val();
    var iexperience = $('#experience');
    var idescription = $('#description').val();
    var irate = $('#rate').val();
    var iavailability = $('#availability').val();

    var instructor = {
      name: iname,
      image: iimagefile,
      experience: iexperience,
      description: idescription,
      rate: irate,
      availability: iavailability
    }

    $.ajax({
      method: 'POST',
      url: '/instructors',
      data: instructor,
      success: function(page){
        return page;
      },
      error: function(){
        alert("error adding instructor");
      }
    })
  })

  // UPDATE
  $('#update').click(function(){
    var iid = $('#update-id').val();
    var iname = $('#update-name').val();
    var iimagefile = $('#update-image').val();
    var iexperience = $('#update-experience').val();
    var idescription = $('#update-description').val();
    var irate = $('#update-rate').val();
    var iavailability = $('#update-availability').val();

    var instructor = {
      name: iname,
      image: iimagefile,
      experience: iexperience,
      description: idescription,
      rate: irate,
      availability: iavailability
    }

    console.log(iid);
    console.log(instructor);
    $.ajax({
      method: 'PUT',
      url: '/instructors/'+iid,
      data: instructor,
      success: function(){
        location.href = '/instructors/1';
      },
      error: function(){
        alert("error updating instructor");
      }
    });
  });

  // SOFT DELETE
  $(document).on('click', '.btn-danger', function(){
    var instructor_id = $(this).attr('id');
    console.log(instructor_id);
    $.ajax({
      type: 'PUT',
      url: '/instructors/delete/'+instructor_id,
      data: JSON.stringify({ is_deleted: true }),
      success: function(){
        location.href = '/instructors/1';
      },
      error: function(){
        alert("error soft deleting instructor");
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
      url: '/instructors',
      contentType: "application/json",
      data: search,
      success: function(page){
        return page;
      },
      error: function(){
        // alert("error searching for instructor");
      }
    });
  });
});