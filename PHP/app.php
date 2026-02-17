<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Kalkulator Diskon</title>
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@1.0.4/css/bulma.min.css">
</head>
<body>
    <h2>Kalkulator Diskon</h2>
    
    <?php
    $harga = 0;
    $diskon = 0;
    $hargaSetelahDiskon = 0;
    $potongan = 0;

    if (isset($_POST['harga']) && isset($_POST['diskon'])) {
        $harga = floatval($_POST['harga']);
        $diskon = floatval($_POST['diskon']);
        $potongan = $harga * $diskon / 100;
        $hargaSetelahDiskon = $harga - $potongan;
    }
    ?>

    <form name="form" action="" method="post">
        <div class="form-group">
            <label for="harga">Harga Asli (Rp)</label>
            <input type="number" name="harga" id="harga" placeholder="Masukkan harga" value="<?php echo $harga > 0 ? $harga : ''; ?>" required>
        </div>
        <div class="form-group">
            <label for="diskon">Diskon (%)</label>
            <input type="number" step="0.01" name="diskon" id="diskon" placeholder="Masukkan diskon" min="0" max="100" value="<?php echo $diskon > 0 ? $diskon : ''; ?>" required>
        </div>
        <div id="control">
            <button type="submit" class="button is-primary">Hitung</button>
        </div>
    </form>

    <?php 
        if ($diskon == 100) {
            echo "<p style='color:red;'>Diskon 100% tidak diperbolehkan.</p>";
        }
    ?>

    <?php if ($harga > 0 && $diskon < 100): ?>
        <p>Harga Asli: Rp <?php echo number_format($harga, 0, ',', '.'); ?></p>
        <p>Diskon: <?php echo $diskon; ?>%</p>
        <p>Potongan: Rp <?php echo number_format($potongan, 0, ',', '.'); ?></p>
        <hr>
        <p class="final-price">Harga Setelah Diskon: Rp <?php echo number_format($hargaSetelahDiskon, 0, ',', '.'); ?></p>
    <?php endif; ?>

    <?php 
    
    ?>
    
</body>
</html>

