<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">
	<meta http-equiv="X-UA-Compatible" content="ie=edge" />

    <title>Heatmap AQNS</title>

    <!-- Principal CSS do Bootstrap -->
    <link href="css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="css/main.css">
    <?php include 'main/modal.php'?>
    <?php include 'main/modalAguarde.php'?>
    
    <script>
      let primeiroGrafico = true;
      let tipoGrafico;
      let versaoGraf,iteracaoGraf, dataGraf;
    </script>
  </head>

  <body>
  
    <header class="navbar border-bottom mt-2">
      <h1 class="h2 pr-5 mr-5">AQNS Heatmap</h1>
      <div class="btn-toolbar p-0 m-0">
        <div class="btn-group btn-group px-5 mr-5" id="buttonGroup" hidden>
            <button type="button" id="MxW" class="btn btn-secondary" onclick="selecionarGrafico('MW')">Poços x Modelos</button>
            <button type="button" id="MxA" class="btn btn-secondary" onclick="selecionarGrafico('MA')" >Atributos x Modelos</button>
            <button type="button" id="WxA" class="btn btn-secondary" onclick="selecionarGrafico('WA')">Poços x Atributos</button>
        </div>
        <label for="inputCSV" class="btn btn-outline-secondary ml-5 mb-0">Subir novo arquivo</label>
        <input type="file" id="inputCSV" onchange="pegaCSV(this)">
        <button type="button" class="btn btn-primary btn-ig ml-3 mb-0" data-toggle="modal" data-target="#modalVersion">Selecionar Versão</button>
      </div>
    </header>
    <div class="row border"><br>
      <div class="row col-12" id="titleFilters"></div>
      <div class="col-6" id="filters-1"></div>
      <div class="col-6" id="filters-2"></div>
      <br><br>
    <div class="row border-bottom col-12" id="buttonFilter"></div>
    </div>
    <div id="divCarregando" class='h3 text-center col-12' style='display:none;'>Grafico sendo carregado, aguarde...</div>
    <div id="my_dataviz" height="0px"></div>
    <div class="row">
      <div class='col-5'></div>
      <button type='button' class='btn btn-secondary tent-center col-2 mt-2 mb-2' hidden id="exportImage">Exportar como Imagem</button>
      <div class='col-5'></div>
    </div>
    <script type="text/javascript" src="js/jquery-3.3.1.slim.min.js"></script>
    <script type="text/javascript" src="js/bootstrap.min.js"></script>
    <script type="text/javascript" src="js/d3.v4.js"></script>
    <script type="text/javascript" src="js/d3-scale-chromatic.v1.min.js"></script>
    <script type="text/javascript" src="js/loadData.js"></script>
    <script type="text/javascript" src="js/filters.js"></script>
    <script type="text/javascript" src="js/gerarGrafico.js"></script>
    <script type="text/javascript" src="js/saveSvgAsPng.js"></script>
    <script type="text/javascript" src="js/saveImage.js"></script>
    <script type="text/javascript" src="js/consultaGrafico.js"></script>
  </body>
</html>
