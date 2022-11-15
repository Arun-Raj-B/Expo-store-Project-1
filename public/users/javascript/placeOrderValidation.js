$("#formValidation").validate({
  rules: {
    address: {
      required: true,
    },
    pincode: {
      minlength: 6,
      maxlength: 6,
      required: true,
    },
    mobile: {
      minlength: 10,
      maxlength: 10,
      required: true,
    },
  },
  messages: {
    address: {
      required: "Please enter the address",
    },

    pincode: {
      minlength: "Pincode should be of 6 digits",
      maxlength: "Pincode is not valid",
      required: "Please enter your pincode",
    },

    mobile: {
      minlength: "Mobile number should be of 10 digits",
      maxlength: "Number is not valid",
      required: "Please enter your mobile number",
    },
  },

  submitHandler: function (form) {
    form.submit();
  },
});
