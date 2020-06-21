<?php
include("Conexao.php");

class ClassInsere extends ClassConexao{
    
    public function insereVisualization($dados_repetidos,$versao,$iteracao,$id_identificacao){

        $insercao = "INSERT INTO visualizacao (AQNS,Modelo,Atributo,Poco,Versao,Iteracao,id_identificacao) 
                            VALUES (:aqns,:modelo,:atributo,:poco,:versao,:iteracao,:id)";
        $crud=$this->conectaDB()->prepare($insercao);
        $contador = 0;

        foreach($dados_repetidos as $i => $dados){
            list($aqns,$modelo,$atributo,$poco,$primeiraLinha) = $dados;
            $crud->bindValue(':aqns',$aqns);
            $crud->bindValue(':modelo',$modelo);
            $crud->bindValue(':atributo',$atributo);
            $crud->bindValue(':poco',$poco);
            $crud->bindValue(':versao',$versao);
            $crud->bindValue(':iteracao',$iteracao);
            $crud->bindValue(':id',$id_identificacao);
            if($crud->execute()){
                $contador += $f=$crud->rowCount();
            }else{
                $erro = $crud->errorInfo();
            }
        }
        return $contador; 
    }

    public function insereVersion($versao,$data,$iteracao){
        $insertSQL = "INSERT INTO identificacao (Versao,Data,Iteracao) 
                        VALUES (:versao,:data,:iteracao)";
        $crud=$this->conectaDB();
        $insercao=$crud->prepare($insertSQL);
        $insercao->bindValue(':versao',$versao);
        $insercao->bindValue(':data',$data);
        $insercao->bindValue(':iteracao',$iteracao);
        //Validar o cadastro de Versão
        $validar=$crud->prepare("SELECT ID,Versao,Data,Iteracao FROM identificacao WHERE Versao LIKE :versao AND Data LIKE :data AND Iteracao=:iteracao");
        $buscarVersao = $versao."%";
        $buscarData = $data."%";
        $validar->bindValue(':versao',$buscarVersao);
        $validar->bindValue(':data',$buscarData);
        $validar->bindValue(':iteracao',$iteracao);
        $validar->execute();
        if($validar->rowCount() == 0){
            //Executar o cadastro e retornar o código inserido
            $insercao->execute();
            $consultarCodigo = $crud->prepare("SELECT ID FROM identificacao WHERE Versao LIKE :versao AND Data LIKE :data AND Iteracao=:iteracao");
            $consultarCodigo->bindValue(':versao',$buscarVersao);
            $consultarCodigo->bindValue(':data',$buscarData);
            $consultarCodigo->bindValue(':iteracao',$iteracao);
            $consultarCodigo->execute();
            $codigoInserido = $consultarCodigo->fetch();
            return $codigoInserido['ID'];
        }else{
            return "Erro";
        }

        $crud->execute();
        return $f=$crud->rowCount();
    }
}
?>