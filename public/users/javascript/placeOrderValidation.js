$("#checkout-form").validate({
  rules: {
    house: {
      required: true,
    },
    street: {
      required: true,
    },
    district: {
      required: true,
    },
    state: {
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
    house: {
      required: "Enter house name",
    },
    street: {
      required: "Enter street name",
    },
    district: {
      required: "Enter the district",
    },
    state: {
      required: "Enter the state",
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
    Swal.fire({
      title: "Please confirm the order",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm!",
    }).then((result) => {
      if (result.isConfirmed) {
        let action = "/placeOrder";

        $.ajax({
          url: action,
          method: "post",
          data: $(form).serialize(),
          success: (response) => {
            if (response.status) {
              let count = $("#cart-count").html();
              count = 0;
              $("#cart-count").html(count);
              Swal.fire({
                position: "top-end",
                icon: "success",
                title: "Order has been placed",
                showConfirmButton: false,
                timer: 1500,
              });
            }
          },
        });
      }
    });
  },
});
