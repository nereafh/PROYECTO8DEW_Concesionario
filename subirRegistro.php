<?php
header("Content-Type: application/json; charset=UTF-8");
require_once('db.php');

$raw = file_get_contents("php://input");
$data = json_decode($raw, true);

if (!$data) {
    echo json_encode(["status"=>"error","message"=>"JSON no válido o vacío."]);
    exit;
}

$required = ["nombre","dni","correo","telefono","password"];
foreach ($required as $f) {
    if (empty($data[$f])) {
        echo json_encode(["status"=>"error","message"=>"Campo faltante: {$f}"]);
        exit;
    }
}

$nombre = $data["nombre"];
$dni = $data["dni"];
$correo = $data["correo"];
$telefono = $data["telefono"];
$password = password_hash($data["password"], PASSWORD_BCRYPT);

// comprobar si ya existe
$stmt = $pdo->prepare("SELECT id FROM usuarios WHERE correo_electronico = :correo OR dni = :dni LIMIT 1");
$stmt->execute([":correo"=>$correo, ":dni"=>$dni]);
if ($stmt->fetch()) {
    echo json_encode(["status"=>"error","message"=>"Correo o DNI ya registrado."]);
    exit;
}

// insertar
$stmt = $pdo->prepare("INSERT INTO usuarios (nombre, dni, correo_electronico, telefono, contrasena) VALUES (:nombre, :dni, :correo, :telefono, :contrasena)");
try {
    $stmt->execute([
        ":nombre"=>$nombre,
        ":dni"=>$dni,
        ":correo"=>$correo,
        ":telefono"=>$telefono,
        ":contrasena"=>$password
    ]);
    echo json_encode(["status"=>"success","message"=>"Usuario registrado correctamente."]);
} catch (Exception $e) {
    echo json_encode(["status"=>"error","message"=>"Error al insertar: ".$e->getMessage()]);
}
