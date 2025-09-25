// Base de datos de productos disponibles
const productos = [
    {
        id: "super-mario-bros",
        nombre: "Super Mario Bros",
        precio: 29990,
        imagen: "img/gif/mario2.gif",
        descripcion: "El juego que revolucionó la industria. Aventura clásica de plataformas con Mario y Luigi."
    },
    {
        id: "pac-man-arcade",
        nombre: "Pac-Man Arcade",
        precio: 19990,
        imagen: "img/gif/Pacman2.gif",
        descripcion: "El come-cocos más famoso. Huye de los fantasmas y come todas las bolitas. ¡Wakka wakka!"
    },
    {
        id: "tetris-game-boy",
        nombre: "Tetris Game Boy",
        precio: 24990,
        imagen: "img/gif/tetris.gif",
        descripcion: "El puzzle perfecto. Encaja las piezas y haz líneas. Diversión adictiva garantizada."
    },
    {
        id: "legend-of-zelda",
        nombre: "The Legend of Zelda",
        precio: 34990,
        imagen: "img/gif/zelda.gif",
        descripcion: "Aventura épica de Link. Explora Hyrule y salva a la princesa Zelda del malvado Ganon."
    },
    {
        id: "sonic-hedgehog",
        nombre: "Sonic the Hedgehog",
        precio: 27990,
        imagen: "img/gif/sonic.gif",
        descripcion: "Velocidad pura con el erizo azul. Corre a través de Green Hill Zone y derrota a Dr. Robotnik."
    },
    {
        id: "street-fighter-ii",
        nombre: "Street Fighter II",
        precio: 32990,
        imagen: "img/gif/steet.gif",
        descripcion: "El rey de los juegos de lucha. Elige tu luchador favorito y domina los combos especiales."
    }
];

// Función para obtener carrito del localStorage
function obtenerCarrito() {
    return JSON.parse(localStorage.getItem('carritoRetroPixel')) || [];
}

function agregarAlCarrito(producto) {
    let carrito = obtenerCarrito();
    
    // Verificar si el producto ya existe
    const productoExistente = carrito.find(item => item.id === producto.id);
    
    if (productoExistente) {
        productoExistente.cantidad += 1;
    } else {
        producto.cantidad = 1;
        carrito.push(producto);
    }
    // Guardar en localStorage
    localStorage.setItem('carritoRetroPixel', JSON.stringify(carrito));
    // Mostrar mensaje de confirmación
    alert(producto.nombre + ' agregado al carrito!');
}

function eliminarProducto(idProducto) {
    let carrito = obtenerCarrito();
    
    // Filtrar el carrito para quitar el producto con el ID especificado
    carrito = carrito.filter(item => item.id !== idProducto);
    
    // Guardar el carrito actualizado en localStorage
    localStorage.setItem('carritoRetroPixel', JSON.stringify(carrito));
    
    // Actualizar la vista si existe el contenedor del carrito
    const contenedorCarrito = document.querySelector('main');
    if (contenedorCarrito) {
        mostrarCarrito();
    }
}

function calcularTotal() {
    const carrito = obtenerCarrito();
    
    // Usar reduce para sumar todos los precios * cantidad
    const total = carrito.reduce((acumulado, producto) => {
        return acumulado + (producto.precio * producto.cantidad);
    }, 0);
    
    // Devolver el total sin decimales
    return Math.round(total).toString();
}

function actualizarCantidad(idProducto, nuevaCantidad) {
    let carrito = obtenerCarrito();
    
    // Buscar el producto en el carrito
    const producto = carrito.find(item => item.id === idProducto);
    if (producto) {
        // Si la nueva cantidad es 0 o menos, eliminar el producto
        if (nuevaCantidad <= 0) {
            carrito = carrito.filter(item => item.id !== idProducto);
        } else {
            // Actualizar la cantidad
            producto.cantidad = nuevaCantidad;
        }
        
        // Guardar el carrito actualizado en localStorage
        localStorage.setItem('carritoRetroPixel', JSON.stringify(carrito));
        
        // Actualizar la vista si existe el contenedor del carrito
        const contenedorCarrito = document.querySelector('main');
        if (contenedorCarrito) {
            mostrarCarrito();
        }
    } else {
        alert('Producto no encontrado en el carrito');
    }
}

function vaciarCarrito() {
    // Confirmar con el usuario antes de vaciar
    if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
        // Eliminar todo del localStorage
        localStorage.removeItem('carritoRetroPixel');
        
        // Actualizar la vista del carrito
        mostrarCarrito();
    }
}

function comprarProducto(idProducto) {
    // Buscar el producto en nuestro array de productos
    const producto = productos.find(p => p.id === idProducto);
    
    if (producto) {
        agregarAlCarrito(producto);
    } else {
        alert('Producto no encontrado');
    }
}

function mostrarCarrito() {
    const carrito = obtenerCarrito();
    const contenedor = document.querySelector('main');
    
    // Si el carrito está vacío
    if (carrito.length === 0) {
        contenedor.innerHTML = `
            <div class="container">
                <h2>Tu Carrito</h2>
                <div class="carrito-vacio">
                    <p>Tu carrito está vacío</p>
                    <a href="productos.html" class="btn-primary">Ver Productos</a>
                </div>
            </div>
        `;
        return;
    }
    
    // Si hay productos en el carrito
    let htmlCarrito = `
        <div class="container">
            <h2>Tu Carrito</h2>
            <div class="productos-carrito">
    `;
    
    // Generar HTML para cada producto
    carrito.forEach(producto => {
        htmlCarrito += `
            <div class="producto-carrito" data-id="${producto.id}">
                <div class="producto-info">
                    <h3>${producto.nombre}</h3>
                    <p class="precio">$${producto.precio}</p>
                </div>
                <div class="producto-controles">
                    <button onclick="actualizarCantidad('${producto.id}', ${producto.cantidad - 1})">-</button>
                    <span class="cantidad">${producto.cantidad}</span>
                    <button onclick="actualizarCantidad('${producto.id}', ${producto.cantidad + 1})">+</button>
                    <button onclick="eliminarProducto('${producto.id}')" class="btn-eliminar">🗑️</button>
                </div>
            </div>
        `;
    });
    
    // Agregar total y botones finales
    htmlCarrito += `
            </div>
            <div class="carrito-resumen">
                <h3>Total: $${calcularTotal()}</h3>
                <div class="carrito-acciones">
                    <button onclick="vaciarCarrito()" class="btn-secundario">Vaciar Carrito</button>
                    <button class="btn-primary">Proceder al Pago</button>
                </div>
            </div>
        </div>
    `;
    // Mostrar el HTML en la página
    contenedor.innerHTML = htmlCarrito;
}



