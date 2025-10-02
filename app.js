import express from 'express';

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('¡Hola, Mundo con Express!');
});

app.listen(port, () => {
  console.log(`La aplicación Express está escuchando en el puerto ${port}`);
});