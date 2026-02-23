function openBillingModal() {
    const productSelect = document.getElementById('b-product');
    const products = JSON.parse(localStorage.getItem('dul_shop_products')) || [];

    productSelect.innerHTML = '<option value="">Seleccione un producto...</option>';
    products.forEach((p, index) => {
        if (p.stock > 0) {
            productSelect.innerHTML += `<option value="${index}">${p.name} ($${p.price}) - Stock: ${p.stock}</option>`;
        }
    });

    document.getElementById('billing-form').reset();
    document.getElementById('b-total').value = '$0';
    document.getElementById('billing-modal').classList.remove('hidden');
}

function closeBillingModal() {
    document.getElementById('billing-modal').classList.add('hidden');
}

function updateBillingTotal() {
    const productIndex = document.getElementById('b-product').value;
    const qty = document.getElementById('b-qty').value;
    const totalInput = document.getElementById('b-total');

    if (productIndex === "") {
        totalInput.value = '$0';
        return;
    }

    const products = JSON.parse(localStorage.getItem('dul_shop_products')) || [];
    const product = products[productIndex];
    
    const total = product.price * qty;
    totalInput.value = `$${total.toLocaleString()}`;
}

document.getElementById('billing-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const productIndex = document.getElementById('b-product').value;
    const qty = parseInt(document.getElementById('b-qty').value);
    const customer = document.getElementById('b-customer').value;
    const address = document.getElementById('b-address').value;

    let products = JSON.parse(localStorage.getItem('dul_shop_products')) || [];
    const product = products[productIndex];

    if (qty > product.stock) {
        alert('No hay stock suficiente');
        return;
    }

    // Restar Stock
    product.stock -= qty;
    localStorage.setItem('dul_shop_products', JSON.stringify(products));

    // Guardar Factura
    const bill = {
        folio: 'F' + Math.floor(Math.random() * 10000),
        customer,
        address,
        productName: product.name,
        qty,
        total: product.price * qty,
        date: new Date().toLocaleDateString(),
        status: 'Guía Generada'
    };

    let bills = JSON.parse(localStorage.getItem('dul_shop_bills')) || [];
    bills.push(bill);
    localStorage.setItem('dul_shop_bills', JSON.stringify(bills));

    alert(`Factura ${bill.folio} generada. Guía de envío lista para: ${address}`);
    
    renderBillingTable();
    if (typeof renderInventory === 'function') renderInventory(); // Actualizar tabla if visible
    closeBillingModal();
});

function renderBillingTable() {
    const tableBody = document.getElementById('billing-table-body');
    const bills = JSON.parse(localStorage.getItem('dul_shop_bills')) || [];

    tableBody.innerHTML = '';

    if (bills.length === 0) {
        tableBody.innerHTML = '<tr><td colspan="6" style="text-align: center;">No hay facturas registradas</td></tr>';
        return;
    }

    bills.forEach(bill => {
        const row = `
            <tr>
                <td>${bill.folio}</td>
                <td>${bill.customer}</td>
                <td>${bill.productName} (x${bill.qty})</td>
                <td>$${bill.total.toLocaleString()}</td>
                <td><span class="badge badge-success">${bill.status}</span></td>
                <td>
                    <button class="btn btn-outline btn-sm" onclick="showGuide('${bill.folio}')">Ver Guía</button>
                </td>
            </tr>
        `;
        tableBody.innerHTML += row;
    });
}

function showGuide(folio) {
    const bills = JSON.parse(localStorage.getItem('dul_shop_bills')) || [];
    const bill = bills.find(b => b.folio === folio);

    if (!bill) return;

    const guideContent = document.getElementById('guide-content');
    guideContent.innerHTML = `
        <div class="guide-item"><strong>Folio de Rastreo:</strong> ${bill.folio}</div>
        <div class="guide-item"><strong>Fecha de Emisión:</strong> ${bill.date}</div>
        <div class="guide-item"><strong>Cliente:</strong> ${bill.customer}</div>
        <div class="guide-item"><strong>Dirección de Entrega:</strong> ${bill.address}</div>
        <div class="guide-item"><strong>Producto:</strong> ${bill.productName}</div>
        <div class="guide-item"><strong>Cantidad:</strong> ${bill.qty}</div>
        <div class="guide-item"><strong>Estado del Envío:</strong> En Tránsito</div>
    `;

    document.getElementById('guide-modal').classList.remove('hidden');
}

function closeGuideModal() {
    document.getElementById('guide-modal').classList.add('hidden');
}

// Cargar al inicio
document.addEventListener('DOMContentLoaded', () => {
    renderBillingTable();
});
