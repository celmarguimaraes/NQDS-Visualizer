<?php

    require __DIR__ . '/../classe/Insercao.php';


    $json = file_get_contents('php://input');
    $data = json_decode($json,true);
    $iteracao = intval($data['iteracao']);
    $pesquisa = new ClassInsere();


    if ($data['insere']=='visualization') {
        $retorno = $pesquisa->insereVisualization($data['aqns'],$data['modelo'],$data['atributo'],$data['poco'],$data['versao'],$iteracao);
    }elseif ($data['insere']=='version') {
        $retorno = $pesquisa->insereVersion($data['versao'],$data['data'],$iteracao);
    }

    //Envio de dados
    header('Content-Type: application/json');
    //exit($data['versao']);
    echo json_encode($retorno);    
?>