
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar.style.width === "250px") {
      sidebar.style.width = "0";
  } else {
      sidebar.style.width = "250px";
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const role = sessionStorage.getItem('role');
  
  if (role === 'MANAGER') {
    const ManagerMode = document.querySelector('.managermode');
    const loginButton = document.querySelector('.login-btn');

    if (ManagerMode) {
      ManagerMode.style.display = 'inline-block'; // Hiển thị MANAGER
    }
    if (loginButton) {
      loginButton.style.display = 'none'; // Ẩn nút Login
    }
  }
});

// Chuyển đổi giữa chế độ khách hàng và chủ cửa hàng
document.getElementById("customerBtn").onclick = function () {
  var customerLogin = document.querySelector(".customer-login");
  customerLogin.style.display = "block";
  document.querySelector(".confirm-btn").addEventListener("click", event => {
    alert('Login as Customer');
    window.location.href = 'index.html';
    sessionStorage.setItem("role", "CUSTOMER");
    sessionStorage.setItem("token", null);
  });
  document.querySelector(".owner-login").style.display = "none";
};
  
document.getElementById("ownerBtn").onclick = function () {
  document.querySelector(".owner-login").style.display = "block";
  document.querySelector(".customer-login").style.display = "none";
};
  
document.getElementById("ownerLoginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  try {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();

    if (response.ok && result.message === "Login Successfully!") {
      sessionStorage.setItem("token", result.jwt);
      sessionStorage.setItem("email", result.email);
      sessionStorage.setItem("role", "MANAGER");

      alert("Login successful!");
      window.location.href = "index.html";
    } else {
      alert(result.message || "Login failed!");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Unable to connect to the server. Please try again later.");
  }
});




