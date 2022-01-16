const fullNameRegex = /[0-9]/;
let isEmailExist = false;

function validateFullName(fullName) {
  let result = false;
  if (fullName.indexOf(" ") === 0) {
    $('#full-name-message').addClass('error').removeClass('success').html("Full name does not contain space at beginning");
  }
  else if (fullName.lastIndexOf(" ") === (fullName.length - 1)) {
    $('#full-name-message').addClass('error').removeClass('success').html("Full name does not contain space at the end");
  }
  else if (fullName.match(fullNameRegex)) {
    $('#full-name-message').addClass('error').removeClass('success').html("Full name contain only a-z, A-z");
  } else {
    $('#full-name-message').addClass('success').removeClass('error').html("Valid full name");
    result = true;
  }
  return result;
}

function checkEmailExist(email) {
  //call user api to check if email is exist
  $.getJSON('/api/users/check-email-exist', { email }, function (data) {
    console.log(data);
    if (!data) {
      $('#email-message').addClass('success').removeClass('error').html("Valid email");
      isEmailExist = false;
    } else {
      $('#email-message').addClass('error').removeClass('success').html("Email is already taken");
      isEmailExist = true;
    }
  });
}

function validatePassword(password) {
  let result = false;
  if (password.indexOf(' ') >= 0) {
    $('#password-message').addClass('error').removeClass('success').html("Password does not contain any space");
  } else if (password.length < 6) {
    $('#password-message').addClass('error').removeClass('success').html("Password must contains at least 6 characters");
  } else {
    $('#password-message').addClass('success').removeClass('error').html("Valid password");
    result = true;
  }
  return result;
}

function confirmPassword(confirmPassword) {
  let result = false;
  const password = document.getElementById("password").value;
  if (password !== confirmPassword) {
    $('#retype-message').addClass('error').removeClass('success').html("Password does not match");
  } else {
    $('#retype-message').html("");
    result = true;
  }
  return result;
}

function onSubmit() {
  const isFullNameValid = validateFullName($('#full-name').val());
  const isPassWordValid = validatePassword($('#password').val());
  const isRetypeValid = confirmPassword($('#retype').val());
  if (isFullNameValid && isPassWordValid && isRetypeValid && !isEmailExist) {
    return true;
  }
  return false;
}
