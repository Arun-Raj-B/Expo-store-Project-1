$("#formValidation").validate({
  rules: {
    email: {
      email: true,
    },
    password: {
      required: true,
    },
  },
  messages: {
    email: {
      required: "Please enter the email",
      email: "Enter a valid email",
    },

    password: {
      required: "Please enter a password",
    },
  },

  submitHandler: function (form) {
    form.submit();
  },
});
