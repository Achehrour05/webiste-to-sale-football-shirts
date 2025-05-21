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
  const ba = {
   
   jacket: [
    { id: 49, path: "/assets/AJAX JACKET.JPG", text: "AJAX JACKET", price: "720 DH", category: "Jacket" },
    { id: 50, path: "/assets/BRAZIL JACKET.JPG", text: "BRAZIL JACKET", price: "800 DH", category: "Jacket" },
    { id: 51, path: "/assets/CHELSEA JACKET.JPG", text: "CHELSEA JACKET", price: "750 DH", category: "Jacket" },
    { id: 52, path: "/assets/ENGLAND JACKET.JPG", text: "ENGLAND JACKET", price: "700 DH", category: "Jacket" },
    { id: 53, path: "/assets/JUVENTUS JACKET.JPG", text: "JUVENTUS JACKET", price: "740 DH", category: "Jacket" },
  ],
  ALL: [
    { id: 54, path: "/assets/LIVERPOOL JACKET.JPG", text: "LIVERPOOL JACKET", price: "600 DH", category: "Jacket" },
    { id: 55, path: "/assets/MUN JACKET.JPG", text: "MUN JACKET", price: "580 DH", category: "Jacket" },
    { id: 56, path: "/assets/NIKE TOTTENHAM HOTSPUR JACKET.JPG", text: "NIKE TOTTENHAM HOTSPUR JACKET", price: "550 DH", category: "Jacket" },
    { id: 57, path: "/assets/NIKE USA JACKET.JPG", text: "NIKE USA JACKET", price: "570 DH", category: "Jacket" },
    { id: 58, path: "/assets/PORTUGAL JACKET.JPG", text: "PORTUGAL JACKET", price: "800 DH", category: "Jacket" },
    { id: 59, path: "/assets/ADIDAS ENTRADA 22.JPG", text: "ADIDAS ENTRADA 22", price: "600 DH", category: "Jacket" },
    { id: 60, path: "/assets/NIKE PARK 20 RAIN JACKET.JPG", text: "NIKE PARK 20 RAIN JACKET", price: "700 DH", category: "Jacket" },
    { id: 61, path: "/assets/STANNO PRIME JACKET.JPG", text: "STANNO PRIME JACKET", price: "830 DH", category: "Jacket" },
    { id: 62, path: "/assets/JAMA CHAMPIONSHIP.JPG", text: "JAMA CHAMPIONSHIP", price: "630 DH", category: "Jacket" },
    { id: 72, path: "/assets/JOMA MONTREAL JACKET.JPG", text: "JOMA MONTREAL JACKET", price: "760 DH", category: "Jacket" },
    { id: 73, path: "/assets/JAMA COMBI GALA.JPG", text: "JAMA COMBI GALA", price: "680 DH", category: "Jacket" },
    { id: 74, path: "/assets/NIKE ACADEMY.JPG", text: "NIKE ACADEMY", price: "640 DH", category: "Jacket" },
    { id: 75, path: "/assets/AJAX JACKET.JPG", text: "AJAX JACKET", price: "720 DH", category: "Jacket" },
    { id: 76, path: "/assets/BRAZIL JACKET.JPG", text: "BRAZIL JACKET", price: "800 DH", category: "Jacket" },
    { id: 77, path: "/assets/CHELSEA JACKET.JPG", text: "CHELSEA JACKET", price: "750 DH", category: "Jacket" },
    { id: 78, path: "/assets/ENGLAND JACKET.JPG", text: "ENGLAND JACKET", price: "700 DH", category: "Jacket" },
    { id: 79, path: "/assets/JUVENTUS JACKET.JPG", text: "JUVENTUS JACKET", price: "740 DH", category: "Jacket" },
],
  };

  const allProducts = Object.values(ba).flat();

  const query = `
    INSERT INTO allproducts (text,path)
    VALUES ( ?, ?)
  `;

  allProducts.forEach(product => {
    const { text,path} = product;
    connection.query(query, [text,path], (err) => {
      if (err) {
        console.error(`❌ Error inserting ${text}:`, err.message);
      } else {
        console.log(`✅ Inserted: ${text}`);
      }
    });
  });

  setTimeout(() => connection.end(), 2000);
}
