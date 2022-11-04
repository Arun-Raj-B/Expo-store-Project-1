$("#formValidation").validate({
  rules: {
    firstname: {
      minlength: 3,
    },
    lastname: {
      minlength: 1,
    },
    username: {
      minlength: 4,
    },
    email: {
      email: true,
    },
    password: {
      required: true,
      checkpassword: true,
    },
    confirmpassword: {
      required: true,
      equalTo: "#password",
    },
    mobilenumber: {
      number: true,
      minlength: 10,
      maxlength: 10,
    },
  },
  messages: {
    firstname: {
      required: "Please enter first name",
      minlength: "Requires minimum of 3 characters",
    },

    lastname: {
      required: "Please enter last name",
      minlength: "Requires minimum of 1 character",
    },
    username: {
      required: "Please enter username",
      minlength: "Requires minimum of 4 characters",
    },

    email: {
      required: "Please enter the email",
      email: "Enter a valid email",
    },

    password: {
      required: "Please enter a password",
    },

    confirmpassword: {
      required: "Please confirm the password",
      equalTo: "Password doesn't match",
    },

    mobilenumber: {
      required: "Please enter the mobile number",
      minlength: "Required 10 digits",
      maxlength: "Cannot be more than 10 digits",
    },
  },

  submitHandler: function (form) {
    form.submit();
  },
});

jQuery.validator.addMethod(
  "checkpassword",
  function (value, element) {
    return this.optional(element) || /^[\w@-]{8,20}$/i.test(value);
  },
  "Password must be alphanumeric (@, _ and - are also allowed) and be 8 - 20 characters"
);
