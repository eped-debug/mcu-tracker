// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// ใช้ลิงก์จาก Render (หรือถ้าไม่มีจะใช้ลิงก์ในสำรอง)
const mongoURI = process.env.MONGO_URI || 'mongodb+srv://wannapalldk:รหัสผ่านของคุณ@cluster0.xnaovaf.mongodb.net/mcu_project?appName=Cluster0';

mongoose.connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

const mcuSchema = new mongoose.Schema({
  title: String,
  releaseDate: Date,
  phase: Number,
  isWatched: { type: Boolean, default: false }
});
const Movie = mongoose.model('Movie', mcuSchema);

// API ดึงข้อมูลหนัง
app.get('/api/movies', async (req, res) => {
  try {
    const movies = await Movie.find().sort({ releaseDate: 1 });
    res.json(movies);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API เพิ่มหนังใหม่ (Admin)
app.post('/api/movies', async (req, res) => {
  const { title, releaseDate, phase, secretKey } = req.body;
  if (secretKey !== 'admin123') return res.status(403).json({ message: 'Forbidden' });
  try {
    const newMovie = new Movie({ title, releaseDate, phase });
    await newMovie.save();
    res.json(newMovie);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// API อัปเดตสถานะการดู
app.put('/api/movies/:id', async (req, res) => {
  const { isWatched, secretKey } = req.body;
  if (secretKey !== 'admin123') return res.status(403).json({ message: 'Forbidden' });
  try {
    const updated = await Movie.findByIdAndUpdate(req.params.id, { isWatched }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ⭐ API พิเศษสำหรับเทข้อมูล 50 เรื่องบนคลาวด์ (เปิดลิงก์ /api/reset-db ในเบราว์เซอร์เพื่อรัน)
app.get('/api/reset-db', async (req, res) => {
  const mcuData = [
    { title: "Iron Man", releaseDate: "2008-05-02", phase: 1, isWatched: false },
    { title: "The Incredible Hulk", releaseDate: "2008-06-13", phase: 1, isWatched: false },
    { title: "Iron Man 2", releaseDate: "2010-05-07", phase: 1, isWatched: false },
    { title: "Thor", releaseDate: "2011-05-06", phase: 1, isWatched: false },
    { title: "Captain America: The First Avenger", releaseDate: "2011-07-22", phase: 1, isWatched: false },
    { title: "The Avengers", releaseDate: "2012-05-04", phase: 1, isWatched: false },
    { title: "Iron Man 3", releaseDate: "2013-05-03", phase: 2, isWatched: false },
    { title: "Thor: The Dark World", releaseDate: "2013-11-08", phase: 2, isWatched: false },
    { title: "Captain America: The Winter Soldier", releaseDate: "2014-04-04", phase: 2, isWatched: false },
    { title: "Guardians of the Galaxy", releaseDate: "2014-08-01", phase: 2, isWatched: false },
    { title: "Avengers: Age of Ultron", releaseDate: "2015-05-01", phase: 2, isWatched: false },
    { title: "Ant-Man", releaseDate: "2015-07-17", phase: 2, isWatched: false },
    { title: "Captain America: Civil War", releaseDate: "2016-05-06", phase: 3, isWatched: false },
    { title: "Doctor Strange", releaseDate: "2016-11-04", phase: 3, isWatched: false },
    { title: "Guardians of the Galaxy Vol. 2", releaseDate: "2017-05-05", phase: 3, isWatched: false },
    { title: "Spider-Man: Homecoming", releaseDate: "2017-07-07", phase: 3, isWatched: false },
    { title: "Thor: Ragnarok", releaseDate: "2017-11-03", phase: 3, isWatched: false },
    { title: "Black Panther", releaseDate: "2018-02-16", phase: 3, isWatched: false },
    { title: "Avengers: Infinity War", releaseDate: "2018-04-27", phase: 3, isWatched: false },
    { title: "Ant-Man and the Wasp", releaseDate: "2018-07-06", phase: 3, isWatched: false },
    { title: "Captain Marvel", releaseDate: "2019-03-08", phase: 3, isWatched: false },
    { title: "Avengers: Endgame", releaseDate: "2019-04-26", phase: 3, isWatched: false },
    { title: "Spider-Man: Far From Home", releaseDate: "2019-07-02", phase: 3, isWatched: false },
    { title: "WandaVision (Series)", releaseDate: "2021-01-15", phase: 4, isWatched: false },
    { title: "The Falcon and the Winter Soldier (Series)", releaseDate: "2021-03-19", phase: 4, isWatched: false },
    { title: "Loki Season 1 (Series)", releaseDate: "2021-06-09", phase: 4, isWatched: false },
    { title: "Black Widow", releaseDate: "2021-07-09", phase: 4, isWatched: false },
    { title: "What If...? Season 1 (Series)", releaseDate: "2021-08-11", phase: 4, isWatched: false },
    { title: "Shang-Chi and the Legend of the Ten Rings", releaseDate: "2021-09-03", phase: 4, isWatched: false },
    { title: "Eternals", releaseDate: "2021-11-05", phase: 4, isWatched: false },
    { title: "Hawkeye (Series)", releaseDate: "2021-11-24", phase: 4, isWatched: false },
    { title: "Spider-Man: No Way Home", releaseDate: "2021-12-17", phase: 4, isWatched: false },
    { title: "Moon Knight (Series)", releaseDate: "2022-03-30", phase: 4, isWatched: false },
    { title: "Doctor Strange in the Multiverse of Madness", releaseDate: "2022-05-06", phase: 4, isWatched: false },
    { title: "Ms. Marvel (Series)", releaseDate: "2022-06-08", phase: 4, isWatched: false },
    { title: "Thor: Love and Thunder", releaseDate: "2022-07-08", phase: 4, isWatched: false },
    { title: "She-Hulk: Attorney at Law (Series)", releaseDate: "2022-08-18", phase: 4, isWatched: false },
    { title: "Black Panther: Wakanda Forever", releaseDate: "2022-11-11", phase: 4, isWatched: false },
    { title: "Ant-Man and the Wasp: Quantumania", releaseDate: "2023-02-17", phase: 5, isWatched: false },
    { title: "Guardians of the Galaxy Vol. 3", releaseDate: "2023-05-05", phase: 5, isWatched: false },
    { title: "Secret Invasion (Series)", releaseDate: "2023-06-21", phase: 5, isWatched: false },
    { title: "Loki Season 2 (Series)", releaseDate: "2023-10-06", phase: 5, isWatched: false },
    { title: "The Marvels", releaseDate: "2023-11-10", phase: 5, isWatched: false },
    { title: "Echo (Series)", releaseDate: "2024-01-09", phase: 5, isWatched: false },
    { title: "Deadpool & Wolverine", releaseDate: "2024-07-26", phase: 5, isWatched: false },
    { title: "Agatha All Along (Series)", releaseDate: "2024-09-18", phase: 5, isWatched: false },
    { title: "What If...? Season 3 (Series)", releaseDate: "2024-12-22", phase: 5, isWatched: false },
    { title: "Captain America: Brave New World", releaseDate: "2025-02-14", phase: 5, isWatched: false },
    { title: "Thunderbolts*", releaseDate: "2025-05-02", phase: 5, isWatched: false },
    { title: "The Fantastic Four: First Steps", releaseDate: "2025-07-25", phase: 6, isWatched: false },
    { title: "Avengers: Doomsday", releaseDate: "2026-05-01", phase: 6, isWatched: false },
    { title: "Spider-Man: Brand New Day", releaseDate: "2026-07-24", phase: 6, isWatched: false }
  ];
  try {
    await Movie.deleteMany({});
    await Movie.insertMany(mcuData);
    res.send('<h1>✅ เทข้อมูลภาพยนตร์ MCU เข้าสู่ระบบสำเร็จทั้ง 50 เรื่อง!</h1><p><a href="/">คลิกที่นี่เพื่อกลับไปหน้าหลัก</a></p>');
  } catch (err) {
    res.status(500).send('❌ เกิดข้อผิดพลาด: ' + err.message);
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));