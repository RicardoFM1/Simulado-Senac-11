<?php

use Respect\Validation\Exceptions\NestedValidationException;
use Respect\Validation\Validator as v;

require_once __DIR__ . "/../../Services/Convidado/convidadoService.php";
require_once __DIR__ . "/../../Middleware/middleware.php";

class ConvidadoController
{
    protected $convidadoService;

    public function __construct()
    {
        $this->convidadoService = new ConvidadoService();
    }

    public function validarDados($dados)
    {
        try {
            $categoriasPermitidas = ['noivos', 'familia', 'amigos', 'equipe'];

            $esquema = v::key('nome', v::stringVal()->notEmpty()->length(1, 45))
                ->key('sobrenome', v::stringVal()->notEmpty()->length(1, 45))
                ->key('email', v::email())
                ->key('cpf', v::cpf())
                ->key('telefone', v::phone())
                ->key('categoria', v::in($categoriasPermitidas))
                ->key('mesa_idmesa', v::intVal()->notEmpty());

            $esquema->assert($dados);
        } catch (NestedValidationException $e) {
            $mensagemPersonalizada = [
                'nome' => 'Nome inválido, min 1, max 45',
                'sobrenome' => 'Sobrenome inválido, min 1, max 45',
                'email' => 'Email inválido',
                'cpf' => 'Cpf inválido',
                'telefone' => 'Telefone inválido',
                'categoria' => 'Categoria fora do escopo: noivos, familia, amigos ou equipe',
                'mesa_idmesa' => 'Referência de mesa inválida'
            ];

            $mensagemOriginal = $e->getMessages();
            $mensagemTraduzida = [];

            foreach ($mensagemOriginal as $campo => $mensagem) {
                $mensagemTraduzida[$campo] = $mensagemPersonalizada[$campo] ?? $mensagem;
            }

            http_response_code(400);
            echo json_encode([
                'sucesso' => false,
                'mensagem' => 'Erro de validação',
                'erros' => $mensagemTraduzida
            ]);
            exit;
        }
    }



    public function listarConvidados()
    {
        Middleware::validarMiddleware();
        http_response_code(200);
        echo json_encode($this->convidadoService->listarConvidados());
        exit;
    }

    public function criarConvidado()
    {
        try {

            Middleware::validarMiddleware();

            $dados = json_decode(file_get_contents('php://input'), true);

            $this->validarDados($dados);
            http_response_code(201);

            echo json_encode($this->convidadoService->criarConvidado($dados));
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


    public function atualizarConvidado()
    {
        try {
            $jwt = Middleware::validarMiddleware();

            $dados = json_decode(file_get_contents('php://input'), true);
            $email = $_GET['email_convidado'];
            $this->validarDados($dados);
            http_response_code(200);
            echo json_encode($this->convidadoService->atualizarConvidado($dados, $email, $jwt));
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

    public function deletarConvidado()
    {
        try {
            Middleware::validarMiddleware();


            $email = $_GET['email_convidado'];
            http_response_code(200);
            echo json_encode($this->convidadoService->deletarConvidado($email));
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
