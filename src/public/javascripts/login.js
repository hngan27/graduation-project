document.getElementById('show-password').addEventListener('change', function () {
  var passwordField = document.getElementById('password');
  var type = this.checked ? 'text' : 'password';
  passwordField.setAttribute('type', type);
});
