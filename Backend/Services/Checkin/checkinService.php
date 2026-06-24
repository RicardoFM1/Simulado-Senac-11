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
        $query = $this->db->prepare('SELECT c.id_checkin, c.data_e_hora,
        co.id_convidado, co.nome as nome_convidado, co.sobrenome as sobrenome_convidado, 
        co.cpf as cpf_convidado, co.confirmacao as confirmacao_convidado, u.nome as nome_usuario,
        u.cpf as cpf_usuario
         FROM convidado co INNER JOIN checkin c ON c.convidado_idconvidado = co.id_convidado INNER JOIN usuario u ON c.usuario_idusuario = u.id_usuario WHERE co.confirmacao IN ("pendente", "confirmado") ORDER BY co.id_convidado DESC');

        
        $query->execute();
        $resultado = [];

        while($row = $query->fetch()){
            $dataFormatada = null;

            if(!empty($row['data_e_hora'])){
                try{
                $data = new DateTime($row['data_e_hora']);
                $dataFormatada = $data->format('d-m-Y H:i:s');
                }catch(Exception $e){
                    $dataFormatada = $row['data_e_hora'];
                }
            }

            $resultado[] = [
                'id_checkin' => $row['id_checkin'],
                'id_convidado' => $row['id_convidado'],
                'data_e_hora' => $dataFormatada,
                'convidado' => [
                    'nome' => $row['nome_convidado'],
                    'sobrenome' => $row['sobrenome_convidado'],
                    'cpf' => $row['cpf_convidado'],
                    'confirmacao' => $row['confirmacao_convidado']
                ],
                'usuario' => [
                    'nome' => $row['nome_usuario'],
                    'cpf' => $row['cpf_usuario']
                ]
            ];


            return [
                'sucesso' => true,
                'dados' => $resultado
            ];
        }

    }

    public function confirmarCheckin($checkinDados, $jwt) {
        try{

        $dataFormatada = date('Y-m-d H:i:s');

        $buscarConvidado = $this->db->prepare('SELECT * FROM convidado WHERE id_convidado = :id_convidado');

        $buscarConvidado->execute([
            ':id_convidado' => $checkinDados['convidado_idconvidado']
        ]);

        $convidado = $buscarConvidado->fetch();

        if(empty($convidado)){
            throw new Exception('Convidado não encontrado', 404);
        }

        $mesaReferenciada = new MesaService()->buscarMesaPorReferenciaConvidado($convidado['mesa_idmesa']);

        if($mesaReferenciada['sucesso'] !== true){
        throw new Exception('Mesa do convidado não encontrada', 404);
        }

        if($mesaReferenciada['dados']['quantidade_convidados'] >= $mesaReferenciada['dados']['capacidade']){
            throw new Exception('Mesa lotada', 409);
        }

        $confirmar = $this->db->prepare('INSERT INTO checkin (convidado_idconvidado, usuario_idusuario, data_e_hora)
        VALUES(:convidado_idconvidado, :usuario_idusuario, :data_e_hora)');

        $confirmar->execute([
            ':usuario_idusuario' => $jwt->dados->id_usuario,
            ':convidado_idconvidado' => $checkinDados['convidado_idconvidado'],
            ':data_e_hora' => $dataFormatada
        ]);

        $atualizarConfirmacao = $this->db->prepare('UPDATE convidado SET confirmacao = "confirmado" WHERE id_convidado = :id_convidado');

        $atualizarConfirmacao->execute([
            ':id_convidado' => $checkinDados['convidado_idconvidado']
        ]);

        return [
            'sucesso' => true,
            'mensagem' => 'Checkin confirmado com sucesso'
        ];

        

        }catch(PDOException $e){
            if(str_contains($e->getMessage(), '1452')){
                throw new Exception('Usuário e/ou convidado referenciado não encontrado', 404);
            }

            if(str_contains($e->getMessage(), '1062')){
                throw new Exception('Checkin já realizado', 409);
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


            $cancelar = $this->db->prepare('UPDATE convidado SET confirmacao = "pendente" WHERE id_checkin = :id_checkin');

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

    // reverter checkin é update 
}
