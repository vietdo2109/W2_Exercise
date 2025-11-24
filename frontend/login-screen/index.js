const loginForm = document.getElementById("login-form");

loginForm.addEventListener("submit", function (e) {
  e.preventDefault(); // prevent page reload

  const username = document.getElementById("username-input").value;
  const password = document.getElementById("password-input").value;
  const loadingSpinner = document.querySelector(".loader");
  const buttonText = document.querySelector(".button-text");

  buttonText.style.display = "none";
  loadingSpinner.style.display = "block";

  setTimeout(() => {
    const usernameInput = document.getElementById("username-input");
    const passwordInput = document.getElementById("password-input");
    const errorMessage = document.getElementById("error-message");

    usernameInput.style.border = "none";
    passwordInput.style.border = "none";
    errorMessage.style.display = "none";

    if (username === "john" && password === "1234") {
      window.location.href = "/dashboard-screen/index.html";
    } else {
      usernameInput.style.border = "1px solid red";
      passwordInput.style.border = "1px solid red";
      errorMessage.style.display = "block";
    }
    buttonText.style.display = "block";
    loadingSpinner.style.display = "none";
  }, 2000);
});
