<?php
include("Conexao.php");

class ClassPesquisa extends ClassConexao{

    public function pesquisaVersoes()
    {
        $result = [];
        $crud=$this->conectaDB()->query("SELECT DISTINCT Iteracao,Versao FROM visualization;");
        while($linha = $crud->fetch(PDO::FETCH_ASSOC)){
            array_push($result,$linha);
        }
        return $result;
    }
    
    public function pesquisaPrimeiroModelosPocos($iteracao,$versao){
        $consulta = "SELECT Modelo,Poco, 
                        CASE
                            WHEN MAX(ABS(AQNS)) <= 1.0 THEN '1'
                            WHEN MAX(ABS(AQNS)) > 1.0 AND MAX(ABS(AQNS)) <= 2.0 THEN '2'
                            WHEN MAX(ABS(AQNS)) > 2.0 AND MAX(ABS(AQNS)) <= 5.0 THEN '3'
                            WHEN MAX(ABS(AQNS)) > 5.0 AND MAX(ABS(AQNS)) <= 10.0 THEN '4'
                            WHEN MAX(ABS(AQNS)) > 10.0 AND MAX(ABS(AQNS)) <= 20.0 THEN '5'
                            ELSE '6'
                        END AS ValorAQNS
                        FROM visualization
                        WHERE Iteracao = ".$iteracao."
                        AND   Versao = '".$versao."'
                        GROUP BY Modelo, Poco
                        ORDER BY Modelo";
        $crud=$this->conectaDB()->prepare($consulta);
        $crud->execute();
        return $f=$crud->fetchAll();
    }

    public function pesquisaPrimeiroModelosAtributos($iteracao,$versao){
        $consulta = "SELECT Modelo,Atributo, 
                        CASE
                            WHEN MAX(ABS(AQNS)) <= 1.0 THEN '1'
                            WHEN MAX(ABS(AQNS)) > 1.0 AND MAX(ABS(AQNS)) <= 2.0 THEN '2'
                            WHEN MAX(ABS(AQNS)) > 2.0 AND MAX(ABS(AQNS)) <= 5.0 THEN '3'
                            WHEN MAX(ABS(AQNS)) > 5.0 AND MAX(ABS(AQNS)) <= 10.0 THEN '4'
                            WHEN MAX(ABS(AQNS)) > 10.0 AND MAX(ABS(AQNS)) <= 20.0 THEN '5'
                            ELSE '6'
                        END AS ValorAQNS
                        FROM visualization
                        WHERE Iteracao = ".$iteracao."
                        AND   Versao = '".$versao."'
                        GROUP BY Modelo, Atributo
                        ORDER BY Modelo";
        $crud=$this->conectaDB()->prepare($consulta);
        $crud->execute();
        return $f=$crud->fetchAll();
    }

    public function pesquisaPrimeiroPocosAtributos($iteracao,$versao){
        $consulta = "SELECT Pocos,Atributo, 
                        CASE
                            WHEN MAX(ABS(AQNS)) <= 1.0 THEN '1'
                            WHEN MAX(ABS(AQNS)) > 1.0 AND MAX(ABS(AQNS)) <= 2.0 THEN '2'
                            WHEN MAX(ABS(AQNS)) > 2.0 AND MAX(ABS(AQNS)) <= 5.0 THEN '3'
                            WHEN MAX(ABS(AQNS)) > 5.0 AND MAX(ABS(AQNS)) <= 10.0 THEN '4'
                            WHEN MAX(ABS(AQNS)) > 10.0 AND MAX(ABS(AQNS)) <= 20.0 THEN '5'
                            ELSE '6'
                        END AS ValorAQNS
                        FROM visualization
                        WHERE Iteracao = ".$iteracao."
                        AND   Versao = '".$versao."'
                        GROUP BY Poco, Atributo
                        ORDER BY Modelo";
        $crud=$this->conectaDB()->prepare($consulta);
        $crud->execute();
        return $f=$crud->fetchAll();
    }

    public function pesquisaPocos($iteracao,$versao){
        $consulta = "SELECT DISTINCT Poco
                        FROM visualization
                        WHERE Iteracao = ".$iteracao."
                        AND   Versao = '".$versao."'
                        ORDER BY Poco";
        $crud=$this->conectaDB()->prepare($consulta);
        $crud->execute();
        return $f=$crud->fetchAll();
    }

    public function pesquisaAtributos($iteracao,$versao){
        $consulta = "SELECT DISTINCT Atributo, MAX(Modelo) AS Max_Modelo, MIN(Modelo) AS Min_Modelo
                        FROM visualization
                        WHERE Iteracao = ".$iteracao."
                        AND   Versao = '".$versao."'
                        GROUP BY Atributo";
        $crud=$this->conectaDB()->prepare($consulta);
        $crud->execute();
        return $f=$crud->fetchAll();
    }

    public function pesquisaModelosPocos($iteracao,$versao,$pocos,$atributos,$modelos){
        $consulta = "SELECT Modelo,Poco, 
                        CASE
                            WHEN MAX(ABS(AQNS)) <= 1.0 THEN '1'
                            WHEN MAX(ABS(AQNS)) > 1.0 AND MAX(ABS(AQNS)) <= 2.0 THEN '2'
                            WHEN MAX(ABS(AQNS)) > 2.0 AND MAX(ABS(AQNS)) <= 5.0 THEN '3'
                            WHEN MAX(ABS(AQNS)) > 5.0 AND MAX(ABS(AQNS)) <= 10.0 THEN '4'
                            WHEN MAX(ABS(AQNS)) > 10.0 AND MAX(ABS(AQNS)) <= 20.0 THEN '5'
                            ELSE '6'
                        END AS ValorAQNS
                        FROM visualization
                        WHERE Iteracao = ".$iteracao."
                        AND   Versao = '".$versao."'
                        AND   Poco IN (".$pocos.")
                        AND   Atributo IN (".$atributos.")
                        AND   Modelo IN (".$modelos.")
                        GROUP BY Modelo, Poco
                        ORDER BY Modelo";
            $crud=$this->conectaDB()->prepare($consulta);
            $crud->execute();
            return $f=$crud->fetchAll();
    }

    public function pesquisaModelosAtributos($iteracao,$versao,$pocos,$atributos,$modelos){
        $consulta = "SELECT Modelo,Atributo, 
                        CASE
                            WHEN MAX(ABS(AQNS)) <= 1.0 THEN '1'
                            WHEN MAX(ABS(AQNS)) > 1.0 AND MAX(ABS(AQNS)) <= 2.0 THEN '2'
                            WHEN MAX(ABS(AQNS)) > 2.0 AND MAX(ABS(AQNS)) <= 5.0 THEN '3'
                            WHEN MAX(ABS(AQNS)) > 5.0 AND MAX(ABS(AQNS)) <= 10.0 THEN '4'
                            WHEN MAX(ABS(AQNS)) > 10.0 AND MAX(ABS(AQNS)) <= 20.0 THEN '5'
                            ELSE '6'
                        END AS ValorAQNS
                        FROM visualization
                        WHERE Iteracao = ".$iteracao."
                        AND   Versao = '".$versao."'
                        AND   Poco IN (".$pocos.")
                        AND   Atributo IN (".$atributos.")
                        AND   Modelo IN (".$modelos.")
                        GROUP BY Modelo, Atributo
                        ORDER BY Modelo";
            $crud=$this->conectaDB()->prepare($consulta);
            $crud->execute();
            return $f=$crud->fetchAll();
    }

    public function pesquisaPocosAtributos($iteracao,$versao,$pocos,$atributos,$modelos){
        $consulta = "SELECT Poco,Atributo,
                        CASE
                            WHEN MAX(ABS(AQNS)) <= 1.0 THEN '1'
                            WHEN MAX(ABS(AQNS)) > 1.0 AND MAX(ABS(AQNS)) <= 2.0 THEN '2'
                            WHEN MAX(ABS(AQNS)) > 2.0 AND MAX(ABS(AQNS)) <= 5.0 THEN '3'
                            WHEN MAX(ABS(AQNS)) > 5.0 AND MAX(ABS(AQNS)) <= 10.0 THEN '4'
                            WHEN MAX(ABS(AQNS)) > 10.0 AND MAX(ABS(AQNS)) <= 20.0 THEN '5'
                            ELSE '6'
                        END AS ValorAQNS
                        FROM visualization
                        WHERE Iteracao = ".$iteracao."
                        AND   Versao = '".$versao."'
                        AND   Poco IN (".$pocos.")
                        AND   Atributo IN (".$atributos.")
                        AND   Modelo IN (".$modelos.")
                        GROUP BY Poco,Atributo
                        ORDER BY Poco";
            $crud=$this->conectaDB()->prepare($consulta);
            $crud->execute();
            return $f=$crud->fetchAll();
    }
}
?>