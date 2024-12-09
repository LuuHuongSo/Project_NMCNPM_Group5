
function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  if (sidebar.style.width === "250px") {
      sidebar.style.width = "0";
  } else {
      sidebar.style.width = "250px";
  }
}


// Chuyển đổi giữa chế độ khách hàng và chủ cửa hàng
document.getElementById("customerBtn").onclick = function () {
  var customerLogin = document.querySelector(".customer-login");
  customerLogin.style.display = "block";
  document.querySelector(".confirm-btn").addEventListener("click", event => {
    alert('Login as Customer');
    window.location.href = 'index.html';
    localStorage.setItem("role", "CUSTOMER");
    localStorage.setItem("token", null);
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
      localStorage.setItem("token", result.jwt);
      localStorage.setItem("email", result.email);
      localStorage.setItem("role", "MANAGER");

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


document.addEventListener('DOMContentLoaded', () => {
  const roleDisplay = document.getElementById('roleDisplay');
  
  // Lấy role từ localStorage
  const role = localStorage.getItem('role');
  
  // Kiểm tra role có phải là "manager"
  if (role === 'MANAGER') {
    roleDisplay.style.display = 'inline-block'; // Hiển thị nút nếu là manager
  }
});
