async function loadCart() {

    try {
        let response = await fetch('/loadCart');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        let products = await response.json();
        console.log("products in loadcart js",products);
        displayCart(products);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }

}
let order = document.getElementById('buyNow');
let user1 = document.getElementById('username');
let user = user1.innerText;
function displayCart(productList) {
    if(productList.length==0){
        const cartBox = document.querySelector('.cartBox');
    cartBox.innerHTML = 'No products added';
    return;
    }

    const cartBox = document.querySelector('.cartBox');
    cartBox.innerHTML = ''; // Clear the cart box before displaying new items

    let totalPrice = 0;


    productList.forEach(product => {
        // Check if _doc exists in the product
        if (product._doc) {
            totalPrice += product._doc.price * product.quantity;
    
            // Create product container
            const productDiv = document.createElement('div');
            productDiv.classList.add('product');
            productDiv.id = product._doc.id;
    
            // Create and set image element
            const img = document.createElement('img');
            img.src = `/product_image/${product._doc.image_url}`;
            img.alt = product._doc.name;
    
            // Create product details container
            const productDetails = document.createElement('div');
            productDetails.classList.add('product-details');
    
            // Create and set product name element
            const name = document.createElement('h3');
            name.textContent = product._doc.name;
    
            // Create and set product details element
            const details = document.createElement('p');
            details.textContent = product._doc.details;
    
            // Create and set product price element
            const price = document.createElement('p');
            price.textContent = `Price: Rs. ${product._doc.price}`;
    
            // Create and set product quantity element
            const quantity = document.createElement('p');
            quantity.innerHTML = `
                Quantity: 
                <button class="decrease" data-id="${product._doc.id}">-</button>
                <span>${product.quantity}</span>
                <button class="increase" data-id="${product._doc.id}">+</button>
            `;
    
            // Create and set remove button element
            const removeButton = document.createElement('button');
            removeButton.classList.add('remove');
            removeButton.dataset.id = product._doc.id;
            removeButton.textContent = 'Remove';
    
            // Append all elements to product details
            productDetails.appendChild(name);
            productDetails.appendChild(details);
            productDetails.appendChild(price);
            productDetails.appendChild(quantity);
            productDetails.appendChild(removeButton);
    
            // Append image and product details to product container
            productDiv.appendChild(img);
            productDiv.appendChild(productDetails);
    
            // Append product container to cart box
            cartBox.appendChild(productDiv);
        } else {
            console.error("Product data is missing the _doc property", product);
        }
    });
    
    const totalDiv = document.createElement('div');
    totalDiv.classList.add('total');

    const totalText = document.createElement('h2');
    totalText.textContent = `Total: Rs. ${totalPrice}`;

    const buyNowButton = document.createElement('button');
    buyNowButton.classList.add('buy-now');
    buyNowButton.textContent = 'Buy Now';

    // Append total text and buy now button to total container
    totalDiv.appendChild(totalText);
    totalDiv.appendChild(buyNowButton);

    // Append total container to cart box
    cartBox.appendChild(totalDiv);

    // Add event listeners for the buttons
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', async (event) => {
            let id = event.target.dataset.id;
            // Logic to increase quantity
            await updateCartQuantity(id, 'increase');
        });
    });

    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', async (event) => {
            let id = event.target.dataset.id;
            // Logic to decrease quantity
            await updateCartQuantity(id, 'decrease');
        });
    });

    document.querySelectorAll('.remove').forEach(button => {
        button.addEventListener('click', async (event) => {
            let id = event.target.dataset.id;
            // Logic to remove product from cart
            await removeFromCart(id);
        });
    });

    buyNowButton.addEventListener('click', () => {
        // Logic to handle the buy now action
        order.style.display = 'block';
        cartBox.style.display = 'none';
        // document.getElementById('cartBox').style.display=

        alert('Proceeding to buy');

    });
}

let cancel=document.getElementById('cancel');
cancel.addEventListener('click',()=>{
    order.style.display = 'none';
    cartBox.style.display = 'block';
})



async function updateCartQuantity(id, action) {
    try {
        let response = await fetch(`/updateCartQuantity`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id, action })
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        let products = await response.json();
        if (products.mesg == 'over') {
            alert("Stock is over");
            return;
        }
        else {
            displayCart(products);
        }

    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

async function removeFromCart(id) {
    try {
        let response = await fetch(`/removeFromCart`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id })
        });
        if (response.status != 200) {
            throw new Error('Network response was not ok');
        }
        let products = await response.json();
        displayCart(products);
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

let orderForm=document.getElementById('orderForm');

orderForm.addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    formData.append('user',user)
    

    try {
        const response = await fetch('/order', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            alert('Order confirmed successfully!');
            window.location.href='/';
        } else {
            alert('Failed to confirm order. Please try again.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
});

window.onload = loadCart; 