// Variables globales de estado
let currentProductIndex = -1;

// Navegación entre secciones del Dashboard
function showSection(sectionId) {
    const sections = ['inventory-section', 'billing-section'];
    const navLinks = document.querySelectorAll('.nav-link');

    sections.forEach(id => {
        const el = document.getElementById(id);
        if (id === sectionId + '-section') {
            el.classList.remove('hidden');
        } else {
            el.classList.add('hidden');
        }
    });

    navLinks.forEach(link => {
        if (link.getAttribute('onclick').includes(sectionId)) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

// Inicializar Inventario
function renderInventory() {
    const tableBody = document.getElementById('inventory-table-body');
    const products = JSON.parse(localStorage.getItem('dul_shop_products')) || [];

    tableBody.innerHTML = '';

    if (products.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay productos registrados</td></tr>';
        return;
    }

    products.forEach((product, index) => {
        const row = `
            <tr>
                <td>#${product.code}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${product.stock}</td>
                <td>$${parseFloat(product.price).toLocaleString()}</td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="editProduct(${index})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="deleteProduct(${index})">Eliminar</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

// Llamar al cargar si hay sesión
document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('dul_shop_session')) {
        renderInventory();
    }
});

// Modal Logic
function openProductModal() {
    currentProductIndex = -1;
    document.getElementById('modal-title').innerText = 'Nuevo Producto';
    document.getElementById('product-form').reset();
    document.getElementById('product-modal').classList.remove('hidden');
}

function closeProductModal() {
    document.getElementById('product-modal').classList.add('hidden');
}

// Guardar Producto (Crear / Editar)
document.getElementById('product-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const product = {
        code: document.getElementById('p-code').value,
        name: document.getElementById('p-name').value,
        category: document.getElementById('p-category').value,
        stock: parseInt(document.getElementById('p-stock').value),
        price: parseFloat(document.getElementById('p-price').value)
    };

    let products = JSON.parse(localStorage.getItem('dul_shop_products')) || [];

    if (currentProductIndex === -1) {
        // Nuevo
        products.push(product);
    } else {
        // Editar
        products[currentProductIndex] = product;
    }

    localStorage.setItem('dul_shop_products', JSON.stringify(products));
    renderInventory();
    closeProductModal();
});

function editProduct(index) {
    const products = JSON.parse(localStorage.getItem('dul_shop_products')) || [];
    const product = products[index];

    currentProductIndex = index;
    document.getElementById('modal-title').innerText = 'Editar Producto';
    
    document.getElementById('p-code').value = product.code;
    document.getElementById('p-name').value = product.name;
    document.getElementById('p-category').value = product.category;
    document.getElementById('p-stock').value = product.stock;
    document.getElementById('p-price').value = product.price;

    document.getElementById('product-modal').classList.remove('hidden');
}

function deleteProduct(index) {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
        let products = JSON.parse(localStorage.getItem('dul_shop_products')) || [];
        products.splice(index, 1);
        localStorage.setItem('dul_shop_products', JSON.stringify(products));
        renderInventory();
    }
}
