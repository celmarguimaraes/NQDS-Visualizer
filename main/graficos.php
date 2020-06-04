<?php 
include ('conexao.php'); 
?>

<script>
function graficoPadrao(tipoGrafico){
  let dados = {
    grafico: tipoGrafico,
    iteracao: iteracaoGraf,
    versao: versaoGraf
  }

  fetch('consultabanco.php', {
    method: 'POST',
    body: JSON.stringify(dados)
  })
  .then(function(response){
    if(response.ok == true){
      //generateModelsWellsGraphic();
      //retornar sequencia de objetos consultados
    }else{
      alert("Erro na geração do gráfico !");
    }
  })
}
</script>

<div class="btn-group btn-group-toggle px-5 mr-5" data-toggle="buttons" id="buttonGroup" hidden>
            <button type="button" id="MxW" class="btn btn-secondary" onclick="graficoPadrao('MW')">Wells x Models</button>
            <button type="button" id="MxA" class="btn btn-secondary" onclick="graficoPadrao('MA')" >Attributes x Models</button>
            <button type="button" id="WxA" class="btn btn-secondary" onclick="graficoPadrao('WA')">Wells x Attributes</button>
</div>