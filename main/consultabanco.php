<?php

    require __DIR__ . '/../classe/Pesquisa.php';


    $json = file_get_contents('php://input');
    $data = json_decode($json,true);
    $iteracao = intval($data['iteracao']);
    $pesquisa = new ClassPesquisa();


    if ($data['consulta']=='pocos') {
        $retorno = $pesquisa->pesquisaPocos($iteracao,$data['versao']);
    }elseif ($data['consulta']=='atributos') {
        $retorno = $pesquisa->pesquisaAtributos($iteracao,$data['versao']);
    }elseif ($data['consulta']=='MW'){
        $retorno = $pesquisa->pesquisaModelosPocos($iteracao,$data['versao'],$data['pocos'],$data['atributos'],$data['modelos']);
    }elseif ($data['consulta']=='MA'){
        $retorno = $pesquisa->pesquisaModelosAtributos($iteracao,$data['versao'],$data['pocos'],$data['atributos'],$data['modelos']);
    }elseif ($data['consulta']=='WA'){
        $retorno = $pesquisa->pesquisaPocosAtributos($iteracao,$data['versao'],$data['pocos'],$data['atributos'],$data['modelos']);
    }

    //Envio de dados
    header('Content-Type: application/json');
    //exit($data['versao']);
    echo json_encode($retorno);    
?>