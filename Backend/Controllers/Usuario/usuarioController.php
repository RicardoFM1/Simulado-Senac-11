<?php

use Respect\Validation\Exceptions\NestedValidationException;
use Respect\Validation\Validator as v;

require_once __DIR__ . "/../../Services/Usuario/usuarioService.php";
require_once __DIR__ . "/../../Middleware/middleware.php";

class UsuarioController
{
    protected $usuarioService;

    public function __construct()
    {
        $this->usuarioService = new UsuarioService();
    }

    public function validarDados($dados)
    {
        try {
            $cargosPermitidos = ['administrador', 'ceremonialista'];

            $esquema = v::key('nome', v::stringVal()->notEmpty()->length(1, 45))
                ->key('email', v::email())
                ->key('cpf', v::cpf())
                ->key('senha', v::stringVal()->notEmpty()->length(8, 255)->regex('/[A-Z]/')->regex('/[a-z]/')->regex('/[0-9]/')->regex('/[!@#$%¨&*()]/'))
                ->key('cargo', v::in($cargosPermitidos));

            $esquema->assert($dados);
        } catch (NestedValidationException $e) {
            $mensagemPersonalizada = [
                'nome' => 'Nome inválido, min 1, max 45',
                'email' => 'Email inválido',
                'cpf' => 'Cpf inválido',
                'senha' => 'Senha inválida, min 8, max 255',
                'cargo' => 'Cargo fora do escopo: administrador ou ceremonialista'
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

    public function validarDadosEdicao($dados, $temSenha)
    {
        try {
            $esquema = null;
            $cargosPermitidos = ['administrador', 'ceremonialista'];
            if ($temSenha) {

                $esquema = v::key('nome', v::stringVal()->notEmpty()->length(1, 45))
                    ->key('email', v::email())
                    ->key('cpf', v::cpf())
                    ->key('senha', v::stringVal()->length($temSenha ? 8 : 0, 255)->regex('/[A-Z]/')->regex('/[a-z]/')->regex('/[0-9]/')->regex('/[!@#$%¨&*()]/'))
                    ->key('cargo', v::in($cargosPermitidos));
            } else {
               
                $esquema = v::key('nome', v::stringVal()->notEmpty()->length(1, 45))
                    ->key('email', v::email())
                    ->key('cpf', v::cpf())
                    ->key('senha', v::optional(v::stringVal()->length(0, 255)), false)
                    ->key('cargo', v::in($cargosPermitidos));
            }

            $esquema->assert($dados);
        } catch (NestedValidationException $e) {
             if ($temSenha) {
                $mensagemPersonalizada = [
                    'nome' => 'Nome inválido, min 1, max 45',
                    'email' => 'Email inválido',
                    'cpf' => 'Cpf inválido',
                    'senha' => 'Senha inválida, min 8, max 255',
                    'cargo' => 'Cargo fora do escopo: administrador ou ceremonialista'
                ];
            } else {

                $mensagemPersonalizada = [
                    'nome' => 'Nome inválido, min 1, max 45',
                    'email' => 'Email inválido',
                    'cpf' => 'Cpf inválido',
                    'senha' => 'Senha inválida, max 255',
                    'cargo' => 'Cargo fora do escopo: administrador ou ceremonialista'
                ];
            }

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

    public function apenasAdmin()
    {
        $jwt = Middleware::validarMiddleware();

        if ($jwt->dados->cargo_usuario !== 'administrador') {
            http_response_code(403);
            echo json_encode([
                'sucesso' => false,
                'mensagem' => 'Usuário sem permissão'
            ]);
            exit;
        }
    }

    public function listarUsuarios()
    {
        $this->apenasAdmin();
        http_response_code(200);
        echo json_encode($this->usuarioService->listarUsuarios());
        exit;
    }

    public function criarUsuario()
    {
        try {

            $this->apenasAdmin();
            $dados = json_decode(file_get_contents('php://input'), true);

            $this->validarDados($dados);
            http_response_code(201);

            echo json_encode($this->usuarioService->criarUsuario($dados));
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

    public function fazerLogin()
    {
        try {
            $dados = json_decode(file_get_contents('php://input'), true);

            http_response_code(200);
            echo json_encode($this->usuarioService->fazerLogin($dados));
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

    public function atualizarUsuario()
    {
        try {
            $this->apenasAdmin();

            $dados = json_decode(file_get_contents('php://input'), true);
            $email = $_GET['email_usuario'];
            $temSenha = false;
            if(!empty($dados['senha'])){
                $temSenha = true;
            }
            $this->validarDadosEdicao($dados, $temSenha);
            http_response_code(200);
            echo json_encode($this->usuarioService->atualizarUsuario($dados, $email));
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

    public function deletarUsuario()
    {
        try {
            $this->apenasAdmin();

            $email = $_GET['email_usuario'];
            http_response_code(200);
            echo json_encode($this->usuarioService->deletarUsuario($email));
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
