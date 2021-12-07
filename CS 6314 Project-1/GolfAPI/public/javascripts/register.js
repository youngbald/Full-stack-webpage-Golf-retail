$(document).ready(function(){

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll('.needs-validation');

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms)
    .forEach(function (form) {
      form.addEventListener('submit', function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add('was-validated')
      }, false)
    });

  var username = document.getElementById("username");
  var span1 = document.createElement("span");
  span1.style.display = "none";
  username.parentNode.appendChild(span1);

  var password = document.getElementById("passwordHelpBlock");
  var span2 = document.createElement("span");
  span2.style.display = "none"; //hide the span element
  password.parentNode.appendChild(span2);

  var form = document.getElementById("register-form");
  form.onsubmit = function(e){

    var username_string = $('#username').val();
    var password_string = $('#password').val();
    var password_regex_test = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\!\@\#\$\%\^\&\+)]).{6,}/;
    var password_OK = password_regex_test.test(password_string);

    if(!password_OK){
      password.className = "error";
      span2.style.display = "block";
      span2.style.color = "#dc3545";
      span2.style.fontSize = "12px";
      span2.innerHTML = "Password does not meet complexity requirements";
      e.preventDefault();
    }

    if(password_OK){
      var user = {
        username: username_string,
        password: password_string
      }

      $.ajax({
        method: 'POST',
        url: '/register',
        data: user,
        success: function(){},
        error: function(){
          alert("Change username!");
        }
      });
    }
  }
});