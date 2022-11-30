let seconds = 10;
let timer;
let OTPcount = 0;
console.log(timer);
function myFunction() {
  if (seconds < 10) {
    // I want it to say 1:00, not 60
    document.getElementById("timer").innerHTML = seconds;
  }
  if (seconds > 0) {
    // so it doesn't go to -1
    seconds--;
  } else {
    clearInterval(timer);
    document.getElementById("OTPcount").innerHTML = OTPcount++;
    document.getElementById("resendOTP").style.display = "block";
    document.getElementById("otp-text").style.display = "none";
  }
}

function counter() {
  console.log("working");
  if (!timer) {
    console.log("timer working");
    timer = window.setInterval(function () {
      myFunction();
    }, 1000); // every second
  }
}
document.getElementById("timer").innerHTML = "10";

//to start counter when the page loads
counter();

document.getElementById("resendOTP").onclick = function () {
  if (OTPcount == "4") {
    window.location.href = "/login";
  } else {
    $.ajax({
      url: "/resendOTP",
      method: "post",
      success: (response) => {
        console.log(response);
        timer = false;
        seconds = 10;
        document.getElementById("timer").innerHTML = "10";
        document.getElementById("resendOTP").style.display = "none";
        document.getElementById("otp-text").style.display = "block";
        counter();
      },
    });
  }
};
