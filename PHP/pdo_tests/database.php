<?php

try{
    $conn = new PDO("mysql:host=localhost;dbname=userdb", "root","");
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    echo "Database has been connected successfully";
} catch(PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
}


try {
    $sql = "INSERT INTO users_data (name, email) VALUES (:name, :email)";
    $stmt = $conn->prepare($sql);
    $stmt->bindParam(":name", $name, PDO::PARAM_STR);
    $stmt->bindParam(":email", $email, PDO::PARAM_STR);

    $stmt->execute();
}
    

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Insert Data Aman</title>
    <style>
        body { font-family: sans-serif; margin: 50px; }
        .form-group { margin-bottom: 15px; }
        input { padding: 8px; width: 250px; }
        button { padding: 8px 15px; cursor: pointer; background: #28a745; color: white; border: none; }
    </style>
</head>
<body>

    <h2>Tambah User Baru</h2>
    
    <?php if($pesan): ?>
        <p style="color: green; font-weight: bold;"><?php echo $pesan; ?></p>
    <?php endif; ?>

    <form method="POST">
        <div class="form-group">
            <label>Nama Lengkap:</label><br>
            <input type="text" name="name" required>
        </div>
        <div class="form-group">
            <label>Email:</label><br>
            <input type="email" name="email" required>
        </div>
        <button type="submit">Simpan Data</button>
    </form>

</body>
</html>