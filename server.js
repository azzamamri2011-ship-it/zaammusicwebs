const express = require('express');
const ytdl = require('@distube/ytdl-core');
const yts = require('yt-search');
const app = express();

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36'
};

app.get('/api/search', async (req, res) => {
    try {
        const query = req.query.q;
        const result = await yts(query || 'lagu populer');
        const data = result.videos.slice(0, 20).map(v => ({
            id: v.videoId,
            title: v.title,
            artist: v.author.name,
            cover: v.thumbnail,
            duration: v.timestamp
        }));
        res.json(data);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.get('/api/stream', async (req, res) => {
    try {
        const videoId = req.query.id;
        const info = await ytdl.getInfo(`https://www.youtube.com/watch?v=${videoId}`, { 
            requestOptions: { headers } 
        });
        
        const format = ytdl.chooseFormat(info.formats, { 
            filter: 'audioonly', 
            quality: 'highestaudio' 
        });

        // Alih-alih .pipe(res), kita kirim URL-nya saja
        res.json({ url: format.url });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

