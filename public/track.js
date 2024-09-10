document.addEventListener('DOMContentLoaded', async () => {
    const ordersSection = document.getElementById('orders');

    try {
        const response = await fetch('/trackOrders'); // Adjust the endpoint as necessary

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const orders = await response.json();
        console.log("orders", orders);

        if (orders.length === 0) {
            const noOrdersMessage = document.createElement('p');
            noOrdersMessage.textContent = 'No orders found.';
            ordersSection.appendChild(noOrdersMessage);
            return;
        }

        const nonDeliveredOrders = orders.filter(order => order.status !== "Order delivered..");
        const deliveredOrders = orders.filter(order => order.status === "Order delivered..");

        const displayOrders = (ordersList) => {
            ordersList.forEach(order => {
                const orderDiv = document.createElement('div');
                orderDiv.className = 'order';

                const orderId = document.createElement('h3');
                orderId.textContent = `Order ID: ${order.id}`;
                orderDiv.appendChild(orderId);

                const orderImage = document.createElement('img');
                orderImage.src = `/product_image/${order.image_url}`;
                orderImage.alt = order.name;
                orderDiv.appendChild(orderImage);

                const orderName = document.createElement('p');
                orderName.textContent = `Name: ${order.name}`;
                orderDiv.appendChild(orderName);

                const orderDetails = document.createElement('p');
                orderDetails.textContent = `Details: ${order.details}`;
                orderDiv.appendChild(orderDetails);

                const orderQuantity = document.createElement('p');
                orderQuantity.textContent = `Quantity: ${order.quantity}`;
                orderDiv.appendChild(orderQuantity);

                const orderPrice = document.createElement('p');
                orderPrice.textContent = `Price: Rs. ${order.price}`;
                orderDiv.appendChild(orderPrice);

                const orderStatus = document.createElement('p');
                orderStatus.textContent = `Status: ${order.status}`;
                orderDiv.appendChild(orderStatus);

                const cancelButton = document.createElement('button');
                cancelButton.className = 'cancel-button';
                if (order.status === "Order delivered..") {
                    cancelButton.textContent = 'Order Delivered';
                    cancelButton.disabled = true;
                    cancelButton.style.backgroundColor = "green";
                } else {
                    cancelButton.textContent = 'Cancel Order';
                }
                cancelButton.setAttribute('data-order-id', order.id);
                orderDiv.appendChild(cancelButton);

                ordersSection.appendChild(orderDiv);
            });
        };

        // First display non-delivered orders
        displayOrders(nonDeliveredOrders);
        // Then display delivered orders
        displayOrders(deliveredOrders);

        document.querySelectorAll('.cancel-button').forEach(button => {
            button.addEventListener('click', async (event) => {
                const orderId = event.target.getAttribute('data-order-id');
                try {
                    await fetch(`/api/orders/${orderId}`, {
                        method: 'DELETE'
                    });
                    event.target.parentElement.remove();
                    alert('Order canceled successfully.');
                } catch (err) {
                    console.error('Error canceling order:', err);
                    alert('Failed to cancel order.');
                }
            });
        });
    } catch (err) {
        console.error('Error fetching orders:', err);
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'Error fetching orders.';
        ordersSection.appendChild(errorMessage);
    }
});
