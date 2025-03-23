import fetch from 'node-fetch';
import pkg from 'pg';
const { Client } = pkg;

// Pripojenie k databáze
const client = new Client({
    user: 'oliverprovaznik',
    host: 'localhost',
    database: 'blog',
    password: '38654Us',
    port: 5432,
});

async function getDataAndInsert() {
    await client.connect();
    
    // Stiahnutie dát
    const response = await fetch('https://dummyjson.com/posts');
    const jsonData = await response.json();

    for (const post of jsonData.posts) {
        const query = `
            INSERT INTO posts (id, title, body, views, user_id, tags, likes, dislikes)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (id) DO NOTHING;
        `;
        const values = [
            post.id,
            post.title,
            post.body,
            post.views,
            post.userId,
            post.tags, // Pole textov
            post.reactions.likes, // Priame číslo
            post.reactions.dislikes // Priame číslo
        ];
        
        await client.query(query, values);
    }
    
    console.log("Dáta úspešne nahrané a sú identické s internetovou verziou!");
    await client.end();
}

getDataAndInsert().catch(console.error);

