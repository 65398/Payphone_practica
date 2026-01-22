const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom'); // Usa jsdom para simular el DOM

describe('Tienda Catalogo de Productos - Funcionalidades del DOM', () => {
  let document;

  beforeAll(() => {
    const html = fs.readFileSync(path.resolve(__dirname, '../public/index.html'), 'utf8');
    const dom = new JSDOM(html);
    document = dom.window.document;
  });

  it('Debe contener un contenedor de productos', () => {
    const productList = document.querySelector('#product-list');
    expect(productList).not.toBeNull();
  });

  it('Debe contener el botón de pagar', () => {
    const payButton = document.querySelector('#pay-button');
    expect(payButton).not.toBeNull();
    expect(payButton.textContent.toLowerCase()).toContain('pagar');
  });

  it('Debe tener el carrito con total inicial en 0.00', () => {
    const total = document.querySelector('#cart-total');
    expect(total).not.toBeNull();
    expect(total.textContent.trim()).toBe('0.00');
  });

  it('Debe tener el contenedor para mostrar productos en el carrito', () => {
    const cartList = document.querySelector('#cart');
    expect(cartList).not.toBeNull();
  });
});