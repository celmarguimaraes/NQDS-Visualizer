<?php
include("Conexao.php");

class ClassPesquisa extends ClassConexao{

    public function pesquisaVersoes()
    {
        $result = [];
        $crud=$this->conectaDB()->query("SELECT DISTINCT Iteracao,Versao,Data FROM identificacao;");
        while($linha = $crud->fetch(PDO::FETCH_ASSOC)){
            array_push($result,$linha);
        }
        return $result;
    }

    public function pesquisaPocos($idIdentificador){
        $consulta = "SELECT DISTINCT Poco
                        FROM dados_aqns
                        WHERE id_identificacao = ".$idIdentificador."
                        ORDER BY Poco";
        $crud=$this->conectaDB()->prepare($consulta);
        $crud->execute();
        return $f=$crud->fetchAll();
    }

    public function pesquisaAtributos($idIdentificador){
        $consulta = "SELECT DISTINCT Atributo, MAX(Modelo) AS Max_Modelo, MIN(Modelo) AS Min_Modelo
                        FROM dados_aqns
                        WHERE id_identificacao = ".$idIdentificador."
                        GROUP BY Atributo";
        $crud=$this->conectaDB()->prepare($consulta);
        $crud->execute();
        return $f=$crud->fetchAll();
    }

    public function pesquisaModelosPocos($idIdentificador,$pocos,$atributos,$modelos){
        $consulta = "SELECT Modelo,Poco, 
                        CASE
                            WHEN MAX(ABS(AQNS)) <= 1.0 THEN '1'
                            WHEN MAX(ABS(AQNS)) > 1.0 AND MAX(ABS(AQNS)) <= 2.0 THEN '2'
                            WHEN MAX(ABS(AQNS)) > 2.0 AND MAX(ABS(AQNS)) <= 5.0 THEN '3'
                            WHEN MAX(ABS(AQNS)) > 5.0 AND MAX(ABS(AQNS)) <= 10.0 THEN '4'
                            WHEN MAX(ABS(AQNS)) > 10.0 AND MAX(ABS(AQNS)) <= 20.0 THEN '5'
                            ELSE '6'
                        END AS ValorAQNS
                        FROM dados_aqns
                        WHERE id_identificacao = ".$idIdentificador."
                        AND   Poco IN (".$pocos.")
                        AND   Atributo IN (".$atributos.")
                        AND   Modelo IN (".$modelos.")
                        GROUP BY Modelo, Poco
                        ORDER BY Modelo";
            $crud=$this->conectaDB()->prepare($consulta);
            $crud->execute();
            return $f=$crud->fetchAll();
    }

    public function pesquisaModelosAtributos($idIdentificador,$pocos,$atributos,$modelos){
        $consulta = "SELECT Modelo,Atributo, 
                        CASE
                            WHEN MAX(ABS(AQNS)) <= 1.0 THEN '1'
                            WHEN MAX(ABS(AQNS)) > 1.0 AND MAX(ABS(AQNS)) <= 2.0 THEN '2'
                            WHEN MAX(ABS(AQNS)) > 2.0 AND MAX(ABS(AQNS)) <= 5.0 THEN '3'
                            WHEN MAX(ABS(AQNS)) > 5.0 AND MAX(ABS(AQNS)) <= 10.0 THEN '4'
                            WHEN MAX(ABS(AQNS)) > 10.0 AND MAX(ABS(AQNS)) <= 20.0 THEN '5'
                            ELSE '6'
                        END AS ValorAQNS
                        FROM dados_aqns
                        WHERE id_identificacao = ".$idIdentificador."
                        AND   Poco IN (".$pocos.")
                        AND   Atributo IN (".$atributos.")
                        AND   Modelo IN (".$modelos.")
                        GROUP BY Modelo, Atributo
                        ORDER BY Modelo";
            $crud=$this->conectaDB()->prepare($consulta);
            $crud->execute();
            return $f=$crud->fetchAll();
    }

    public function pesquisaPocosAtributos($idIdentificador,$pocos,$atributos,$modelos){
        $consulta = "SELECT Poco,Atributo,
                        CASE
                            WHEN MAX(ABS(AQNS)) <= 1.0 THEN '1'
                            WHEN MAX(ABS(AQNS)) > 1.0 AND MAX(ABS(AQNS)) <= 2.0 THEN '2'
                            WHEN MAX(ABS(AQNS)) > 2.0 AND MAX(ABS(AQNS)) <= 5.0 THEN '3'
                            WHEN MAX(ABS(AQNS)) > 5.0 AND MAX(ABS(AQNS)) <= 10.0 THEN '4'
                            WHEN MAX(ABS(AQNS)) > 10.0 AND MAX(ABS(AQNS)) <= 20.0 THEN '5'
                            ELSE '6'
                        END AS ValorAQNS
                        FROM dados_aqns
                        WHERE id_identificacao = ".$idIdentificador."
                        AND   Poco IN (".$pocos.")
                        AND   Atributo IN (".$atributos.")
                        AND   Modelo IN (".$modelos.")
                        GROUP BY Poco,Atributo
                        ORDER BY Poco";
            $crud=$this->conectaDB()->prepare($consulta);
            $crud->execute();
            return $f=$crud->fetchAll();
    }

    public function pesquisaIdentificacao($iteracao,$versao,$data){
        $crud=$this->conectaDB();
        $validar=$crud->prepare("SELECT ID,Versao,Data,Iteracao FROM identificacao WHERE Versao LIKE :versao AND Data LIKE :data AND Iteracao=:iteracao");
        $buscarVersao = $versao."%";
        $buscarData = $data."%";
        $validar->bindValue(':versao',$buscarVersao);
        $validar->bindValue(':data',$buscarData);
        $validar->bindValue(':iteracao',$iteracao);
        $validar->execute();
        if($validar->rowCount() == 0){
            return "Erro";
        }else{
            $codigoIdentificador = $validar->fetch();
            return $codigoIdentificador['ID'];
        }
    }
}
?>