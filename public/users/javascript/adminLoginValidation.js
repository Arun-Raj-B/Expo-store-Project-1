$("#formValidation").validate({
  rules: {
    username: {
      minlength: 4,
    },

    password: {
      required: true,
    },
  },
  messages: {
    username: {
      required: "Please enter username",
      minlength: "Requires minimum of 4 characters",
    },

    password: {
      required: "Please enter a password",
    },
  },

  submitHandler: function (form) {
    form.submit();
  },
});
