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
              var toastMixin = Swal.mixin({
                toast: true,
                icon: "success",
                title: "General Title",
                animation: false,
                position: "top-right",
                showConfirmButton: false,
                timer: 1500,
                timerProgressBar: true,
                didOpen: (toast) => {
                  toast.addEventListener("mouseenter", Swal.stopTimer);
                  toast.addEventListener("mouseleave", Swal.resumeTimer);
                },
              });
              toastMixin.fire({
                animation: true,
                title: "Order has been placed ",
              });
              const timeOut = setTimeout(reloadPage, 1600);

              function reloadPage() {
                window.location.href = window.location.origin + "/orders";
                clearTimeout(timeOut);
              }
            }
          },
        });
      }
    });
  },
});
