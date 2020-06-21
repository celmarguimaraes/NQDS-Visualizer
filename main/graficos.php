<?php 
include ('conexao.php'); 
?>
<div class="btn-group btn-group-toggle px-5 mr-5" data-toggle="buttons" id="buttonGroup" hidden>
            <button type="button" id="MxW" class="btn btn-secondary" onclick="graficoPadrao('MW')">Wells x Models</button>
            <button type="button" id="MxA" class="btn btn-secondary" onclick="graficoPadrao('MA')" >Attributes x Models</button>
            <button type="button" id="WxA" class="btn btn-secondary" onclick="graficoPadrao('WA')">Wells x Attributes</button>
</div>