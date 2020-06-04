<?php
include("Conexao.php");

class ClassInsere extends ClassConexao{
    
    public function insereVisualization($aqns,$modelo,$atributo,$poco,$versao,$iteracao){
        $insercao = "INSERT INTO visualization (AQNS,Modelo,Atributo,Poco,Versao,Iteracao) 
                        VALUES ($aqns,$modelo,$atributo,$poco,$versao,$iteracao)";
        $crud=$this->conectaDB()->prepare($insercao);
        $crud->execute();
        return $f=$crud->rowCount();
    }

    public function insereVersion($versao,$data,$iteracao){
        $insercao = "INSERT INTO version (Versao,Data,Iteracao) 
                        VALUES ($versao,$data,$iteracao)";
        $crud=$this->conectaDB()->prepare($insercao);
        $crud->execute();
        return $f=$crud->rowCount();
    }
}
?>