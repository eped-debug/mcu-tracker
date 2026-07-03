// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// เชื่อมต่อ MongoDB (ใช้ลิงก์ของคุณที่แก้รหัสผ่านแล้ว)
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://wannapalldk:ggloser1234@cluster0.xnaovaf.mongodb.net/mcu_project?appName=Cluster0'; 

mongoose.connect(mongoURI).then(() => console.log('Connected to MongoDB'));

const mcuSchema = new mongoose.Schema({
    title: String,
    releaseDate: Date,
    phase: Number,
    isWatched: { type: Boolean, default: false }
});
const Movie = mongoose.model('Movie', mcuSchema);

// API: ดึงข้อมูล
app.get('/api/movies', async (req, res) => {
    const movies = await Movie.find().sort({ releaseDate: 1 });
    res.json(movies);
});

// API: เพิ่มหนังใหม่ (Admin Only)
app.post('/api/movies', async (req, res) => {
    const { title, releaseDate, phase, secretKey } = req.body;
    if (secretKey !== 'admin123') return res.status(403).json({ message: 'Forbidden' });
    
    const newMovie = new Movie({ title, releaseDate, phase });
    await newMovie.save();
    res.json(newMovie);
});

// API: อัปเดตสถานะการดู
app.put('/api/movies/:id', async (req, res) => {
    const { isWatched, secretKey } = req.body;
    if (secretKey !== 'admin123') return res.status(403).json({ message: 'Forbidden' });
    const updated = await Movie.findByIdAndUpdate(req.params.id, { isWatched }, { new: true });
    res.json(updated);
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));