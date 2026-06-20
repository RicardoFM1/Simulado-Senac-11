<?php



require_once __DIR__ . "/../../Connection/db.php";


class CheckinService
{
    protected $db;

    public function __construct()
    {
        $this->db = db();
    }

    public function buscarCheckinPorId($idCheckin)
    {

        if (empty($idCheckin)) {
            throw new Exception('Dados inválidos', 400);
        }

        $buscar = $this->db->prepare('SELECT * FROM checkin WHERE id_checkin = :id_checkin');

        $buscar->execute([
            ':id_checkin' => $idCheckin
        ]);

        $checkin = $buscar->fetch();

        if (empty($checkin)) {
            return [
                'sucesso' => false,
                'mensagem' => 'Checkin não realizado e/ou checkin não encontrado',
                'codigo' => '404'
            ];
        }

        return [
            'sucesso' => true,
            'dados' => $checkin
        ];
    }

    public function listarCheckins()
    {
        $query = $this->db->query('SELECT c.id_checkin, c.data_e_hora, c.status, co.id_convidado, 
        co.nome as nome_convidado, co.sobrenome as sobrenome_convidado, co.cpf as cpf_convidado,
        co.confirmacao as confirmacao_convidado, u.nome as nome_usuario, u.cpf as cpf_usuario
        FROM convidado co LEFT JOIN checkin c ON c.convidado_idconvidado = co.id_convidado
        LEFT JOIN usuario u ON c.usuario_idusuario = u.id_usuario WHERE co.confirmacao IN ("pendente", "confirmado") ORDER BY co.id_convidado DESC ');

        $query->execute();
        $resultado = [];

        while ($row = $query->fetch()) {
            $dataFormatada = null;

            if (!empty($row['data_e_hora'])) {
                try {
                    $data = new DateTime($row['data_e_hora']);
                    $dataFormatada = $data->format('d-m-Y H:i:s');
                } catch (Exception $e) {
                    $dataFormatada = $row['data_e_hora'];
                }
            }

            $resultado[] = [
                'id_convidado' => $row['id_convidado'],
                'id_checkin' => $row['id_checkin'],
                'data_e_hora' => $dataFormatada,
                'status' => $row['status'],
                'usuario' => [
                    'nome' => $row['nome_usuario'],
                    'cpf' => $row['cpf_usuario']
                ],
                'convidado' => [
                    'nome' => $row['nome_convidado'],
                    'sobrenome' => $row['sobrenome_convidado'],
                    'cpf' => $row['cpf_convidado'],
                    'confirmacao' => $row['confirmacao_convidado']
                ]
            ];
        }
        return [
            'sucesso' => true,
            'dados' => $resultado
        ];
    }


    public function confirmarCheckin($checkinDados, $jwt)
    {
        try {

            $dataFormatada = date('Y-m-d H:i:s');

            $criar = $this->db->prepare('INSERT INTO checkin (usuario_idusuario, convidado_idconvidado, data_e_hora, status)
            VALUES (:usuario_idusuario, :convidado_idconvidado, :data_e_hora, :status)');

            $criar->execute([
                ':usuario_idusuario' => $jwt->dados->id_usuario,
                ':convidado_idconvidado' => $checkinDados['convidado_idconvidado'],
                ':data_e_hora' => $dataFormatada,
                ':status' => 'realizado'
            ]);

            $atualizarConvidado = $this->db->prepare('UPDATE convidado SET confirmacao = :confirmacao WHERE id_convidado = :id_convidado');

            $atualizarConvidado->execute([
                ':confirmacao' => 'confirmado',
                ':id_convidado' => $checkinDados['convidado_idconvidado']
            ]);

            return [
                'sucesso' => true,
                'mensagem' => 'Checkin criado com sucesso'
            ];
        } catch (PDOException $e) {
            if (str_contains($e->getMessage(), '1452')) {
                throw new Exception('Usuário referenciado não encontrado', 404);
            }

            if (str_contains($e->getMessage(), '1062')) {
                throw new Exception('Checkin já realizado', 409);
            }

            if (str_contains($e->getMessage(), 'fk_checkin_convidado')) {
                throw new Exception('Convidado referenciado não encontrado', 404);
            }
            throw new Exception('Erro ao tentar confirmar checkin', 500);
        }
    }



    public function cancelarCheckin($idCheckin)
    {
        try {


            $checkin = $this->buscarCheckinPorId($idCheckin);

            if ($checkin['sucesso'] === false) {
                throw new Exception($checkin['mensagem'], $checkin['codigo']);
            }


            $cancelar = $this->db->prepare('DELETE FROM checkin WHERE id_checkin = :id_checkin');

            $cancelar->execute([
                ':id_checkin' => $idCheckin

            ]);

            return [
                'sucesso' => true,
                'mensagem' => 'Checkin cancelado com sucesso'
            ];
        } catch (PDOException $e) {



            throw new Exception('Erro ao tentar cancelar checkin', 500);
        }
    }
}
