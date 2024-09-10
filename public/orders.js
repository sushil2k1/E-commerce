window.onload = loadProduct;
async function loadProduct() {
    try {
        let res = await fetch('/getOrders');
        res = await res.json();
        console.log(res);
        res.forEach(e => {
            createProduct(e);
        });
    } catch (err) {
        console.error('Error loading products:', err);
    }
}

function createProduct(order) {
    const ordersContainer = document.getElementById('orders');

    const orderDiv = document.createElement('div');
    orderDiv.classList.add('order');

    const orderTitle = document.createElement('h3');
    orderTitle.textContent = `Order #${order.id} - ${order.name}`;
    orderDiv.appendChild(orderTitle);

    const orderDetails = document.createElement('div');
    orderDetails.classList.add('order-details');

    const productImage = document.createElement('img');
    productImage.src = `product_image/${order.image_url}`;
    productImage.alt = order.name;
    productImage.classList.add('product-image');
    orderDetails.appendChild(productImage);

    const detailsText = document.createElement('div');
    detailsText.innerHTML = `
        <p><strong>User:</strong> ${order.user}</p>
        <p><strong>Details:</strong> ${order.details}</p>
        <p><strong>Quantity:</strong> ${order.quantity}</p>
        <p><strong>Price:</strong> Rs. ${order.price}</p>
        <p><strong>Address:</strong></p>
        <p>${order.address.name}</p>
        <p>${order.address.contact}</p>
        <p>${order.address.address}, ${order.address.city}, ${order.address.state}, ${order.address.zip}, ${order.address.country}</p>
    `;
    orderDetails.appendChild(detailsText);

    orderDiv.appendChild(orderDetails);

    const statusDiv = document.createElement('div');
    statusDiv.classList.add('status');
    const statusText = document.createElement('span');
    statusText.textContent = `Status: ${order.status}`;
    statusDiv.appendChild(statusText);

    const changeStatusButton = document.createElement('button');
    changeStatusButton.textContent = getNextStatus(order.status);
    changeStatusButton.addEventListener('click', async () => {
        order.status = getNextStatus(order.status);
        statusText.textContent = `Status: ${order.status}`;
        changeStatusButton.textContent = getNextStatus(order.status);

        // Update the status on the server
        try {
            await fetch(`/updateOrderStatus/${order.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: order.status })
            });
        } catch (err) {
            console.error('Error updating order status:', err);
        }
    });
    statusDiv.appendChild(changeStatusButton);

    orderDiv.appendChild(statusDiv);

    ordersContainer.appendChild(orderDiv);
}
function getNextStatus(currentStatus) {
    switch (currentStatus) {
        case "Order confirmed..":
            return "Order shipped..";
        case "Order shipped..":
            return "Order delivered..";
        case "Order delivered..":
            return "Order delivered..";
        default:
            return "Order confirmed..";
    }
}
