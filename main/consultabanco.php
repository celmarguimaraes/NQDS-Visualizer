<?php

    require __DIR__ . '/../classe/Pesquisa.php';


    $json = file_get_contents('php://input');
    $data = json_decode($json,true);
    $iteracao = intval($data['iteracao']);
    $dataGrafico = implode('-', array_reverse(explode('/', substr($data['data'],0,10))));
    $dateTimeGrafico = $dataGrafico.substr($data['data'],-6);
    $pesquisa = new ClassPesquisa();

    //Validar se a versão do gráfico existe, caso sim retorna o código identificador
    $erro = $pesquisa->pesquisaIdentificacao($iteracao,$data['versao'],$dateTimeGrafico);

    if($erro == "Erro"){

    }else{
        if ($data['consulta']=='pocos') {
            $retorno = $pesquisa->pesquisaPocos($erro);
        }elseif ($data['consulta']=='atributos') {
            $retorno = $pesquisa->pesquisaAtributos($erro);
        }elseif ($data['consulta']=='MW'){
            $retorno = $pesquisa->pesquisaModelosPocos($erro,$data['pocos'],$data['atributos'],$data['modelos']);
        }elseif ($data['consulta']=='MA'){
            $retorno = $pesquisa->pesquisaModelosAtributos($erro,$data['pocos'],$data['atributos'],$data['modelos']);
        }elseif ($data['consulta']=='WA'){
            $retorno = $pesquisa->pesquisaPocosAtributos($erro,$data['pocos'],$data['atributos'],$data['modelos']);
        }
    }

    //Envio de dados
    header('Content-Type: application/json');
    //exit($data['versao']);
    echo json_encode($retorno);    
?>