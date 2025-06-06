const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test'
});

connection.connect(err => {
  if (err) {
    console.error('❌ Connection error:', err.message);
    return;
  }
  console.log('✅ Connected to MySQL');
  insertProducts();
});

function insertProducts() {
  const products = [
    { url: '/Kits', path: "/assets/neymar.jpg", category: 'categories' },
    { url: '/Boots', path: "/assets/bootss.jpg", category: 'categories' },
    { url: '/Jackets', path: "/assets/jackets.jpg", category: 'categories' },
    { url: '/Balls', path: "/assets/bl.jpg", category: 'categories' },

  ];

  const query = `
    INSERT INTO carouselimages (url, path, title, description, category)
    VALUES (?, ?, ?, ?, ?)
  `;

  products.forEach(product => {
    const { url, path, title, description, category } = product;
    connection.query(query, [url, path, title, description, category], (err) => {
      if (err) {
        console.error(`❌ Error inserting ${title}:`, err.message);
      } else {
        console.log(`✅ Inserted: ${title}`);
      }
    });
  });

  setTimeout(() => connection.end(), 2000);
}
