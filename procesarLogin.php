<?php
session_start();
require_once('db.php');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo "Método no permitido";
    exit;
}

$email = isset($_POST['correo_electronico']) ? trim($_POST['correo_electronico']) : '';
$pass = isset($_POST['contrasena']) ? $_POST['contrasena'] : '';

if (empty($email) || empty($pass)) {
    echo "Faltan campos";
    exit;
}

$stmt = $pdo->prepare("SELECT id, nombre, contrasena FROM usuarios WHERE correo_electronico = :email LIMIT 1");
$stmt->execute([":email"=>$email]);
$user = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$user) {
    echo "Usuario no encontrado";
    exit;
}

if (password_verify($pass, $user['contrasena'])) {
    $_SESSION['user_id'] = $user['id'];
    $_SESSION['user_name'] = $user['nombre'];
    echo "Bienvenido, " . $user['nombre'];
} else {
    echo "Correo electrónico o contraseña incorrectos";
}
