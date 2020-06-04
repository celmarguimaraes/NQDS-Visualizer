<?php
abstract class ClassConexao{

    protected function conectaDB()
    {
        try{
            $con=new PDO("mysql:host=localhost;dbname=heatmap_web","root","");
            return $con;
        }catch (PDOException $erro){
            return $erro->getMessage();
        }
    }
}
?>