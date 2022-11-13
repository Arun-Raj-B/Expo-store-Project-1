function addToCart(proId) {
  $.ajax({
    url: "/addToCart/" + proId,
    method: "get",
    success: (response) => {
      if (response.status) {
        let count = $("#cart-count").html();
        count = parseInt(count) + 1;
        $("#cart-count").html(count);
      }
    },
  });
}

function addToWishlist(proId) {
  $.ajax({
    url: "/addToWishlist/" + proId,
    method: "get",
    success: (response) => {
      if (response.status) {
        let count = $("#wishlist-count").html();
        count = parseInt(count) + 1;
        $("#wishlist-count").html(count);
      }
    },
  });
}
