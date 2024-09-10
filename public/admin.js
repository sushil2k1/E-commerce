let products = [];
let currentPage = 1;
const itemsPerPage = 15;

window.onload = loadProducts;
let prev = document.getElementById('prevPage')
let next = document.getElementById('nextPage');
let pageNumber = document.getElementById('pageNumber')
pageNumber.innerText = `${currentPage}`

if (currentPage == 1) {
    prev.disabled = true;

}
let submit = document.getElementById('product-form');
submit.addEventListener('submit', addOrUpdateProduct);

let editMode = false;
let editId = null;

function addOrUpdateProduct(e) {
    e.preventDefault();

    const image = document.getElementById('product-image').files[0];
    const name = document.getElementById('product-name').value;
    const details = document.getElementById('product-details').value;
    const quantity = document.getElementById('product-quantity').value;
    const price = document.getElementById('product-price').value;
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(image.type)) {
        alert("Invalid file type. Only JPG, JPEG, and PNG files are allowed.");
    document.getElementById('product-form').reset();

        return;
    }

    let P_id = editMode ? editId : Date.now();
    let formdata = new FormData();
    if (image) {
        formdata.append("image", image);
    }
    formdata.append("name", name);
    formdata.append("details", details);
    formdata.append("quantity", quantity);
    formdata.append("price", price);
    formdata.append("id", P_id);

    if (editMode) {
        updateProductDB(formdata, P_id);
    } else {
        saveProductDB(formdata);
    }

    const reader = new FileReader();

    reader.onload = function (e) {
        const imageUrl = e.target.result;
        const tableBody = document.getElementById('product-table-body');
        const row = document.createElement('tr');
        row.id = P_id;

        row.innerHTML = `
            <td><img src="${imageUrl}" alt="${name}" width="50"></td>
            <td>${name}</td>
            <td>${details}</td>
            <td>${quantity}</td>
            <td>${price}</td>
            <td class="actions">
                <button onclick="editProduct(this)" style="background-color: #009dff; ">Edit</button>
                <button onclick="saveProduct(this)" style="display:none;background-color: #009dff;">Save</button>
                <button onclick="removeProduct(this)">Remove</button>
            </td>
        `;

        if (editMode) {
            const existingRow = document.getElementById(P_id);
            existingRow.innerHTML = row.innerHTML;
        } else {
            tableBody.prepend(row);
        }
    };

    if (image) {
        reader.readAsDataURL(image);
    } else {
        const existingRow = document.getElementById(P_id);
        existingRow.cells[1].innerText = name;
        existingRow.cells[2].innerText = details;
        existingRow.cells[3].innerText = quantity;
        existingRow.cells[4].innerText = price;
    }

    editMode = false;
    editId = null;
    document.getElementById('product-form').reset();
}

function saveProductDB(val) {
    async function abc(val) {
        const response = await fetch('/saveProduct', {
            method: 'POST',
            body: val
        });
        let res = await response.json();
        // alert("Product added successfully");
    }
    abc(val);
}

function updateProductDB(val, id) {
    async function abc(val) {
        const response = await fetch('/updateProduct', {
            method: 'POST',
            body: val
        });
        let res = await response;
        console.log(res);
        if (res.status == 200)
            alert("Product updated successfully");
        else
            alert("Error while updating product");
    }
    abc(val);
}

function loadProducts(page = 1) {
    let res;
    async function productLoad() {
        let response = await fetch(`/loadProduct?page=${page}&limit=${itemsPerPage}`);
        res = await response.json();
        const tableBody = document.getElementById('product-table-body');
        if (res.length == 0) {
            next.disabled = true;
            return;
        }
        tableBody.innerHTML = ''; // Clear previous products
        res.forEach(element => {
            create(element);
        });
    }
    productLoad();

    function create(res) {
        const imageUrl = res.image_url;
        const tableBody = document.getElementById('product-table-body');
        const row = document.createElement('tr');
        row.id = res.id;

        row.innerHTML = `
            <td><img src="/product_image/${imageUrl}" alt="${res.name}" width="50"></td>
            <td contentEditable="false">${res.name}</td>
            <td contentEditable="false">${res.details}</td>
            <td contentEditable="false">${res.quantity}</td>
            <td contentEditable="false">${res.price}</td>
            <td class="actions">
                <button onclick="editProduct(this)" style="background-color: #009dff; ">Edit</button>
                <button onclick="saveProduct(this)" style="display:none;background-color: #72ff60; ">Save</button>
                <button onclick="removeProduct(this)">Remove</button>
            </td>
        `;

        tableBody.appendChild(row);
    }
}

function editProduct(button) {
    const row = button.closest('tr');
    editId = row.id;
    editMode = true;

    Array.from(row.cells).forEach(cell => {
        if (cell.classList.contains('actions')) return;
        cell.contentEditable = true;
    });

    button.style.display = 'none';
    button.nextElementSibling.style.display = 'inline';
}

async function saveProduct(button) {
    const row = button.closest('tr');
    const id = row.id;

    const name = row.cells[1].innerText;
    const details = row.cells[2].innerText;
    const quantity = row.cells[3].innerText;
    const price = row.cells[4].innerText;

    let formdata = new FormData();
    formdata.append("name", name);
    formdata.append("details", details);
    formdata.append("quantity", quantity);
    formdata.append("price", price);
    formdata.append("id", id);

    await updateProductDB(formdata, id);
    console.log(formdata);

    Array.from(row.cells).forEach(cell => {
        if (cell.classList.contains('actions')) return;
        cell.contentEditable = false;
    });

    button.style.display = 'none';
    button.previousElementSibling.style.display = 'inline';
    editMode = false;
    editId = null;
}

async function removeProduct(button) {
    const row = button.closest('tr');
    let id = row.id;
    await removeDB(id);
    row.remove();
}

async function removeDB(id) {
    try {
        const response = await fetch('/removeProduct', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ id })
        });
        alert("Product removed successfully");
    } catch (error) {
        console.log("Error occurred while removing product:", error);
    }
}

document.getElementById('prevPage').addEventListener('click', () => {
    if (currentPage > 1) {
        next.disabled = false;
        currentPage--;
        pageNumber.innerText = `${currentPage}`
        loadProducts(currentPage);
    }
});

document.getElementById('nextPage').addEventListener('click', () => {
    currentPage++;
    prev.disabled = false;
    pageNumber.innerText = `${currentPage}`
    loadProducts(currentPage);
});
