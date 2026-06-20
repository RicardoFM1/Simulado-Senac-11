<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization, Content-Type');
header('Access-Control-Allow-Methods: OPTIONS, GET, POST, PUT, DELETE');

use Dotenv\Dotenv;

require_once __DIR__ . "/../vendor/autoload.php";
require_once __DIR__ . "/../Controllers/Usuario/usuarioController.php";
require_once __DIR__ . "/../Controllers/Mesa/mesaController.php";
require_once __DIR__ . "/../Controllers/Convidado/convidadoController.php";
require_once __DIR__ . "/../Controllers/Checkin/checkinController.php";
require_once __DIR__ . "/../Controllers/Dashboard/dashboardController.php";
require_once __DIR__ . "/../Middleware/middleware.php";




$dotenv = Dotenv::createImmutable(__DIR__ . "/../");
$dotenv->load();

$rota = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$metodo = $_SERVER['REQUEST_METHOD'];

if ($metodo === 'OPTIONS') {
    http_response_code(200);
    echo 'ok';
    exit;
}

if ($rota === '/usuario') {
    $controller = new UsuarioController();

    if ($metodo === 'GET') {
        $controller->listarUsuarios();
    }

    if ($metodo === 'POST') {
        $controller->criarUsuario();
    }

    if ($metodo === 'PUT') {
        $controller->atualizarUsuario();
    }

    if ($metodo === 'DELETE') {
        $controller->deletarUsuario();
    }
}

if ($rota === '/usuario/login') {
    $controller = new UsuarioController();



    if ($metodo === 'POST') {
        $controller->fazerLogin();
    }
}

if ($rota === '/mesa') {
    $controller = new MesaController();

    if ($metodo === 'GET') {
        $controller->listarMesas();
    }

    if ($metodo === 'POST') {
        $controller->criarMesa();
    }

    if ($metodo === 'PUT') {
        $controller->atualizarMesa();
    }

    if ($metodo === 'DELETE') {
        $controller->deletarMesa();
    }
}

if ($rota === '/convidado') {
    $controller = new ConvidadoController();

    if ($metodo === 'GET') {
        $controller->listarConvidados();
    }

    if ($metodo === 'POST') {
        $controller->criarConvidado();
    }

    if ($metodo === 'PUT') {
        $controller->atualizarConvidado();
    }

    if ($metodo === 'DELETE') {
        $controller->deletarConvidado();
    }
}

if ($rota === '/checkin') {
    $controller = new CheckinController();

    if ($metodo === 'GET') {
        $controller->listarCheckins();
    }

    if ($metodo === 'POST') {
        $controller->confirmarCheckin();
    }
}

if ($rota === '/checkin/cancelar') {
    $controller = new CheckinController();

    if ($metodo === 'PUT') {
        $controller->cancelarCheckin();
    }
}

if ($rota === '/retrieve') {
    if ($metodo === 'GET') {
        http_response_code(200);
        echo json_encode(Middleware::validarMiddleware());
        exit;
    }
}

if ($rota === '/dashboard') {
    $controller = new DashboardController();
    if ($metodo === 'GET') {
        http_response_code(200);
        echo json_encode($controller->listarDashboard());
        exit;
    }
}


http_response_code(404);
echo json_encode([
    'sucesso' => false,
    'mensagem' => 'Rota não encontrada'
]);
exit;
