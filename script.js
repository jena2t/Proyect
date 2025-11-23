// Datos de ejemplo para inicializar la aplicación
const initialData = {
    products: [
        {
            id: 1,
            code: "P001",
            description: "Mouse inalámbrico",
            brand: "Logitech",
            unit: "Unidad",
            cost: 8.00,
            price: 12.00,
            itbms: true,
            stock: 47,
            comments: ""
        },
        {
            id: 2,
            code: "P002",
            description: "Teclado USB",
            brand: "Genius",
            unit: "Unidad",
            cost: 6.00,
            price: 9.00,
            itbms: false,
            stock: 35,
            comments: ""
        }
    ],
    entries: [
        {
            id: 1,
            date: "2025-06-10",
            productId: 2,
            quantity: 50,
            supplier: "Importadora Tech",
            total: 270.00,
            comments: "Compra mensual"
        }
    ],
    dispatches: [
        {
            id: 1,
            date: "2025-06-12",
            productId: 2,
            quantity: 10,
            client: "Cliente XYZ",
            total: 90.00,
            comments: "Pedido urgente"
        }
    ],
    adjustments: [
        {
            id: 1,
            date: "2025-06-15",
            type: "-",
            productId: 1,
            quantity: 3,
            comments: "Producto dañado en almacén",
            previousStock: 50,
            currentStock: 47
        }
    ],
    suppliers: ["Importadora Tech", "TecnoSum", "ElectroParts"],
    clients: ["Cliente XYZ", "Empresa ABC", "Comercial Global"]
};

// Clase principal de la aplicación
class InventorySystem {
    constructor() {
        this.data = this.loadData() || initialData;
        this.currentModule = 'dashboard';
        this.init();
    }
    
    // Inicializar la aplicación
    init() {
        this.setupEventListeners();
        this.showModule(this.currentModule);
        this.updateDashboard();
        this.renderProducts();
        this.renderEntries();
        this.renderDispatches();
        this.renderAdjustments();
    }
    
    // Configurar event listeners
    setupEventListeners() {
        // Navegación entre módulos
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const module = e.target.getAttribute('data-module');
                this.showModule(module);
            });
        });
        
        // Botones para agregar registros
        document.getElementById('add-product-btn').addEventListener('click', () => {
            this.showProductForm();
        });
        
        document.getElementById('add-entry-btn').addEventListener('click', () => {
            this.showEntryForm();
        });
        
        document.getElementById('add-dispatch-btn').addEventListener('click', () => {
            this.showDispatchForm();
        });
        
        document.getElementById('add-adjustment-btn').addEventListener('click', () => {
            this.showAdjustmentForm();
        });
        
        // Generar reportes
        document.getElementById('generate-report').addEventListener('click', () => {
            this.generateReport();
        });
        
        // Exportar reporte
        document.getElementById('export-report-btn').addEventListener('click', () => {
            this.exportReport();
        });
        
        // Cerrar modal
        document.querySelector('.close').addEventListener('click', () => {
            this.closeModal();
        });
        
        // Cerrar modal al hacer clic fuera
        document.getElementById('modal').addEventListener('click', (e) => {
            if (e.target.id === 'modal') {
                this.closeModal();
            }
        });
    }
    
    // Mostrar módulo específico
    showModule(moduleName) {
        // Ocultar todos los módulos
        document.querySelectorAll('.module').forEach(module => {
            module.classList.remove('active');
        });
        
        // Remover clase active de todos los enlaces
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        
        // Mostrar módulo seleccionado
        document.getElementById(moduleName).classList.add('active');
        
        // Activar enlace correspondiente
        document.querySelector(`[data-module="${moduleName}"]`).classList.add('active');
        
        this.currentModule = moduleName;
        
        // Actualizar dashboard si es el módulo activo
        if (moduleName === 'dashboard') {
            this.updateDashboard();
        }
    }
    
    // Mostrar modal
    showModal(title, content) {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        document.getElementById('modal').style.display = 'flex';
    }
    
    // Cerrar modal
    closeModal() {
        document.getElementById('modal').style.display = 'none';
    }
    
    // Cargar datos desde localStorage
    loadData() {
        const savedData = localStorage.getItem('inventorySystem');
        return savedData ? JSON.parse(savedData) : null;
    }
    
    // Guardar datos en localStorage
    saveData() {
        localStorage.setItem('inventorySystem', JSON.stringify(this.data));
    }
    
    // Actualizar dashboard con métricas mejoradas
    updateDashboard() {
        // Métricas básicas
        document.getElementById('total-products').textContent = this.data.products.length;
        
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        
        const monthEntries = this.data.entries.filter(entry => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === currentMonth && entryDate.getFullYear() === currentYear;
        }).length;
        
        document.getElementById('month-entries').textContent = monthEntries;
        
        const monthDispatches = this.data.dispatches.filter(dispatch => {
            const dispatchDate = new Date(dispatch.date);
            return dispatchDate.getMonth() === currentMonth && dispatchDate.getFullYear() === currentYear;
        }).length;
        
        document.getElementById('month-dispatches').textContent = monthDispatches;
        
        const lowStock = this.data.products.filter(product => product.stock < 10).length;
        document.getElementById('low-stock').textContent = lowStock;
        
        // Nuevas métricas
        const totalValue = this.data.products.reduce((sum, product) => sum + (product.stock * product.cost), 0);
        document.getElementById('total-value').textContent = `$${totalValue.toFixed(2)}`;
        
        const avgStock = this.data.products.reduce((sum, product) => sum + product.stock, 0) / this.data.products.length;
        document.getElementById('avg-stock').textContent = Math.round(avgStock);
        
        const outOfStock = this.data.products.filter(product => product.stock === 0).length;
        document.getElementById('out-of-stock').textContent = outOfStock;
        
        // Producto más vendido
        const productSales = {};
        this.data.dispatches.forEach(dispatch => {
            if (!productSales[dispatch.productId]) {
                productSales[dispatch.productId] = 0;
            }
            productSales[dispatch.productId] += dispatch.quantity;
        });
        
        let topProductId = null;
        let maxSales = 0;
        Object.keys(productSales).forEach(productId => {
            if (productSales[productId] > maxSales) {
                maxSales = productSales[productId];
                topProductId = parseInt(productId);
            }
        });
        
        const topProduct = this.data.products.find(p => p.id === topProductId);
        document.getElementById('top-product').textContent = topProduct ? topProduct.description : '-';
        
        // Actualizar actividad reciente
        this.updateRecentActivity();
    }
    
    // Actualizar actividad reciente mejorada
    updateRecentActivity() {
        const recentTable = document.getElementById('recent-table').querySelector('tbody');
        recentTable.innerHTML = '';
        
        // Combinar y ordenar movimientos recientes
        const allMovements = [
            ...this.data.entries.map(entry => ({
                date: entry.date,
                type: 'Entrada',
                productId: entry.productId,
                quantity: entry.quantity,
                entity: entry.supplier,
                total: entry.total
            })),
            ...this.data.dispatches.map(dispatch => ({
                date: dispatch.date,
                type: 'Salida',
                productId: dispatch.productId,
                quantity: dispatch.quantity,
                entity: dispatch.client,
                total: dispatch.total
            })),
            ...this.data.adjustments.map(adjustment => ({
                date: adjustment.date,
                type: `Ajuste (${adjustment.type})`,
                productId: adjustment.productId,
                quantity: adjustment.quantity,
                entity: '—',
                total: '—'
            }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 10);
        
        allMovements.forEach(movement => {
            const product = this.data.products.find(p => p.id === movement.productId);
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${this.formatDate(movement.date)}</td>
                <td>${movement.type}</td>
                <td>${product ? product.description : 'Producto no encontrado'}</td>
                <td>${movement.quantity}</td>
                <td>${movement.entity}</td>
                <td>${movement.total !== '—' ? `$${movement.total.toFixed(2)}` : movement.total}</td>
            `;
            
            recentTable.appendChild(row);
        });
    }
    
    // Formatear fecha
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES');
    }
    
    // Renderizar productos con columna de valor
    renderProducts() {
        const table = document.getElementById('products-table').querySelector('tbody');
        table.innerHTML = '';
        
        this.data.products.forEach(product => {
            const row = document.createElement('tr');
            const productValue = product.stock * product.cost;
            
            row.innerHTML = `
                <td>${product.code}</td>
                <td>${product.description}</td>
                <td>${product.brand}</td>
                <td>${product.unit}</td>
                <td>$${product.cost.toFixed(2)}</td>
                <td>$${product.price.toFixed(2)}</td>
                <td>${product.itbms ? 'Sí' : 'No'}</td>
                <td>${product.stock}</td>
                <td>$${productValue.toFixed(2)}</td>
                <td class="actions">
                    <button class="action-btn btn-warning" onclick="inventorySystem.editProduct(${product.id})">Editar</button>
                    <button class="action-btn btn-danger" onclick="inventorySystem.deleteProduct(${product.id})">Eliminar</button>
                </td>
            `;
            
            table.appendChild(row);
        });
    }
    
    // Renderizar entradas con costo unitario
    renderEntries() {
        const table = document.getElementById('entries-table').querySelector('tbody');
        table.innerHTML = '';
        
        this.data.entries.forEach(entry => {
            const product = this.data.products.find(p => p.id === entry.productId);
            const unitCost = product ? entry.total / entry.quantity : 0;
            
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${this.formatDate(entry.date)}</td>
                <td>${product ? product.description : 'Producto no encontrado'}</td>
                <td>${entry.quantity}</td>
                <td>${entry.supplier}</td>
                <td>$${unitCost.toFixed(2)}</td>
                <td>$${entry.total.toFixed(2)}</td>
                <td>${entry.comments}</td>
                <td class="actions">
                    <button class="action-btn btn-warning" onclick="inventorySystem.editEntry(${entry.id})">Editar</button>
                    <button class="action-btn btn-danger" onclick="inventorySystem.deleteEntry(${entry.id})">Eliminar</button>
                </td>
            `;
            
            table.appendChild(row);
        });
    }
    
    // Renderizar despachos con precio unitario
    renderDispatches() {
        const table = document.getElementById('dispatches-table').querySelector('tbody');
        table.innerHTML = '';
        
        this.data.dispatches.forEach(dispatch => {
            const product = this.data.products.find(p => p.id === dispatch.productId);
            const unitPrice = product ? dispatch.total / dispatch.quantity : 0;
            
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${this.formatDate(dispatch.date)}</td>
                <td>${product ? product.description : 'Producto no encontrado'}</td>
                <td>${dispatch.quantity}</td>
                <td>${dispatch.client}</td>
                <td>$${unitPrice.toFixed(2)}</td>
                <td>$${dispatch.total.toFixed(2)}</td>
                <td>${dispatch.comments}</td>
                <td class="actions">
                    <button class="action-btn btn-warning" onclick="inventorySystem.editDispatch(${dispatch.id})">Editar</button>
                    <button class="action-btn btn-danger" onclick="inventorySystem.deleteDispatch(${dispatch.id})">Eliminar</button>
                </td>
            `;
            
            table.appendChild(row);
        });
    }
    
    // Renderizar ajustes con stock anterior y actual
    renderAdjustments() {
        const table = document.getElementById('adjustments-table').querySelector('tbody');
        table.innerHTML = '';
        
        this.data.adjustments.forEach(adjustment => {
            const product = this.data.products.find(p => p.id === adjustment.productId);
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${this.formatDate(adjustment.date)}</td>
                <td>${adjustment.type}</td>
                <td>${product ? product.description : 'Producto no encontrado'}</td>
                <td>${adjustment.quantity}</td>
                <td>${adjustment.previousStock || 'N/A'}</td>
                <td>${product ? product.stock : 'N/A'}</td>
                <td>${adjustment.comments}</td>
                <td class="actions">
                    <button class="action-btn btn-warning" onclick="inventorySystem.editAdjustment(${adjustment.id})">Editar</button>
                    <button class="action-btn btn-danger" onclick="inventorySystem.deleteAdjustment(${adjustment.id})">Eliminar</button>
                </td>
            `;
            
            table.appendChild(row);
        });
    }
    
    // Mostrar formulario de producto
    showProductForm(product = null) {
        const isEdit = product !== null;
        const title = isEdit ? 'Editar Producto' : 'Agregar Producto';
        
        const formHTML = `
            <form id="product-form">
                <div class="form-group">
                    <label class="form-label">Código</label>
                    <input type="text" id="product-code" class="form-control" value="${isEdit ? product.code : ''}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Descripción</label>
                    <input type="text" id="product-description" class="form-control" value="${isEdit ? product.description : ''}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Marca</label>
                    <input type="text" id="product-brand" class="form-control" value="${isEdit ? product.brand : ''}" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Unidad</label>
                        <input type="text" id="product-unit" class="form-control" value="${isEdit ? product.unit : ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Costo</label>
                        <input type="number" step="0.01" id="product-cost" class="form-control" value="${isEdit ? product.cost : ''}" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label class="form-label">Precio</label>
                        <input type="number" step="0.01" id="product-price" class="form-control" value="${isEdit ? product.price : ''}" required>
                    </div>
                    <div class="form-group">
                        <label class="form-label">Stock Inicial</label>
                        <input type="number" id="product-stock" class="form-control" value="${isEdit ? product.stock : 0}" required>
                    </div>
                </div>
                <div class="form-group">
                    <label class="form-label">
                        <input type="checkbox" id="product-itbms" ${isEdit && product.itbms ? 'checked' : ''}> Aplicar ITBMS
                    </label>
                </div>
                <div class="form-group">
                    <label class="form-label">Comentarios</label>
                    <textarea id="product-comments" class="form-control">${isEdit ? product.comments : ''}</textarea>
                </div>
                <div class="form-group" style="text-align: right; margin-top: 20px;">
                    <button type="button" class="btn btn-danger" onclick="inventorySystem.closeModal()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">${isEdit ? 'Actualizar' : 'Guardar'}</button>
                </div>
            </form>
        `;
        
        this.showModal(title, formHTML);
        
        document.getElementById('product-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveProduct(isEdit, product ? product.id : null);
        });
    }
    
    // Guardar producto
    saveProduct(isEdit, productId = null) {
        const code = document.getElementById('product-code').value;
        const description = document.getElementById('product-description').value;
        const brand = document.getElementById('product-brand').value;
        const unit = document.getElementById('product-unit').value;
        const cost = parseFloat(document.getElementById('product-cost').value);
        const price = parseFloat(document.getElementById('product-price').value);
        const stock = parseInt(document.getElementById('product-stock').value);
        const itbms = document.getElementById('product-itbms').checked;
        const comments = document.getElementById('product-comments').value;
        
        if (isEdit) {
            // Actualizar producto existente
            const index = this.data.products.findIndex(p => p.id === productId);
            if (index !== -1) {
                this.data.products[index] = {
                    ...this.data.products[index],
                    code,
                    description,
                    brand,
                    unit,
                    cost,
                    price,
                    stock,
                    itbms,
                    comments
                };
            }
        } else {
            // Crear nuevo producto
            const newId = this.data.products.length > 0 ? Math.max(...this.data.products.map(p => p.id)) + 1 : 1;
            this.data.products.push({
                id: newId,
                code,
                description,
                brand,
                unit,
                cost,
                price,
                stock,
                itbms,
                comments
            });
        }
        
        this.saveData();
        this.renderProducts();
        this.updateDashboard();
        this.closeModal();
        
        alert(`Producto ${isEdit ? 'actualizado' : 'agregado'} correctamente.`);
    }
    
    // Editar producto
    editProduct(id) {
        const product = this.data.products.find(p => p.id === id);
        if (product) {
            this.showProductForm(product);
        }
    }
    
    // Eliminar producto
    deleteProduct(id) {
        if (confirm('¿Está seguro de que desea eliminar este producto?')) {
            this.data.products = this.data.products.filter(p => p.id !== id);
            this.saveData();
            this.renderProducts();
            this.updateDashboard();
            alert('Producto eliminado correctamente.');
        }
    }
    
    // Mostrar formulario de entrada
    showEntryForm(entry = null) {
        const isEdit = entry !== null;
        const title = isEdit ? 'Editar Entrada' : 'Registrar Entrada';
        
        const productOptions = this.data.products.map(product => 
            `<option value="${product.id}" ${isEdit && entry.productId === product.id ? 'selected' : ''}>${product.description}</option>`
        ).join('');
        
        const supplierOptions = this.data.suppliers.map(supplier => 
            `<option value="${supplier}" ${isEdit && entry.supplier === supplier ? 'selected' : ''}>${supplier}</option>`
        ).join('');
        
        const formHTML = `
            <form id="entry-form">
                <div class="form-group">
                    <label class="form-label">Fecha</label>
                    <input type="date" id="entry-date" class="form-control" value="${isEdit ? entry.date : new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Producto</label>
                    <select id="entry-product" class="form-control" required>
                        <option value="">Seleccione un producto</option>
                        ${productOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Cantidad</label>
                    <input type="number" id="entry-quantity" class="form-control" value="${isEdit ? entry.quantity : ''}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Proveedor</label>
                    <select id="entry-supplier" class="form-control" required>
                        <option value="">Seleccione un proveedor</option>
                        ${supplierOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Comentarios</label>
                    <textarea id="entry-comments" class="form-control">${isEdit ? entry.comments : ''}</textarea>
                </div>
                <div class="form-group" style="text-align: right; margin-top: 20px;">
                    <button type="button" class="btn btn-danger" onclick="inventorySystem.closeModal()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">${isEdit ? 'Actualizar' : 'Guardar'}</button>
                </div>
            </form>
        `;
        
        this.showModal(title, formHTML);
        
        document.getElementById('entry-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveEntry(isEdit, entry ? entry.id : null);
        });
    }
    
    // Guardar entrada
    saveEntry(isEdit, entryId = null) {
        const date = document.getElementById('entry-date').value;
        const productId = parseInt(document.getElementById('entry-product').value);
        const quantity = parseInt(document.getElementById('entry-quantity').value);
        const supplier = document.getElementById('entry-supplier').value;
        const comments = document.getElementById('entry-comments').value;
        
        const product = this.data.products.find(p => p.id === productId);
        if (!product) {
            alert('Producto no encontrado');
            return;
        }
        
        const total = quantity * product.cost;
        
        if (isEdit) {
            // Actualizar entrada existente
            const index = this.data.entries.findIndex(e => e.id === entryId);
            if (index !== -1) {
                // Restaurar stock anterior
                const oldEntry = this.data.entries[index];
                const oldProduct = this.data.products.find(p => p.id === oldEntry.productId);
                if (oldProduct) {
                    oldProduct.stock -= oldEntry.quantity;
                }
                
                // Actualizar entrada
                this.data.entries[index] = {
                    ...this.data.entries[index],
                    date,
                    productId,
                    quantity,
                    supplier,
                    total,
                    comments
                };
                
                // Actualizar stock
                product.stock += quantity;
            }
        } else {
            // Crear nueva entrada
            const newId = this.data.entries.length > 0 ? Math.max(...this.data.entries.map(e => e.id)) + 1 : 1;
            this.data.entries.push({
                id: newId,
                date,
                productId,
                quantity,
                supplier,
                total,
                comments
            });
            
            // Actualizar stock
            product.stock += quantity;
        }
        
        this.saveData();
        this.renderEntries();
        this.updateDashboard();
        this.closeModal();
        
        alert(`Entrada ${isEdit ? 'actualizada' : 'registrada'} correctamente.`);
    }
    
    // Editar entrada
    editEntry(id) {
        const entry = this.data.entries.find(e => e.id === id);
        if (entry) {
            this.showEntryForm(entry);
        }
    }
    
    // Eliminar entrada
    deleteEntry(id) {
        if (confirm('¿Está seguro de que desea eliminar esta entrada?')) {
            const entry = this.data.entries.find(e => e.id === id);
            if (entry) {
                // Restaurar stock
                const product = this.data.products.find(p => p.id === entry.productId);
                if (product) {
                    product.stock -= entry.quantity;
                }
            }
            
            this.data.entries = this.data.entries.filter(e => e.id !== id);
            this.saveData();
            this.renderEntries();
            this.updateDashboard();
            alert('Entrada eliminada correctamente.');
        }
    }
    
    // Mostrar formulario de despacho
    showDispatchForm(dispatch = null) {
        const isEdit = dispatch !== null;
        const title = isEdit ? 'Editar Despacho' : 'Registrar Despacho';
        
        const productOptions = this.data.products.map(product => 
            `<option value="${product.id}" ${isEdit && dispatch.productId === product.id ? 'selected' : ''}>${product.description} (Stock: ${product.stock})</option>`
        ).join('');
        
        const clientOptions = this.data.clients.map(client => 
            `<option value="${client}" ${isEdit && dispatch.client === client ? 'selected' : ''}>${client}</option>`
        ).join('');
        
        const formHTML = `
            <form id="dispatch-form">
                <div class="form-group">
                    <label class="form-label">Fecha</label>
                    <input type="date" id="dispatch-date" class="form-control" value="${isEdit ? dispatch.date : new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Producto</label>
                    <select id="dispatch-product" class="form-control" required>
                        <option value="">Seleccione un producto</option>
                        ${productOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Cantidad</label>
                    <input type="number" id="dispatch-quantity" class="form-control" value="${isEdit ? dispatch.quantity : ''}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Cliente</label>
                    <select id="dispatch-client" class="form-control" required>
                        <option value="">Seleccione un cliente</option>
                        ${clientOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Comentarios</label>
                    <textarea id="dispatch-comments" class="form-control">${isEdit ? dispatch.comments : ''}</textarea>
                </div>
                <div class="form-group" style="text-align: right; margin-top: 20px;">
                    <button type="button" class="btn btn-danger" onclick="inventorySystem.closeModal()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">${isEdit ? 'Actualizar' : 'Guardar'}</button>
                </div>
            </form>
        `;
        
        this.showModal(title, formHTML);
        
        document.getElementById('dispatch-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveDispatch(isEdit, dispatch ? dispatch.id : null);
        });
    }
    
    // Guardar despacho
    saveDispatch(isEdit, dispatchId = null) {
        const date = document.getElementById('dispatch-date').value;
        const productId = parseInt(document.getElementById('dispatch-product').value);
        const quantity = parseInt(document.getElementById('dispatch-quantity').value);
        const client = document.getElementById('dispatch-client').value;
        const comments = document.getElementById('dispatch-comments').value;
        
        const product = this.data.products.find(p => p.id === productId);
        if (!product) {
            alert('Producto no encontrado');
            return;
        }
        
        // Verificar stock disponible
        if (!isEdit && product.stock < quantity) {
            alert(`Stock insuficiente. Stock disponible: ${product.stock}`);
            return;
        }
        
        const total = quantity * product.price;
        
        if (isEdit) {
            // Actualizar despacho existente
            const index = this.data.dispatches.findIndex(d => d.id === dispatchId);
            if (index !== -1) {
                // Restaurar stock anterior
                const oldDispatch = this.data.dispatches[index];
                const oldProduct = this.data.products.find(p => p.id === oldDispatch.productId);
                if (oldProduct) {
                    oldProduct.stock += oldDispatch.quantity;
                }
                
                // Actualizar despacho
                this.data.dispatches[index] = {
                    ...this.data.dispatches[index],
                    date,
                    productId,
                    quantity,
                    client,
                    total,
                    comments
                };
                
                // Actualizar stock
                product.stock -= quantity;
            }
        } else {
            // Crear nuevo despacho
            const newId = this.data.dispatches.length > 0 ? Math.max(...this.data.dispatches.map(d => d.id)) + 1 : 1;
            this.data.dispatches.push({
                id: newId,
                date,
                productId,
                quantity,
                client,
                total,
                comments
            });
            
            // Actualizar stock
            product.stock -= quantity;
        }
        
        this.saveData();
        this.renderDispatches();
        this.updateDashboard();
        this.closeModal();
        
        alert(`Despacho ${isEdit ? 'actualizado' : 'registrado'} correctamente.`);
    }
    
    // Editar despacho
    editDispatch(id) {
        const dispatch = this.data.dispatches.find(d => d.id === id);
        if (dispatch) {
            this.showDispatchForm(dispatch);
        }
    }
    
    // Eliminar despacho
    deleteDispatch(id) {
        if (confirm('¿Está seguro de que desea eliminar este despacho?')) {
            const dispatch = this.data.dispatches.find(d => d.id === id);
            if (dispatch) {
                // Restaurar stock
                const product = this.data.products.find(p => p.id === dispatch.productId);
                if (product) {
                    product.stock += dispatch.quantity;
                }
            }
            
            this.data.dispatches = this.data.dispatches.filter(d => d.id !== id);
            this.saveData();
            this.renderDispatches();
            this.updateDashboard();
            alert('Despacho eliminado correctamente.');
        }
    }
    
    // Mostrar formulario de ajuste
    showAdjustmentForm(adjustment = null) {
        const isEdit = adjustment !== null;
        const title = isEdit ? 'Editar Ajuste' : 'Registrar Ajuste';
        
        const productOptions = this.data.products.map(product => 
            `<option value="${product.id}" ${isEdit && adjustment.productId === product.id ? 'selected' : ''}>${product.description} (Stock: ${product.stock})</option>`
        ).join('');
        
        const formHTML = `
            <form id="adjustment-form">
                <div class="form-group">
                    <label class="form-label">Fecha</label>
                    <input type="date" id="adjustment-date" class="form-control" value="${isEdit ? adjustment.date : new Date().toISOString().split('T')[0]}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Tipo</label>
                    <select id="adjustment-type" class="form-control" required>
                        <option value="+" ${isEdit && adjustment.type === '+' ? 'selected' : ''}>Ajuste Positivo (+)</option>
                        <option value="-" ${isEdit && adjustment.type === '-' ? 'selected' : ''}>Ajuste Negativo (-)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Producto</label>
                    <select id="adjustment-product" class="form-control" required>
                        <option value="">Seleccione un producto</option>
                        ${productOptions}
                    </select>
                </div>
                <div class="form-group">
                    <label class="form-label">Cantidad</label>
                    <input type="number" id="adjustment-quantity" class="form-control" value="${isEdit ? adjustment.quantity : ''}" required>
                </div>
                <div class="form-group">
                    <label class="form-label">Comentarios</label>
                    <textarea id="adjustment-comments" class="form-control">${isEdit ? adjustment.comments : ''}</textarea>
                </div>
                <div class="form-group" style="text-align: right; margin-top: 20px;">
                    <button type="button" class="btn btn-danger" onclick="inventorySystem.closeModal()">Cancelar</button>
                    <button type="submit" class="btn btn-primary">${isEdit ? 'Actualizar' : 'Guardar'}</button>
                </div>
            </form>
        `;
        
        this.showModal(title, formHTML);
        
        document.getElementById('adjustment-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveAdjustment(isEdit, adjustment ? adjustment.id : null);
        });
    }
    
    // Guardar ajuste
    saveAdjustment(isEdit, adjustmentId = null) {
        const date = document.getElementById('adjustment-date').value;
        const type = document.getElementById('adjustment-type').value;
        const productId = parseInt(document.getElementById('adjustment-product').value);
        const quantity = parseInt(document.getElementById('adjustment-quantity').value);
        const comments = document.getElementById('adjustment-comments').value;
        
        const product = this.data.products.find(p => p.id === productId);
        if (!product) {
            alert('Producto no encontrado');
            return;
        }
        
        // Guardar stock anterior
        const previousStock = product.stock;
        
        // Verificar stock para ajustes negativos
        if (type === '-' && !isEdit && product.stock < quantity) {
            alert(`Stock insuficiente para ajuste negativo. Stock disponible: ${product.stock}`);
            return;
        }
        
        if (isEdit) {
            // Actualizar ajuste existente
            const index = this.data.adjustments.findIndex(a => a.id === adjustmentId);
            if (index !== -1) {
                // Restaurar stock anterior
                const oldAdjustment = this.data.adjustments[index];
                const oldProduct = this.data.products.find(p => p.id === oldAdjustment.productId);
                if (oldProduct) {
                    if (oldAdjustment.type === '+') {
                        oldProduct.stock -= oldAdjustment.quantity;
                    } else {
                        oldProduct.stock += oldAdjustment.quantity;
                    }
                }
                
                // Actualizar ajuste
                this.data.adjustments[index] = {
                    ...this.data.adjustments[index],
                    date,
                    type,
                    productId,
                    quantity,
                    comments,
                    previousStock,
                    currentStock: type === '+' ? previousStock + quantity : previousStock - quantity
                };
                
                // Actualizar stock
                if (type === '+') {
                    product.stock += quantity;
                } else {
                    product.stock -= quantity;
                }
            }
        } else {
            // Crear nuevo ajuste
            const newId = this.data.adjustments.length > 0 ? Math.max(...this.data.adjustments.map(a => a.id)) + 1 : 1;
            this.data.adjustments.push({
                id: newId,
                date,
                type,
                productId,
                quantity,
                comments,
                previousStock,
                currentStock: type === '+' ? previousStock + quantity : previousStock - quantity
            });
            
            // Actualizar stock
            if (type === '+') {
                product.stock += quantity;
            } else {
                product.stock -= quantity;
            }
        }
        
        this.saveData();
        this.renderAdjustments();
        this.updateDashboard();
        this.closeModal();
        
        alert(`Ajuste ${isEdit ? 'actualizado' : 'registrado'} correctamente.`);
    }
    
    // Editar ajuste
    editAdjustment(id) {
        const adjustment = this.data.adjustments.find(a => a.id === id);
        if (adjustment) {
            this.showAdjustmentForm(adjustment);
        }
    }
    
    // Eliminar ajuste
    deleteAdjustment(id) {
        if (confirm('¿Está seguro de que desea eliminar este ajuste?')) {
            const adjustment = this.data.adjustments.find(a => a.id === id);
            if (adjustment) {
                // Restaurar stock
                const product = this.data.products.find(p => p.id === adjustment.productId);
                if (product) {
                    if (adjustment.type === '+') {
                        product.stock -= adjustment.quantity;
                    } else {
                        product.stock += adjustment.quantity;
                    }
                }
            }
            
            this.data.adjustments = this.data.adjustments.filter(a => a.id !== id);
            this.saveData();
            this.renderAdjustments();
            this.updateDashboard();
            alert('Ajuste eliminado correctamente.');
        }
    }
    
    // Generar reporte mejorado
    generateReport() {
        const startDate = document.getElementById('start-date').value;
        const endDate = document.getElementById('end-date').value;
        const reportType = document.getElementById('report-type').value;
        
        const table = document.getElementById('reports-table');
        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');
        
        // Limpiar tabla
        thead.innerHTML = '';
        tbody.innerHTML = '';
        
        let headers = [];
        let rows = [];
        
        // Actualizar resumen del reporte
        this.updateReportSummary(reportType, startDate, endDate);
        
        switch (reportType) {
            case 'inventory':
                headers = ['Código', 'Descripción', 'Marca', 'Unidad', 'Stock Actual', 'Costo Unitario', 'Valor Total'];
                rows = this.data.products.map(product => [
                    product.code,
                    product.description,
                    product.brand,
                    product.unit,
                    product.stock,
                    `$${product.cost.toFixed(2)}`,
                    `$${(product.stock * product.cost).toFixed(2)}`
                ]);
                break;
                
            case 'movements':
                headers = ['Fecha', 'Movimiento', 'Producto', 'Cantidad', 'Cliente/Proveedor', 'Total'];
                
                // Combinar todos los movimientos
                const allMovements = [
                    ...this.data.entries.map(entry => {
                        const product = this.data.products.find(p => p.id === entry.productId);
                        return {
                            date: entry.date,
                            type: 'Entrada',
                            product: product ? product.description : 'N/A',
                            quantity: entry.quantity,
                            entity: entry.supplier,
                            total: `$${entry.total.toFixed(2)}`
                        };
                    }),
                    ...this.data.dispatches.map(dispatch => {
                        const product = this.data.products.find(p => p.id === dispatch.productId);
                        return {
                            date: dispatch.date,
                            type: 'Salida',
                            product: product ? product.description : 'N/A',
                            quantity: dispatch.quantity,
                            entity: dispatch.client,
                            total: `$${dispatch.total.toFixed(2)}`
                        };
                    }),
                    ...this.data.adjustments.map(adjustment => {
                        const product = this.data.products.find(p => p.id === adjustment.productId);
                        return {
                            date: adjustment.date,
                            type: `Ajuste (${adjustment.type})`,
                            product: product ? product.description : 'N/A',
                            quantity: adjustment.quantity,
                            entity: '—',
                            total: '—'
                        };
                    })
                ];
                
                // Filtrar por fecha si se especificó
                let filteredMovements = allMovements;
                if (startDate && endDate) {
                    filteredMovements = allMovements.filter(movement => {
                        const movementDate = new Date(movement.date);
                        const start = new Date(startDate);
                        const end = new Date(endDate);
                        return movementDate >= start && movementDate <= end;
                    });
                }
                
                // Ordenar por fecha
                filteredMovements.sort((a, b) => new Date(b.date) - new Date(a.date));
                
                rows = filteredMovements.map(movement => [
                    this.formatDate(movement.date),
                    movement.type,
                    movement.product,
                    movement.quantity,
                    movement.entity,
                    movement.total
                ]);
                break;
                
            case 'clients':
                headers = ['Cliente', 'Producto', 'Cantidad Total', 'Valor Total'];
                
                // Agrupar despachos por cliente
                const clientMap = {};
                this.data.dispatches.forEach(dispatch => {
                    const product = this.data.products.find(p => p.id === dispatch.productId);
                    if (!clientMap[dispatch.client]) {
                        clientMap[dispatch.client] = {};
                    }
                    
                    if (!clientMap[dispatch.client][dispatch.productId]) {
                        clientMap[dispatch.client][dispatch.productId] = {
                            product: product ? product.description : 'N/A',
                            quantity: 0,
                            total: 0
                        };
                    }
                    
                    clientMap[dispatch.client][dispatch.productId].quantity += dispatch.quantity;
                    clientMap[dispatch.client][dispatch.productId].total += dispatch.total;
                });
                
                // Convertir a filas
                Object.keys(clientMap).forEach(client => {
                    Object.keys(clientMap[client]).forEach(productId => {
                        const item = clientMap[client][productId];
                        rows.push([
                            client,
                            item.product,
                            item.quantity,
                            `$${item.total.toFixed(2)}`
                        ]);
                    });
                });
                break;
                
            case 'suppliers':
                headers = ['Proveedor', 'Producto', 'Cantidad Total', 'Valor Total'];
                
                // Agrupar entradas por proveedor
                const supplierMap = {};
                this.data.entries.forEach(entry => {
                    const product = this.data.products.find(p => p.id === entry.productId);
                    if (!supplierMap[entry.supplier]) {
                        supplierMap[entry.supplier] = {};
                    }
                    
                    if (!supplierMap[entry.supplier][entry.productId]) {
                        supplierMap[entry.supplier][entry.productId] = {
                            product: product ? product.description : 'N/A',
                            quantity: 0,
                            total: 0
                        };
                    }
                    
                    supplierMap[entry.supplier][entry.productId].quantity += entry.quantity;
                    supplierMap[entry.supplier][entry.productId].total += entry.total;
                });
                
                // Convertir a filas
                Object.keys(supplierMap).forEach(supplier => {
                    Object.keys(supplierMap[supplier]).forEach(productId => {
                        const item = supplierMap[supplier][productId];
                        rows.push([
                            supplier,
                            item.product,
                            item.quantity,
                            `$${item.total.toFixed(2)}`
                        ]);
                    });
                });
                break;
                
            case 'low-stock':
                headers = ['Código', 'Descripción', 'Marca', 'Stock Actual', 'Stock Mínimo Recomendado', 'Estado'];
                const lowStockThreshold = 10;
                rows = this.data.products
                    .filter(product => product.stock <= lowStockThreshold)
                    .map(product => [
                        product.code,
                        product.description,
                        product.brand,
                        product.stock,
                        lowStockThreshold,
                        product.stock === 0 ? 'Sin Stock' : 'Stock Bajo'
                    ]);
                break;
        }
        
        // Crear encabezados
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        
        // Crear filas de datos
        rows.forEach(rowData => {
            const row = document.createElement('tr');
            rowData.forEach(cellData => {
                const td = document.createElement('td');
                td.textContent = cellData;
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });
    }
    
   // Actualizar resumen del reporte
updateReportSummary(reportType, startDate, endDate) {
    let totalProducts = 0;
    let totalValue = 0;
    let totalMovements = 0;
    
    switch (reportType) {
        case 'inventory':
            totalProducts = this.data.products.length;
            totalValue = this.data.products.reduce((sum, product) => sum + (product.stock * product.cost), 0);
            totalMovements = this.data.entries.length + this.data.dispatches.length + this.data.adjustments.length;
            break;
            
        case 'movements':
            totalProducts = this.data.products.length;
            totalValue = this.data.products.reduce((sum, product) => sum + (product.stock * product.cost), 0);
            
            // Filtrar movimientos por fecha si es necesario
            let movements = [...this.data.entries, ...this.data.dispatches, ...this.data.adjustments];
            if (startDate && endDate) {
                movements = movements.filter(movement => {
                    const movementDate = new Date(movement.date);
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    return movementDate >= start && movementDate <= end;
                });
            }
            totalMovements = movements.length;
            break;
            
        case 'low-stock':
            const lowStockProducts = this.data.products.filter(product => product.stock <= 10);
            totalProducts = lowStockProducts.length;
            totalValue = lowStockProducts.reduce((sum, product) => sum + (product.stock * product.cost), 0);
            totalMovements = 0; // No aplica para este reporte
            break;
            
        default:
            totalProducts = this.data.products.length;
            totalValue = this.data.products.reduce((sum, product) => sum + (product.stock * product.cost), 0);
            totalMovements = this.data.entries.length + this.data.dispatches.length;
    }
    
    document.getElementById('report-total-products').textContent = totalProducts;
    document.getElementById('report-total-value').textContent = `$${totalValue.toFixed(2)}`;
    document.getElementById('report-total-movements').textContent = totalMovements;
}
    
    // Exportar reporte a CSV
    exportReport() {
        const table = document.getElementById('reports-table');
        const rows = table.querySelectorAll('tr');
        let csv = [];
        
        // Obtener encabezados
        const headers = [];
        table.querySelectorAll('th').forEach(th => {
            headers.push(th.textContent);
        });
        csv.push(headers.join(','));
        
        // Obtener datos
        rows.forEach(row => {
            const rowData = [];
            row.querySelectorAll('td').forEach(td => {
                rowData.push(td.textContent);
            });
            if (rowData.length > 0) {
                csv.push(rowData.join(','));
            }
        });
        
        // Crear y descargar archivo
        const csvContent = csv.join('\n');
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `reporte_inventario_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

// Inicializar la aplicación cuando se carga la página
let inventorySystem;
document.addEventListener('DOMContentLoaded', () => {
    inventorySystem = new InventorySystem();
});
