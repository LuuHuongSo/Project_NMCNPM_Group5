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

// xu ly hàm main
const orderList = [];
const menuApi = 'http://localhost:8080/menu';
const orderApi = 'http://localhost:8080/order';
const tableApi = 'http://localhost:8080/tables';
const menuApiMN = 'http://localhost:8080/api/admin/menu';
const tableApiMN = 'http://localhost:8080/api/admin/tables';
const orderApiMN = 'http://localhost:8080/api/admin/order';

function start() {
  getTables(renderTables);
  getMenuItem('all', function(filteredItems) { 
    renderMenu(filteredItems);
    setupTabs(); 
  });

  handleCreateForm();
  handleDeleteForm();
  applyRoleBasedActions(sessionStorage.getItem("role"));
}

start();

// thiet lap cac chuc nang customer
// xu ly menu
function getMenuItem(filterCategory, callback) {
  fetch(menuApi) 
    .then(function(response) {
      return response.json();
    })
    .then(function(menuItems) {
      const filteredItems = menuItems.filter(item => 
        filterCategory === 'all' || item.category === filterCategory
      );
      callback(filteredItems);
    })
    .catch(function(error) {
      console.log('Failed to fetch menu items:', error);
    });
}
function renderMenu(menuItems) {
  if(sessionStorage.getItem("role") === "CUSTOMER") {
    getMyOrder();
    var menuBlock = document.querySelector('.customer-menu-items');

    var htmls = menuItems.map(function(menuItem) {
      return `
      <div class="customer-menu-item">
        <img src="${menuItem.image}" alt="${menuItem.name}" class="menu-item-image" />
        <div class="menu-item-info">
          <p class="menu-item-name">${menuItem.name}</p>
          <p class="menu-item-price">Giá tiền: ${menuItem.price} VND</p>
          <button class="add-to-order" data-id="${menuItem.id}" 
          data-name="${menuItem.name}" 
          data-price="${menuItem.price}">Chọn</button>
        </div>
      </div>`;
    });
    menuBlock.innerHTML = htmls.join('');
    setUpAddtoOrderBtns();
} else if(sessionStorage.getItem("role") === "MANAGER") {
    var menuBlock = document.querySelector('.manager-menu-items');

    var htmls = menuItems.map(function(menuItem) {
    return `
        <div class="manager-menu-item">
          <img src="${menuItem.image}" alt="${menuItem.name}" class="menu-item-image" />
          <div class="menu-item-info">
            <p>Id sản phẩm: ${menuItem.id}</p>
            <p>${menuItem.name}</p>
            <p>Giá tiền: ${menuItem.price}</p>
            <button class="change-price" data-id="${menuItem.id}" data-name="${menuItem.name}">Cập nhật giá</button>
          </div>
        </div>`;
    });
    menuBlock.innerHTML = htmls.join('');
    setupChangePriceButton();
  }
}


function setupTabs() {
  if(sessionStorage.getItem("role") === "CUSTOMER") {
    const tabs = document.querySelectorAll('.customer-menu-tab');

    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        tabs.forEach(tab => tab.classList.remove('active'));
        this.classList.add('active');

        const selectedCategory = this.dataset.category;

        getMenuItem(selectedCategory, function(filteredItems) {
        renderMenu(filteredItems);
        });
      });
    });
  } else if(sessionStorage.getItem("role") === "MANAGER") {
    const tabs = document.querySelectorAll('.manager-menu-tab');

    tabs.forEach(tab => {
      tab.addEventListener('click', function () {
        tabs.forEach(tab => tab.classList.remove('active'));
        this.classList.add('active');

        const selectedCategory = this.dataset.category;

        getMenuItem(selectedCategory, function(filteredItems) {
        renderMenu(filteredItems);
        });
      });
    });
  }
}


function setUpAddtoOrderBtns() {
  const btns = document.querySelectorAll('.add-to-order');
  const orderContainer = document.querySelector('#order-list');

  btns.forEach(btn => {
    btn.addEventListener('click', function () {
      const id = this.dataset.id;
      const name = this.dataset.name;
      const price = this.dataset.price;

      const existingItem = orderList.find(item => item.id === id);
      if (existingItem) {
        alert('Đã thêm món này vào đơn đặt hàng');
        return;
      }

      const newItem = { id, name, price, quantity: 1 }; // Thêm thuộc tính quantity
      orderList.push(newItem);

      const li = document.createElement('li');
      li.classList.add('order-item');
      li.dataset.id = id;

      li.innerHTML = `
        ${name} - ${price} VND
        <button class="remove-order">Delete</button>
        <div class="quantity-container">
          <button class="decrease-quantity">-</button>
          <input type="number" id="quantity" value="1" readonly>
          <button class="increase-quantity">+</button>
        </div>
        <input type="text" placeholder="Thêm chi tiết..." class="special-instruction">
      `;

      // Xóa món
      li.querySelector('.remove-order').addEventListener('click', function () {
        removeOrderItem(id, li);
      });

      // Tăng số lượng
      li.querySelector('.increase-quantity').addEventListener('click', function () {
        const input = li.querySelector('#quantity');
        let quantity = parseInt(input.value);
        quantity += 1;
        input.value = quantity;

        // Cập nhật số lượng trong orderList
        const item = orderList.find(item => item.id === id);
        item.quantity = quantity;
      });

      // Giảm số lượng
      li.querySelector('.decrease-quantity').addEventListener('click', function () {
        const input = li.querySelector('#quantity');
        let quantity = parseInt(input.value);
        if (quantity > 1) {
          quantity -= 1;
          input.value = quantity;

          // Cập nhật số lượng trong orderList
          const item = orderList.find(item => item.id === id);
          item.quantity = quantity;
        }
      });

      orderContainer.appendChild(li);
    });
  });
}


function removeOrderItem(id, element) {
  // Xóa khỏi danh sách order
  const index = orderList.findIndex(item => item.id === id);
  if (index !== -1) {
      orderList.splice(index, 1);
  }
  element.remove();
}

// xu ly render ban
function getTables(callback) {
  fetch(tableApi) 
    .then((response) => {
      return response.json();
    })
    .then(callback)
    .catch((error) => {
      console.error('Error fetching tables:', error);
    });
}

function renderTables(tables) {
  if(sessionStorage.getItem("role") === "CUSTOMER") {
    var tablesBlock = document.querySelector('.customer-table-grid');

    var htmls = tables.map((table) => {
    return `<button class ='customer-table-btn' data-table='${table.number}'> Bàn ${table.number}</button>`
    });

    tablesBlock.innerHTML = htmls.join('');
    fetchOccupiedTables(tables);
  } else if(sessionStorage.getItem("role") === "MANAGER") {
    var tablesBlock = document.querySelector('.manager-table-grid');

    var htmls = tables.map((table) => {
      return `<button class ='manager-table-btn' data-table='${table.number}'> Bàn ${table.number}</button>`
    });
    tablesBlock.innerHTML = htmls.join('');
    fetchTableAndOrderData();
  }
}

function fetchOccupiedTables(tables) {
  const occupiedTables = tables.filter((table) => table.status === 'OCCUPIED');
  const occupiedTableNumbers = occupiedTables.map((table) => table.number);

  const customerTableButtons = document.querySelectorAll('.customer-table-btn');

  customerTableButtons.forEach((button) => {
    const tableNumber = Number(button.dataset.table);
    if(occupiedTableNumbers.includes(tableNumber)) {
      button.classList.add('occupied');
    } else {
      button.classList.remove('occupied');
    }

    button.addEventListener('click', function() {
      if(!button.classList.contains('occupied')) {
        document.querySelectorAll('.customer-table-btn.selected').forEach((btn) => {
          btn.classList.remove('selected');
        });

        button.classList.add('selected');
        const selectedTable = button.dataset.table;
        console.log( `Table ${selectedTable} selected.`);
      }
    });
  });
}

let myOrderId = sessionStorage.getItem('myOrderId') || 0; // Lấy từ sessionStorage nếu có
// Gửi order
document.querySelector('.send-order').addEventListener('click', async function () {
  const selectedButton = document.querySelector('.customer-table-btn.selected');
  const tableNumber = selectedButton ? Number(selectedButton.dataset.table) : null;

  if (!tableNumber) {
    alert('Vui lòng chọn bàn trước khi gửi order!');
    return;
  }

  try {
    // Lấy thông tin bàn từ API
    const response = await fetch(tableApi);
    const tables = await response.json();

    const selectedTable = tables.find((table) => table.number === tableNumber);
    if (!selectedTable) {
      alert('Bàn đã chọn không hợp lệ!');
      return;
    }

    // Tạo danh sách order items
    const orderItems = [];
    let totalAmount = 0;

    document.querySelectorAll('#order-list .order-item').forEach(item => {
      const menuItemId = item.dataset.id;
      const name = item.textContent.split(' - ')[0].trim();
      const price = parseInt(item.textContent.split(' - ')[1]);
      const quantity = parseInt(item.querySelector('#quantity').value);
      const specialInstruction = item.querySelector('.special-instruction').value || '';

      if (!quantity || quantity <= 0) {
        alert(`Vui lòng nhập số lượng hợp lệ cho món: ${name}`);
        throw new Error('Invalid quantity');
      }

      totalAmount += price * quantity;

      orderItems.push({
        menuItemId,
        quantity,
        price: price * quantity,
        specialInstruction
      });
    });

    if (orderItems.length === 0) {
      alert('Đơn hàng của bạn đang trống!');
      return;
    }


    const orderData = {
      table: selectedTable,
      customerId: 1,
      orderItems,
      orderStatus: "PENDING",
      totalAmount
    };

    // Gửi đơn hàng
    const orderResponse = await fetch(orderApi, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderData)
    });

    if (!orderResponse.ok) {
      throw new Error('Failed to send order');
    }

    const orderResult = await orderResponse.json();
    const myOrderId = orderResult.id;
    sessionStorage.setItem('myOrderId', myOrderId);
    alert('Đơn hàng đã gửi thành công!');

    console.log('Order response:', orderResult);

    // Gửi yêu cầu cập nhật trạng thái bàn
    selectedTable.status = "OCCUPIED";
    const tableUpdateResponse = await fetch(`${tableApi}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(selectedTable)
    });

    if (!tableUpdateResponse.ok) {
      throw new Error('Failed to update table status');
    }

    const updatedTable = await tableUpdateResponse.json();
    console.log('Updated table status:', updatedTable);

    // Xóa danh sách sau khi gửi
    document.querySelector('#order-list').innerHTML = '';
    window.location.reload();
  } catch (error) {
    console.error('Error:', error);
    alert('Có lỗi xảy ra khi gửi đơn hàng hoặc cập nhật trạng thái bàn.');
  }
});

async function getMyOrder(interval = 5000) {
  try {
    const storedOrderId = sessionStorage.getItem('myOrderId'); 
    if (!storedOrderId) {
      return;
    }

    // Fetch đơn hàng từ server
    const response = await fetch(`${orderApi}/${storedOrderId}`);
    if (!response.ok) {
      throw new Error('Không thể lấy thông tin đơn hàng');
    }

    const order = await response.json();
    renderOrder(order);
    if (order.orderStatus !== 'CONFIRM') {
      orderButton.classList.add('confirmed');
      // Hiển thị thông báo
      notification.classList.add('visible');
    } else {
      setTimeout(() => getMyOrder(interval), interval);
    }
  } catch (error) {
    console.error(error);
  }
}

function renderOrder(order) {

  const ordersContainer = document.querySelector('#customer-order-list-modal');
  ordersContainer.innerHTML = '';
  const payButtonHTML = order.orderStatus === 'CONFIRMED' ? '<button class="pay">Thanh toán</button>' : '';

  const orderHTML = `
    <div class="order">
      <p><strong>Bàn:</strong> ${order.table.number}</p>
      <p><strong>Trạng thái:</strong> ${order.orderStatus}</p>
      <p><strong>Thời gian:</strong> ${new Date(order.order_time).toLocaleString()}</p>
      <ul>
        ${order.orderItems.map(item => `
          <li>${item.menuItem.name} - ${item.quantity} x ${item.menuItem.price} = ${item.price}</li>
        `).join('')}
      </ul>
      <p><strong>Tổng tiền:</strong> ${order.total_amount}</p>
      ${payButtonHTML}
    </div>
  `;
  ordersContainer.innerHTML = orderHTML + ordersContainer.innerHTML;

  const payButton = document.querySelector('.pay');
  if (payButton) {
    payButton.addEventListener('click', async function() {
      try {
        // Cập nhật trạng thái đơn hàng thành "PAID"
        const response = await fetch(`${orderApi}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            orderId: order.id,
            status: 'PAID'
          })
        });

        if (!response.ok) {
          throw new Error('Không thể cập nhật trạng thái đơn hàng');
        }

        // Cập nhật lại giao diện
        order.orderStatus = 'PAID'; // Cập nhật trạng thái trên frontend
        renderOrder(order); // Hiển thị lại đơn hàng với trạng thái mới

        alert('Đơn hàng đã được thanh toán!');
      } catch (error) {
        console.error('Error:', error);
        alert('Có lỗi xảy ra khi thanh toán');
      }
    });
  }
}

// DOM elements
const showOrdersBtncm = document.getElementById('customer-show-orders');
const orderModalcm = document.getElementById('customer-order-modal');
const closeModalBtncm = document.getElementById('customer-close-modal');
const orderListModalcm = document.getElementById('customer-order-list-modal');


// Event listeners
showOrdersBtncm.addEventListener('click', () => {
  orderModalcm.classList.remove('hidden');
});

closeModalBtncm.addEventListener('click', () => {
  orderModalcm.classList.add('hidden');
});

// Hàm xử lý tìm kiếm theo thời gian thực
function handleSearchRealTime() {
  if(sessionStorage.getItem('role') === 'CUSTOMER') {
    const searchInput = document.querySelector('#customer-search').value.toLowerCase(); // Lấy giá trị nhập vào và chuyển về chữ thường
    getMenuItem('all', function(menuItems) { // Lấy toàn bộ danh sách món ăn
      const filteredItems = menuItems.filter(item => 
        item.name.toLowerCase().includes(searchInput) // Lọc các món ăn có tên chứa từ khóa
      );
    renderMenu(filteredItems); // Hiển thị kết quả lọc ngay lập tức
    });
  } else if(sessionStorage.getItem('role') === 'MANAGER') {
    const searchInput = document.querySelector('#manager-search').value.toLowerCase(); 
    getMenuItem('all', function(menuItems) { 
      const filteredItems = menuItems.filter(item => 
        item.name.toLowerCase().includes(searchInput) 
      );
    renderMenu(filteredItems);
    });
  } 
}

// Lắng nghe sự kiện trên ô tìm kiếm
function setupRealTimeSearch() {
  if(sessionStorage.getItem('role') === 'CUSTOMER') {
    const searchInput = document.querySelector('#customer-search'); // Lấy ô nhập liệu

    // Gắn sự kiện input để xử lý theo thời gian thực
    searchInput.addEventListener('input', handleSearchRealTime);
  } else if(sessionStorage.getItem('role') === 'MANAGER') {
    const searchInput = document.querySelector('#customer-search'); 

    searchInput.addEventListener('input', handleSearchRealTime);
  }
}

// Gọi hàm setupRealTimeSearch trong phần khởi tạo
document.addEventListener('DOMContentLoaded', () => {
  setupRealTimeSearch();
  setupTabs();
});


///////////////////////////////////////////////////////////////////////////////////////
// thiet lap cac chuc nang manager
// xu ly menu( them, xoa san pham)

function createMenuItem(menuItem,callback) {
  var option = {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(menuItem)
  }
  fetch(menuApi, option) 
    .then(function(response) {
      response.json();
    })
    .then(callback)
    .catch(function(error) {
      console.log("Error creating menu item:", error);
  });
}

function deleteMenuItem(id, callback) {
  var option = {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json; charset=UTF-8'
    }
  };
  
  fetch(`${menuApi}/${id}`, option) 
    .then(function(response) {
      if (!response.ok) {
        throw new Error("Failed to delete item");
      }
      return response.json();
    })
    .then(callback)
    .catch(function(error) {
      console.log("Error deleting menu item:", error);
      alert("Có lỗi khi xóa sản phẩm. Vui lòng thử lại.");
    });
}

function handleDeleteForm() {
  var deleteButton = document.querySelector('#deleteBtn');
  if (!deleteButton) {
    console.log('Không tìm thấy nút delete');
    return;
  }

  deleteButton.onclick = function() {
    var id = parseInt(document.getElementById('product-id').value, 10);
    
    if (isNaN(id) || id <= 0) {
      alert("Vui lòng nhập ID hợp lệ");
      return;
    }

    deleteMenuItem(id, function() {
      alert('Đã xóa sản phẩm');
      getMenuItem(renderMenu);
      window.location.reload();
    });
  };
}

function setupChangePriceButton() {
  var changePriceButtons = document.querySelectorAll('.change-price');

  changePriceButtons.forEach(button => {
    button.addEventListener('click', () => {
      const productId = button.dataset.id;
      const productName = button.dataset.name;

      document.getElementById('change-item-id').innerText = productId;
      document.getElementById('change-item-name').innerText = productName;

      const changeContainer = document.getElementById('change-container');
      changeContainer.classList.add('appear');

      // Xử lý nút submit
      const submitButton = document.getElementById('submit-price-btn');
      submitButton.onclick = () => {
        const newPrice = parseInt(document.getElementById('new-price-input').value);

        if (!newPrice || newPrice <= 0) {
          alert("Vui lòng nhập giá mới hợp lệ!");
          return;
        }

        var option = {
          method: 'PUT',
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({id: productId, price: newPrice})
        };
        fetch(menuApi, option)
          .then((response) => {
            if (!response.ok) {
              throw new Error('Failed to update price.');
            }
            return response.json();
          })
          .then(() => {
            alert("Cập nhật giá thành công!");
            window.location.reload(); // Reload trang để cập nhật UI
          })
          .catch(error => {
            console.error('Lỗi khi cập nhật giá:', error);
            alert("Đã xảy ra lỗi khi cập nhật giá.");
          });
      };
      const cancelButton = document.getElementById('cancel-price-btn');
      cancelButton.onclick = () => {
        changeContainer.classList.remove('appear');
      };
    });
  });
}

// hàm upload ảnh
function uploadImage(file, callback) {
  const cloudinaryUrl = "https://api.cloudinary.com/v1_1/ddcxxry4q/image/upload";
  const uploadPreset = "NMCNPM_Image"; // Tạo upload preset từ dashboard của Cloudinary.

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  fetch(cloudinaryUrl, {
    method: 'POST',
    body: formData
  })
  .then(response => response.json())
  .then(data => {
    if (data.secure_url) {
      callback(data.secure_url); // Gọi callback với URL ảnh sau khi upload thành công.
    } else {
      console.error('Failed to upload image:', data);
    }
  })
  .catch(error => console.error('Error uploading image:', error));
}


function handleCreateForm() {
  var createButton = document.querySelector('#createBtn');
  if (!createButton) {
    console.error('Không tìm thấy nút #createBtn');
    return;
  }
  createButton.onclick = function() {
    var name = document.getElementById('item-name').value;
    var price = parseInt(document.getElementById('item-price').value, 10);
    var description = document.getElementById('item-description').value;
    var fileInput = document.getElementById('menu-image');
    var category = document.getElementById('category').value;
    var file = fileInput.files[0];


    if (!name || !price || !category) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    //Upload ảnh trước
    uploadImage(file,(imageUrl) => {
      if (!imageUrl) {
        alert("Lỗi khi upload ảnh!");
        return;
      }

      var formData = {
        name: name,
        price : price,
        description: description,
        image: imageUrl,
        category: category,
        available: true
      };
      createMenuItem(formData, function() {
        alert("Thêm sản phẩm thành công!");
        getMenuItem(renderMenu);
        window.location.reload();
      });
    });
  }
}

function toggleAddItem() {
  const addItemContainer = document.getElementById("add-item-container");
  if (addItemContainer.style.display === "block") {
    addItemContainer.style.display = "none";
  } else {
    addItemContainer.style.display = "block";
  }
}
  
function toggleSubItem() {
  const subItemContainer = document.getElementById("sub-item-container");
  if(subItemContainer.style.display ==="block") {
    subItemContainer.style.display = "none";
  } else {
    subItemContainer.style.display = "block";
  }
}

// xử lý với table
function fetchTableAndOrderData() {
  const managerTablebuttons = document.querySelectorAll('.manager-table-btn');
  const orderDetailsContainer = document.getElementById('order-details'); // Khu vực hiển thị chi tiết đơn hàng

  Promise.all([
    fetch(tableApi).then((res) => res.json()),
    fetch(orderApi).then((res) => res.json()),
  ])
    .then(([tables, orders]) => {
      managerTablebuttons.forEach((button) => {
        const tableNumber = parseInt(button.dataset.table);
        const table = tables.find((tbl) => tbl.number === tableNumber);

        if (table) {
          if (table.status === 'OCCUPIED') {
            button.classList.add('occupied');
            button.disabled = false; // Bàn có thể nhấn
            button.style.backgroundColor = 'red'; // Màu xanh cho bàn có đơn hàng
          } else {
            button.classList.remove('occupied');
            button.disabled = true; // Bàn không nhấn được
            button.style.backgroundColor = ''; // Trả lại màu mặc định
          }
        }

        button.addEventListener('click', function () {
          document.querySelectorAll('.manager-table-btn.selected').forEach((btn) => {
            btn.classList.remove('selected');
          });

          button.classList.add('selected');
          button.style.backgroundColor = 'green';
          const selectedTable = tableNumber;

          const selectedOrder = orders.find((order) => order.table.number === selectedTable);
          if (selectedOrder) {
            displayOrderDetails(selectedOrder, tables);
          } else {
            orderDetailsContainer.innerHTML = `<p>Không có đơn hàng nào cho bàn ${selectedTable}.</p>`;
          }
        });
      });
    })
    .catch((error) => {
      console.error('Error fetching table or order data:', error);
    });
}

function displayOrderDetails(order, tables) {
  const orderDetailsContainer = document.getElementById('order-details');
  const orderHTML = `
    <h3>Đơn hàng của bàn ${order.table.number}</h3>
    <p><strong>Trạng thái:</strong> ${order.orderStatus}</p>
    <p><strong>Tổng tiền:</strong> ${order.total_amount} VND</p>
    <p><strong>Thời gian đặt hàng:</strong> ${new Date(order.order_time).toLocaleString()}</p>
    <ul>
      ${order.orderItems.map(item => `
        <li>
          <strong>${item.menuItem.name}</strong> - 
          ${item.quantity} x ${item.menuItem.price} VND = ${item.price} VND
        </li>
      `).join('')}
    </ul>
    <div>
      <button id="confirm-order-btn">Confirm</button>
      <button id="delete-order-btn" ${order.orderStatus !== 'PAID' ? 'disabled' : ''}>Delete</button>
    </div>
  `;
  orderDetailsContainer.innerHTML = orderHTML;

  // Thêm sự kiện cho nút Confirm
  const confirmButton = document.getElementById('confirm-order-btn');
  confirmButton.addEventListener('click', function () {
    updateOrderStatus(order.id, 'CONFIRMED')
      .then(() => {
        order.orderStatus = 'CONFIRMED';
        alert(`Order for table ${order.table.number} has been confirmed.`);
        displayOrderDetails(order, tables);
      })
      .catch((error) => {
        console.error('Error confirming order:', error.message);
        alert('Failed to confirm the order.');
      });
  });

  // thêm sự kiện nút delete
  const deleteButton = document.getElementById('delete-order-btn');
  deleteButton.addEventListener('click', function () {
    if (order.orderStatus === 'PAID') {
      order.table.status ='AVAILABLE'
      deleteOrder(order.id)
        .then(() => {
          alert(`Order for table ${order.table.number} has been deleted.`);
          return updateTableStatus(order.table);
        })
        .then(() => {
          console.log(`Table ${order.table.number} is now AVAILABLE.`);
          fetchTableAndOrderData();
        })
        .catch((error) => {
          console.error('Error updating table status or deleting order:', error);
          // alert('Failed to delete the order or update table status.');
        });
      orderDetailsContainer.innerHTML = `<p>Đơn hàng đã bị xóa.</p>`;
    }
  });
}

function updateOrderStatus(orderId, newStatus) {
  return fetch(`${orderApi}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({orderId, status: newStatus}),
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to update order status.');
    }
    return response.json();
  });
}

function deleteOrder(orderId) {
  // const token = sessionStorage.getItem('token');
  // console.log(token);
  return fetch(`${orderApi}/${orderId}`, {
    method: 'DELETE'
    // headers: {
    //   'Authorization': `Bearer ${token}`, 
    // }
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to delete order.');
    }
  });
}

function updateTableStatus(table) {
  return fetch(`${tableApi}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(table),
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to update table status.');
    }
    return response.json();
  });
}
  

// Phân quyền
function applyRoleBasedActions(role) {

  const customerActions = document.getElementById("customerActions");
  const managerActions = document.getElementById("managerActions");

  if (customerActions) customerActions.style.display = "none";
  if (managerActions) managerActions.style.display = "none";

  // Hiển thị
  if (role === "MANAGER" && managerActions) {
      managerActions.style.display = "block"; 
      console.log("Hiển thị Manager Actions");
  } else if (role === "CUSTOMER" && customerActions) {
      customerActions.style.display = "block";
      console.log("Hiển thị Customer Actions");
  } else {
      console.log("Không có vai trò nào được tìm thấy");
  }
}

// DOM elements
const showOrdersBtn = document.getElementById('manager-show-orders');
const orderModal = document.getElementById('manager-order-modal');
const closeModalBtn = document.getElementById('manager-close-modal');
const orderListModal = document.getElementById('manager-order-list-modal');

// Fetch orders
async function fetchOrders() {
  try {
    const response = await fetch(orderApi);
    const orders = await response.json();
    renderOrders(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
}

function renderOrders(orders) {
  orderListModal.innerHTML = '';

  const orderContainer = document.createElement('div');
  orderContainer.classList.add('order-container');

  orders.forEach(order => {

    const orderCard = document.createElement('div');
    orderCard.classList.add('order-card');

    const formattedOrderTime = new Date(order.order_time).toLocaleString('vi-VN');

    orderCard.innerHTML = `
      <div class="order-header">
        <h3>Bàn: ${order.table.number}</h3>
        <p><strong>Trạng thái:</strong> <span class="status ${order.orderStatus.toLowerCase()}">${order.orderStatus}</span></p>
      </div>
      <div class="order-body">
        <p><strong>Khách hàng:</strong> ${order.customer.username} (${order.customer.email})</p>
        <p><strong>Thời gian đặt:</strong> ${formattedOrderTime}</p>
        <p><strong>Tổng tiền:</strong> ${order.total_amount.toLocaleString('vi-VN')}₫</p>
        <div class="order-items">
          <p><strong>Chi tiết món:</strong></p>
          <ul>
            ${order.orderItems.map(item => `
              <li>${item.menuItem.name} - ${item.quantity} x ${item.price.toLocaleString('vi-VN')}₫</li>
            `).join('')}
          </ul>
        </div>
      </div>
    `;

    orderContainer.appendChild(orderCard);
  });

  orderListModal.appendChild(orderContainer);
}

// Event listeners
showOrdersBtn.addEventListener('click', () => {
  orderModal.classList.remove('hidden');
  fetchOrders();
});

closeModalBtn.addEventListener('click', () => {
  orderModal.classList.add('hidden');
});

const style = document.createElement('style');
style.innerHTML = `
  .order-container {
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 10px;
  }

  .order-card {
    flex: 1 1 calc(33.333% - 20px);
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .order-header {
    margin-bottom: 15px;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
  }
.status {
    font-weight: bold;
    padding: 3px 8px;
    border-radius: 5px;
  }

  .status.pending {
    color: #ffa500;
    background-color: #fff7e6;
  }

  .status.confirm {
    color: #007bff;
    background-color: #e6f7ff;
  }

  .status.paid {
    color: #28a745;
    background-color: #e6ffe6;
  }

  .order-body p {
    margin: 5px 0;
  }

  .order-items ul {
    margin: 10px 0 0 20px;
  }

  .order-footer {
    margin-top: 15px;
    display: flex;
    justify-content: space-between;
  }
`;

document.head.appendChild(style);

document.addEventListener('DOMContentLoaded', () => {
  const addTableBtn = document.getElementById('add-table-btn');
  const form = document.getElementById('add-table-form');
  const submitTableBtn = document.getElementById('submit-table-btn');
  const statusCheckboxes = document.querySelectorAll('input[name="table-status"]');

  // Hiển thị/ẩn form khi nhấn nút Add Table
  addTableBtn.addEventListener('click', () => {
    form.style.display = form.style.display === 'flex' ? 'none' : 'flex';
  });

  // Đảm bảo chỉ một checkbox được chọn
  statusCheckboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {
      statusCheckboxes.forEach((cb) => {
        if (cb !== checkbox) cb.checked = false;
      });
    });
  });

  // Gửi dữ liệu bàn khi nhấn Submit
  submitTableBtn.addEventListener('click', () => {
    const tableNumber = document.getElementById('table-number').value;
    let tableStatus = '';

    statusCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) tableStatus = checkbox.value;
    });

    if (tableNumber && tableStatus) {
      const newTable = {
        number: tableNumber,
        status: tableStatus
      };
      var option = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTable)
      }

      // fetch(tableApi, option)
      //   .then((response) => {
      //     response.json();
      //   })
        
      console.log('New Table:', newTable);

      // Sau khi gửi thành công, ẩn form và reset
      form.style.display = 'none';
      document.getElementById('table-number').value = '';
      statusCheckboxes.forEach((cb) => (cb.checked = false));
    } else {
      alert('Vui lòng nhập số bàn và chọn trạng thái.');
    }
  });
});
