$(function () {
  // $('a#updata').click(function (event) {
  //   // alert(event,'dfdsfdsf');
  //   $.get('/getdata');
  // });
 
});
$('.form-div').hide();
$('#updata').submit(function (e) {
  e.preventDefault();

  $('.form-div').toggle();
  // $('.form-div').toggleClass('popup1');
});

$('#delete').click(function () {
  $('.form-div').toggle();

  // $('.form-div').toggleClass('popup1');
});
