<?php
    require __DIR__ . '/../classe/Pesquisa.php';


    $pesquisa=new ClassPesquisa();
    $retorno=$pesquisa->pesquisaVersoes();
    $contador = 1;
?>

<div class="modal fade" id="modalVersion">
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h4 class="modal-title">Choose your Version</h4>
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span></button>
                
            </div>
            <div class="modal-body">
                <table class="table table-hover">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Data</th>
                        <th scope="col">Versão</th>
                        <th scope="col">Iteração</th>
                        </tr>
                    </thead>
                    <tbody>
                    <?php foreach($retorno as $linha){ ?>
                        <tr onclick="selecionaModal('<?php echo trim($linha['Versao']);?>','<?php echo $linha['Iteracao'];?>','<?php echo date('d/m/Y H:i', strtotime($linha['Data']));?>')">
                        <th scope="row"><?php echo $contador++ ?></th>
                        <td><?php echo date('d/m/Y H:i', strtotime($linha['Data']));?></td>
                        <td><?php echo $linha["Versao"];?></td>
                        <td><?php echo $linha["Iteracao"];?></td>
                        </tr>
                     <?php } ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</div>



