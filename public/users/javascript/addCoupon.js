$("#couponForm").validate({
  rules: {
    name: {
      required: true,
    },
    limit: {
      required: true,
    },
    discount: {
      required: true,
    },
    date: {
      required: true,
    },
  },
  messages: {
    name: {
      required: "Enter a name",
    },
    limit: {
      required: "Enter the base limit",
    },
    discount: {
      required: "Enter the discount amount",
    },
    date: {
      required: "Enter a date",
    },
  },

  submitHandler: function (form) {
    form.submit();
  },
});
