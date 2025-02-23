const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const upload = multer({ storage });

app.use(express.json());

app.get('/banners', (req, res) => {
    fs.readFile('banners.json', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка при чтении файла баннеров.' });
        }
        res.json(JSON.parse(data));
    });
});

app.post('/add-banner', upload.single('banner-image'), (req, res) => {
    const banner = {
        image: req.file.filename,
        size: req.body['banner-size']
    };

    fs.readFile('banners.json', (err, data) => {
        if (err) {
            return res.status(500).json({ error: 'Ошибка при чтении файла баннеров.' });
        }
        const banners = JSON.parse(data);
        banners.push(banner);
        fs.writeFile('banners.json', JSON.stringify(banners, null, 2), (err) => {
            if (err) {
                return res.status(500).json({ error: 'Ошибка при записи файла баннеров.' });
            }
            res.json({ success: true });
        });
    });
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});