const express = require('express');
const { createClient } = require('redis');

const app = express();
const redisClient = createClient({ url: 'redis://redis-cache:6379' });
redisClient.connect().then(() => console.log('⚡ Redis Conectado'));


const usuarios = [{ id: 1, nome: "João" }, { id: 2, nome: "Maria" }];
const produtos = [{ id: 1, nome: "Notebook" }, { id: 2, nome: "Mouse" }];

const CACHE_TTL = 3600;  //"tempo de expiração"


app.get('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const cache = await redisClient.get(`user:${id}`);
    // Cache Hit
    if (cache) return res.json({ fonte: 'cache', dados: JSON.parse(cache) });

    const usuario = usuarios.find(u => u.id === parseInt(id));
    if (!usuario) return res.status(404).send('Não encontrado');

    await redisClient.set(`user:${id}`, JSON.stringify(usuario), { expiration: CACHE_TTL });
    // Cache Miss
    res.json({ fonte: 'banco', dados: usuario });
});


app.get('/produtos/:id', async (req, res) => {
    const { id } = req.params;
    const cache = await redisClient.get(`prod:${id}`);
    // Cache Hit
    if (cache) return res.json({ fonte: 'cache', dados: JSON.parse(cache) });

    const produto = produtos.find(p => p.id === parseInt(id));
    if (!produto) return res.status(404).send('Não encontrado');

    // Cache Miss
    await redisClient.set(`prod:${id}`, JSON.stringify(produto), { expiration: CACHE_TTL });
    res.json({ fonte: 'banco', dados: produto });
});

app.listen(3000, () => console.log('Rodando na 3000'));