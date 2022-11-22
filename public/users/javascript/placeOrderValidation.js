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
            if (response.codSuccess) {
              let count = $("#cart-count").html();
              count = 0;
              $("#cart-count").html(count);
              toastMixin.fire({
                animation: true,
                title: "Order has been placed ",
              });
              const timeOut = setTimeout(reloadPage, 1600);

              function reloadPage() {
                window.location.href = window.location.origin + "/orders";
                clearTimeout(timeOut);
              }
            } else {
              razorpayPayment(response);
            }
          },
        });
      }
    });
  },
});

function razorpayPayment(order) {
  var options = {
    key: "rzp_test_xcBZfvinv5ykWl", // Enter the Key ID generated from the Dashboard
    amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
    currency: "INR",
    name: "EXPOstore",
    description: "Test Transaction",
    image: "../images/logos/Razorpay.jpg",
    order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
    handler: function (response) {
      // alert(response.razorpay_payment_id);
      // alert(response.razorpay_order_id);
      // alert(response.razorpay_signature);

      verifyPayment(response, order);
    },
    prefill: {
      name: "Gaurav Kumar",
      email: "gaurav.kumar@example.com",
      contact: "9999999999",
    },
    notes: {
      address: "Razorpay Corporate Office",
    },
    theme: {
      color: "#ece6d9",
    },
  };
  var rzp1 = new Razorpay(options);
  rzp1.open();
}

function verifyPayment(payment, order) {
  $.ajax({
    url: "/verifyPayment",
    data: {
      payment,
      order,
    },
    method: "post",
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
      } else {
        toastMixin.fire({
          title: response.errMsg,
          icon: "error",
        });
      }
    },
  });
}

//success / failed toast message
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
