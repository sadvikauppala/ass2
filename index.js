const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config();
const Movie = require('./Schema.js')

const app = express();
app.use(express.json())
app.use(cors());
const PORT = 5000;

const db =  async()=>{
  try{
await mongoose.connect(process.env.MONGO_URL)
console.log('MongoDB Server Connected')}

catch(e){
console.log(e)
}
}
db();

app.post('/movies', async (req, res) => {
  try {
      const movie = new Movie(req.body);
      await movie.save();
      res.status(201).json(movie);
  } catch (err) {
      res.status(400).json({ error: 'Missing required fields' });
  }
});


app.get('/movies/:id?', async (req, res) => {
  try {
      if (req.params.id) {
          const movie = await Movie.findById(req.params.id);
          if (!movie) return res.status(404).json({ error: 'Movie not found' });
          return res.json(movie);
      }
      const movies = await Movie.find();
      res.json(movies);
  } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.put('/movies/:id', async (req, res) => {
  try {
      const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!movie) return res.status(404).json({ error: 'Movie not found' });
      res.json(movie);
  } catch (err) {
      res.status(400).json({ error: 'Invalid request data' });
  }
});


app.delete('/movies/:id', async (req, res) => {
  try {
      const movie = await Movie.findByIdAndDelete(req.params.id);
      if (!movie) return res.status(404).json({ error: 'Movie not found' });
      res.json({ message: 'Movie deleted successfully' });
  } catch (err) {
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT,()=>{
  console.log(`Connected Successfully ${PORT}`);
});
