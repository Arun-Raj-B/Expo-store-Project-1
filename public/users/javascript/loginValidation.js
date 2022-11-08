$("#loginFormValidation").validate({
  rules: {
    email: {
      required: true,
      email: true,
    },
    messages: {
      email: {
        required: "Please enter the email",
        email: "Enter a valid email",
      },
    },

    submitHandler: function (form) {
      form.submit();
    },
  },
});
