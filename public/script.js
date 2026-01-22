//Catálogo de productos
const products = [
  {
    name: "Chaqueta de cuero",
    price: 9.99,
    image: "imagenes/chaqueta_cuero.jpg"
  },
  {
    name: "Camisa Roja",
    price: 19.99,
    image: "imagenes/camisa_roja.jpg"
  },
  {
    name: "Falda Cargo",
    price: 14.99,
    image: "imagenes/falda_cargo.jpeg"
  },
  {
    name: "Pantalón Cargo",
    price: 19.99,
    image: "imagenes/pantalon_cargo.jpg"
  },
  {
    name: "Pantalon Negro",
    price: 24.99,
    image: "imagenes/pantalon_negro.jpg"
  },
  {
    name: "Zapatos New Balance",
    price: 49.99,
    image: "imagenes/zapatos.jpg"
  }
];

const productContainer = document.getElementById("product-list");
const cartList = document.getElementById("cart");
const totalSpan = document.getElementById("total");
const cart = [];

// 🔐 Credenciales PayPhone
const PAYPHONE_TOKEN = "tpHYomIvQd2pmPu1Dx5etZFy8v5G4osaFOgV9KTxq6UtwfNpY099xvninTRYlQ5RiATC8cHNngzeue9QVu9sxikXxGa37EQx0yLtKAeer-eL4FIMPqF-v0GPwl7WlZTOczA807B0wpAyKYQWaCte1i_gPmdCAOOuwvzdhvSjKD-tTFuxNosxCpmEGM58O4ijyxmkMz-cM1EZuxbg1niAnbsAd_fcb-9n6dP3URkMarKT3ouaKbv8liA5pL2vYYMNtWLutxgoK5tUoAjpA6ftbUem4qnvd-CDmltBDm-oyxmq2Tq_nSZ1ViJKoBP3WApJgwCqqw";
const PAYPHONE_STORE = "e6361d28-24cb-40ab-bcd7-f88824eaefc7";

// 🧠 Control para mostrar PayPhone solo al pagar
let pagoVisible = false;


// Función para convertir dólares a centavos
const cents = dollars => Math.round(dollars * 100);

// mensajes Toast
// Muestra mensajes visuales (éxito o error)
function mostrarToast(msg, exito = true) {
  const toast = document.createElement("div");
  toast.textContent = msg;
  toast.className = "toast";
  toast.style.background = exito ? "#28a745" : "#d9534f";
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// 💳 Render PayPhone
function renderPayphone(totalCents) {
  const btnContainer = document.getElementById("pp-button");
  btnContainer.innerHTML = "";

  if (!pagoVisible || totalCents === 0) return;

  const clientTxId = "txn-" + Date.now();

  new PPaymentButtonBox({
    token: PAYPHONE_TOKEN,
    storeId: PAYPHONE_STORE,
    clientTransactionId: clientTxId,
    amount: totalCents,
    amountWithoutTax: totalCents,
    currency: "USD",
    reference: "Compra " + clientTxId,
    lang: "es",
    timeZone: -5,

    onSuccess: (resp) => {

     // REQUEST AL BACKEND
      // Se envía el id de PayPhone para confirmar el pago
      fetch("http://127.0.0.1:3000/api/confirm-payphone", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: resp.id,
          clientTransactionId: clientTxId
        })
      })
      .then(r => r.json())  // RESPONSE del backend
      .then(data => {
        if (data.transactionStatus === "Paid") {
          mostrarToast("✅ Pago confirmado");

          // Limpiar carrito
          cart.length = 0;
          pagoVisible = false;
          updateCart();

          //  Guardar datos para página de confirmación
          localStorage.setItem("pagoConfirmado", JSON.stringify({
            estado: data.transactionStatus,
            clientTransactionId: clientTxId,
            payphoneId: resp.id,
            total: totalSpan.textContent
          }));

          // Redirigir a confirmación
          window.location.href = "confirmacion.html";

        } else {
          mostrarToast("⚠ Estado: " + data.transactionStatus, false);
        }
      })
      .catch(() => mostrarToast("Error al confirmar", false));
    },

    onError: () => {
      mostrarToast("Pago cancelado o fallido", false);
    }
  }).render("pp-button");
}

// 🛒 Actualizar carrito
function updateCart() {
  cartList.innerHTML = "";
  let total = 0;

  cart.forEach(p => {
    const li = document.createElement("li");
    li.textContent = `${p.name} – $${p.price.toFixed(2)}`;
    cartList.appendChild(li);
    total += p.price;
  });
//MOSTRAR TOTAL
  totalSpan.textContent = total.toFixed(2);
  renderPayphone(cents(total));
}

// 🧾 Productos
function renderProducts() {
  products.forEach(p => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${p.image}" alt="${p.name}">
      <h2>${p.name}</h2>
      <p>Precio: $${p.price.toFixed(2)}</p>
      <button>Añadir al carrito</button>
    `;
    card.querySelector("button").onclick = () => {
      cart.push(p);
      updateCart();
    };
    productContainer.appendChild(card);
  });
}

// 🎯 Botones de acción
document.getElementById("payBtn").addEventListener("click", () => {
  if (cart.length === 0) {
    mostrarToast("El carrito está vacío", false);
    return;
  }

  pagoVisible = true;
  updateCart();

  // Forzar scroll al botón de PayPhone
  setTimeout(() => {
    const pp = document.getElementById("pp-button");
    if (pp) {
      pp.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 300);
});


//VACIAR CARRITO
document.getElementById("clearBtn").addEventListener("click", () => {
  cart.length = 0;
  pagoVisible = false;
  document.getElementById("pp-button").innerHTML = "";
  updateCart();
  mostrarToast("Carrito vaciado");
});

// INICIO DE LA APP
document.addEventListener("DOMContentLoaded", () => {
  renderProducts();  // mostrar productos
  updateCart();     // inicializar carrito
});
