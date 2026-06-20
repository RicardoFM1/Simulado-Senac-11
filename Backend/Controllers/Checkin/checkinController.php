<?php

use Respect\Validation\Exceptions\NestedValidationException;
use Respect\Validation\Validator as v;

require_once __DIR__ . "/../../Services/Checkin/checkinService.php";
require_once __DIR__ . "/../../Middleware/middleware.php";

class CheckinController
{
    protected $checkinService;

    public function __construct()
    {
        $this->checkinService = new CheckinService();
    }





    public function listarCheckins()
    {
        Middleware::validarMiddleware();
        http_response_code(200);
        echo json_encode($this->checkinService->listarCheckins());
        exit;
    }

    public function confirmarCheckin()
    {
        try {

            $jwt = Middleware::validarMiddleware();

            $dados = json_decode(file_get_contents('php://input'), true);


            http_response_code(201);

            echo json_encode($this->checkinService->confirmarCheckin($dados, $jwt));
            exit;
        } catch (Exception $e) {
            http_response_code($e->getCode());
            echo json_encode([
                'sucesso' => false,
                'mensagem' => $e->getMessage()
            ]);
            exit;
        }
    }


    public function cancelarCheckin()
    {
        try {
            Middleware::validarMiddleware();

            $idCheckin = $_GET['id_checkin'];

            http_response_code(200);
            echo json_encode($this->checkinService->cancelarCheckin($idCheckin));
            exit;
        } catch (Exception $e) {
            http_response_code($e->getCode());
            echo json_encode([
                'sucesso' => false,
                'mensagem' => $e->getMessage()
            ]);
            exit;
        }
    }
}
