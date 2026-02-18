CREATE DATABASE pengelolaan_basis_data;
USE pengelolaan_basis_data;

CREATE TABLE pelanggan(
    PelangganID INT(11) PRIMARY KEY,
    NamaPelanggan VARCHAR(255),
    Alamat TEXT,
    NomorTelepon VARCHAR(15)
)

CREATE TABLE penjualan(
    PenjualanID INT(11) PRIMARY KEY,
    TanggalPenjualan DATE,
    PelangganID INT(11),
    TotalHarga DECIMAL(10, 2),
    FOREIGN KEY (PelangganID) REFERENCES pelanggan(PelangganID)
)

CREATE TABLE detailpenjualan(
    DetailID INT(11) PRIMARY KEY,
    PenjualanID INT(11),
    ProdukID INT(11),
    JumlahProduk INT(11),
    Subtotal DECIMAL(10, 2),
    FOREIGN KEY (PenjualanID) REFERENCES penjualan(PenjualanID),
    FOREIGN KEY (ProdukID) REFERENCES produk(ProdukID)
)


CREATE TABLE produk(
    ProdukID INT(11) PRIMARY KEY,
    NamaProduk VARCHAR(255),
    Harga DECIMAL(10, 2),
    Stok INT(11)
);

INSERT INTO pelanggan (PelangganID, NamaPelanggan, Alamat, NomorTelepon) VALUES
(1, 'Budi Santoso', 'Jl. Merdeka No. 123, Jakarta Pusat', '081234567890'),
(2, 'Siti Rahayu', 'Jl. Sudirman No. 45, Bandung', '082345678901'),
(3, 'Ahmad Hidayat', 'Jl. Pahlawan No. 67, Surabaya', '083456789012'),
(4, 'Dewi Lestari', 'Jl. Gatot Subroto No. 89, Semarang', '084567890123'),
(5, 'Eko Prasetyo', 'Jl. Diponegoro No. 12, Yogyakarta', '085678901234'),
(6, 'Fitri Handayani', 'Jl. Ahmad Yani No. 34, Malang', '086789012345'),
(7, 'Gilang Ramadhan', 'Jl. Imam Bonjol No. 56, Medan', '087890123456'),
(8, 'Hana Pertiwi', 'Jl. Hasanuddin No. 78, Makassar', '088901234567'),
(9, 'Irfan Hakim', 'Jl. Kartini No. 90, Denpasar', '089012345678'),
(10, 'Julia Putri', 'Jl. Veteran No. 21, Palembang', '081123456789');

INSERT INTO produk (ProdukID, NamaProduk, Harga, Stok) VALUES
(1, 'Laptop ASUS ROG', 15000000.00, 25),
(2, 'Mouse Logitech G502', 850000.00, 100),
(3, 'Keyboard Mechanical RGB', 1200000.00, 75),
(4, 'Monitor LG 27 inch', 3500000.00, 40),
(5, 'Headset HyperX Cloud', 1500000.00, 60),
(6, 'Webcam Logitech C920', 1100000.00, 50),
(7, 'SSD Samsung 1TB', 1800000.00, 80),
(8, 'RAM DDR4 16GB', 950000.00, 90),
(9, 'Power Supply 650W', 1250000.00, 35),
(10, 'Casing PC RGB', 750000.00, 45),
(11, 'Mousepad Gaming XL', 250000.00, 150),
(12, 'USB Hub 4 Port', 150000.00, 200);

INSERT INTO penjualan (PenjualanID, TanggalPenjualan, PelangganID, TotalHarga) VALUES
(1, '2026-01-02', 1, 16050000.00),
(2, '2026-01-03', 2, 4750000.00),
(3, '2026-01-05', 3, 15850000.00),
(4, '2026-01-07', 4, 2650000.00),
(5, '2026-01-08', 5, 3700000.00),
(6, '2026-01-09', 1, 1100000.00),
(7, '2026-01-10', 6, 18500000.00),
(8, '2026-01-11', 7, 5200000.00),
(9, '2026-01-12', 8, 2400000.00),
(10, '2026-01-13', 9, 950000.00),
(11, '2026-01-14', 10, 15250000.00),
(12, '2026-01-14', 2, 1000000.00);

INSERT INTO detailpenjualan (DetailID, PenjualanID, ProdukID, JumlahProduk, Subtotal) VALUES
(1, 1, 1, 1, 15000000.00),
(2, 1, 2, 1, 850000.00),
(3, 1, 11, 1, 250000.00),
(4, 2, 3, 1, 1200000.00),
(5, 2, 4, 1, 3500000.00),
(6, 3, 1, 1, 15000000.00),
(7, 3, 2, 1, 850000.00),
(8, 4, 5, 1, 1500000.00),
(9, 4, 6, 1, 1100000.00),
(10, 5, 7, 2, 3600000.00),
(11, 6, 6, 1, 1100000.00),
(12, 7, 1, 1, 15000000.00),
(13, 7, 4, 1, 3500000.00),
(14, 8, 4, 1, 3500000.00),
(15, 8, 8, 2, 1900000.00),
(16, 9, 3, 2, 2400000.00),
(17, 10, 8, 1, 950000.00),
(18, 11, 1, 1, 15000000.00),
(19, 11, 11, 1, 250000.00),
(20, 12, 11, 4, 1000000.00);

INSERT INTO penjualan (PenjualanID, TanggalPenjualan, PelangganID, TotalHarga) VALUES
(13, '2026-01-15', 3, 2050000.00);

SELECT p.PelangganID, p.NamaPelanggan, p.Alamat, p.NomorTelepon
FROM pelanggan p
JOIN penjualan s ON p.PelangganID = s.PelangganID
WHERE s.TanggalPenjualan >= '2026-01-01';

SELECT ProdukID, NamaProduk, Stok
FROM produk;

CREATE TRIGGER update_stok
AFTER INSERT ON detailpenjualan
FOR EACH ROW
BEGIN
    UPDATE produk
    SET Stok = Stok - NEW.JumlahProduk
    WHERE ProdukID = NEW.ProdukID;
END;

CREATE FUNCTION hitung_total_harga(penjualan_id INT)
RETURNS DECIMAL(10, 2)
DETERMINISTIC
BEGIN
    DECLARE total DECIMAL(10, 2);
    SELECT SUM(Subtotal) INTO total
    FROM detailpenjualan
    WHERE PenjualanID = penjualan_id;
    RETURN total;
END;

CREATE PROCEDURE tambah_penjualan(
    IN p_PelangganID INT,
    IN p_TanggalPenjualan DATE,
    IN p_ProdukID INT,
    IN p_JumlahProduk INT
)
BEGIN
    DECLARE v_PenjualanID INT;
    DECLARE v_Subtotal DECIMAL(10, 2);
    
    SELECT Harga * p_JumlahProduk INTO v_Subtotal
    FROM produk
    WHERE ProdukID = p_ProdukID;
    
    INSERT INTO penjualan (TanggalPenjualan, PelangganID, TotalHarga)
    VALUES (p_TanggalPenjualan, p_PelangganID, v_Subtotal);
    
    SET v_PenjualanID = LAST_INSERT_ID();
    
    INSERT INTO detailpenjualan (PenjualanID, ProdukID, JumlahProduk, Subtotal)
    VALUES (v_PenjualanID, p_ProdukID, p_JumlahProduk, v_Subtotal);
END;