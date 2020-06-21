<?php

    require __DIR__ . '/../classe/Insercao.php';

    ini_set('max_execution_time',120);
    $json = file_get_contents('php://input');
    $data = json_decode($json,true);
    $iteracao = intval($data['iteracao']);
    $dataGrafico = implode('-', array_reverse(explode('/', substr($data['data'],0,10))));
    $dateTimeGrafico = $dataGrafico.' '.substr($data['data'],-6,5);
    $pesquisa = new ClassInsere();

    $dados_repetidos = array_map(null,$data['aqns'],$data['modelo'],$data['atributo'],$data['poco'],$data['primeiraLinha']);
    $contadorVisualizacao = 0;

    //Retorna false caso dê erro, ou retorna o Código da versão inserida
    $erro = $pesquisa->insereVersion($data['versao'],$dateTimeGrafico,$iteracao);
    
    $retorno = array();

    if ($erro == "Erro"){
        $retorno = array(
            'contador' => 0,
            'retorno' => 'Versão já foi cadastrada !'
            );
    }else{
        $contadorVisualizacao = $pesquisa->insereVisualization($dados_repetidos,$data['versao'],$iteracao,$erro);
        $retorno = array(
            'contador' => $contadorVisualizacao,
            'retorno' => 'Inserção de dados realizada com sucesso !'
        );
    }

    //Envio de dados
    header('Content-Type: application/json');
    //exit($data['versao']);
    echo json_encode($retorno);   
?>