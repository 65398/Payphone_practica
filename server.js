const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

// Permite peticiones desde el frontend
app.use(cors());
app.use(express.json());

// 👉 ESTO ES CLAVE para que cargue index.html
app.use(express.static('public'));

// ✅ Credenciales PayPhone (BACKEND)
const CLIENT_ID = 'sjGy6ZKPe0CckYLNc4TUZQ';        // Identificación del cliente
const CLIENT_SECRET = 'F7a4JAyfkmL7r8BYvctdQ';    // Clave secreta

// Obtener token de autenticación PayPhone
let cachedToken = null;
let tokenTime = 0;

// 🔐 Obtener token de acceso desde PayPhone
async function getToken() {
  const now = Date.now();

  if (cachedToken && now - tokenTime < 60 * 60 * 1000) {
    return cachedToken;
  }

 //REQUEST a la API de PayPhone para autenticación
  const response = await axios.post(
    'https://pay.payphonetodoesposible.com/api/auth',
    {},
    {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        clientId: CLIENT_ID,           // Credencial enviada
        clientSecret: CLIENT_SECRET,  // Credencial enviada
      },
    }
  );


  // RESPONSE: PayPhone devuelve un accessToken
  cachedToken = response.data.accessToken;
  tokenTime = now;
  return cachedToken;
}

// Confirmación del pago 
// RECIBE request del frontend
// ENVÍA request a PayPhone
// DEVUELVE response al frontend
app.post('/api/confirm-payphone', async (req, res) => {
  const { id, clientTransactionId } = req.body;

  if (!id || !clientTransactionId) {
    return res.status(400).json({ error: 'Faltan parámetros.' });
  }

  try {
    const token = await getToken();

    const response = await axios.post(
      'https://pay.payphonetodoesposible.com/api/button/V2/Confirm',
      { id, clientTransactionId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('❌ Error al confirmar:', error?.response?.data || error.message);
    res.status(500).json({ error: 'Error al confirmar el pago.' });
  }
});


// Redirección a página de confirmación
app.get('/api/confirm-payphone', (req, res) => {
  const { id, clientTransactionId } = req.query;

  res.redirect(
    `/confirmacion.html?id=${id}&clientTransactionId=${clientTransactionId}`
  );
});


// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend activo en http://localhost:${PORT}`);
});
