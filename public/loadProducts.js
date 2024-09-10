let currentPage = 1;
const itemsPerPage = 15;
let products = [];

async function loadProducts(page = 1) {
    try {
        let response = await fetch(`/loadProduct?page=${page}&limit=${itemsPerPage}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        products = await response.json();
        if (products.length != 0) {
            displayProducts(products, page);
        } else {
            let c = document.getElementById('nextPage');
            c.disabled = true;
        }
    } catch (error) {
        console.error('There was a problem with the fetch operation:', error);
    }
}

function displayProducts(products, page) {
    const productBox = document.querySelector('.product_box');
    productBox.innerHTML = ''; // Clear previous products

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.id = product.id;
        productItem.classList.add('product_item');

        const productImage = document.createElement('img');
        productImage.src = `/product_image/${product.image_url}`;
        productImage.alt = product.name;

        const productName = document.createElement('h2');
        productName.textContent = product.name;

        const productDetails = document.createElement('p');
        productDetails.textContent = product.details;

        const productQuantity = document.createElement('p');
        productQuantity.textContent = `Quantity: ${product.quantity}`;

        const productPrice = document.createElement('p');
        productPrice.textContent = `Price: Rs. ${product.price}`;

        const viewDescriptionButton = document.createElement('button');
        viewDescriptionButton.classList.add('view-description');
        viewDescriptionButton.textContent = 'View Description';

        viewDescriptionButton.addEventListener('click', () => {
            displayProductDetailsInModal(product);
        });

        const addToCartButton = document.createElement('button');
        addToCartButton.classList.add('add-to-cart');
        addToCartButton.textContent = 'Add to Cart';
        addToCartButton.disabled = product.quantity === 0; // Disable button if quantity is zero

        productItem.appendChild(productImage);
        productItem.appendChild(productName);
        productItem.appendChild(productDetails);
        productItem.appendChild(productQuantity);
        productItem.appendChild(productPrice);
        productItem.appendChild(viewDescriptionButton);
        productItem.appendChild(addToCartButton);

        productBox.appendChild(productItem);

        addToCartButton.addEventListener('click', async () => {
            let productId = productItem.id;
            let productQuantityElement = productItem.querySelector('p:nth-of-type(2)');
            let quantity = parseInt(productQuantityElement.innerText.replace(/[^\d.]/g, ''), 10);

            let res = await cart_product(productId, quantity);
            if (res === 1) {
                productQuantityElement.innerText = `Quantity: ${quantity - 1}`;
                if (quantity - 1 === 0) {
                    addToCartButton.disabled = true;
                }
                addToCartButton.innerText = 'Added';
                alert("Product added to cart");
            } else if (res === 0) {
                alert("Product is already added");
            } else {
                alert("Failed to add product to cart");
            }
        });
    });

    document.getElementById('pageNumber').textContent = `Page ${page}`;
}

async function cart_product(id, q) {
    let obj = {
        id: id,
        quantity: 1
    };

    try {
        let res = await fetch('/cartProduct', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(obj)
        });

        if (res.status === 303) {
            return 0;
        } else if (res.ok) {
            return 1;
        } else {
            throw new Error('Failed to add product to cart');
        }
    } catch (error) {
        console.error('Error in cart_product:', error);
        return -1; // Error occurred
    }
}

// Modal functionality
const productModal = document.getElementById('productModal');
const modalProductName = document.getElementById('modalProductName');
const modalProductImage = document.getElementById('modalProductImage');
const modalProductDetails = document.getElementById('modalProductDetails');
const modalProductQuantity = document.getElementById('modalProductQuantity');
const modalProductPrice = document.getElementById('modalProductPrice');
const closeButton = document.querySelector('.close-button');

function displayProductDetailsInModal(product) {
    modalProductName.textContent = product.name;
    modalProductImage.src = `/product_image/${product.image_url}`;
    modalProductImage.alt = product.name;
    modalProductDetails.textContent = product.details;
    modalProductQuantity.textContent = `Quantity: ${product.quantity}`;
    modalProductPrice.textContent = `Price: Rs. ${product.price}`;

    productModal.style.display = 'block'; // Show the modal
}

// Close the modal when the close button is clicked
closeButton.addEventListener('click', () => {
    productModal.style.display = 'none';
});

// Close the modal when the user clicks anywhere outside of the modal content
window.addEventListener('click', (event) => {
    if (event.target === productModal) {
        productModal.style.display = 'none';
    }
});

// Pagination controls
document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        loadProducts(currentPage);
        let c = document.getElementById('nextPage');
        c.disabled = false;
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    currentPage++;
    loadProducts(currentPage);
});

window.onload = () => {
    loadProducts(currentPage);
};
