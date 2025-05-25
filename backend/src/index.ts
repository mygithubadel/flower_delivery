import app from './app';

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Flower Delivery server running on port ${PORT}`));