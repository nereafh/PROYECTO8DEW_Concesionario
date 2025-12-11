CREATE TABLE coches (
  id INT AUTO_INCREMENT PRIMARY KEY,
  marca VARCHAR(20) NOT NULL,
  modelo VARCHAR(50) NOT NULL,
  vendido TINYINT(1) DEFAULT 0,
  precio DECIMAL(10,2)
);

INSERT INTO coches (marca, modelo, vendido, precio) VALUES
('BMW','Serie 1',0,35000),
('BMW','Serie 2',0,42000),
('AUDI','A3',0,33000),
('AUDI','A4',0,40000);
