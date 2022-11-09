$("#formValidation").validate({
  rules: {
    category: {
      required: true,
    },
  },
  messages: {
    category: {
      required: "Please enter the category name",
    },
  },

  submitHandler: function (form) {
    form.submit();
  },
});
