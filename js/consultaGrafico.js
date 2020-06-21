function gerarStringGrafico(tipoGrafico,pocosSelec,atribsSelec,maxRangeModels,minRangeModels){
    
    const parametroModelos = stringModelos(maxRangeModels,minRangeModels);
    const parametroPocos = stringPocos(pocosSelec);
    const parametroAtributos = stringAtributos(atribsSelec);

    return new Promise((resolve,reject) => {

        consultaGrafico(tipoGrafico,parametroPocos,parametroAtributos,parametroModelos).then( retorno => {

            return retorno.json();
      
          }).then(json => {
      
            resolve(json);
      
          }).catch(function() {
      
            reject("Deu erro na geração do gráfico !");
      
          });
    });
    
}

//Pega o maximo e minimo de modelos e transforma em uma String para consulta
const stringModelos = (maxRangeModels,minRangeModels) =>{
    let stringModelos = "";
    let vetorModelos = [];
    for(i=parseInt(minRangeModels);i<=maxRangeModels;i++){
        if(i == maxRangeModels){
            stringModelos += "'base"+("0000" + (i)).slice(-4)+"'";
        }else{
            stringModelos += "'base"+("0000" + (i)).slice(-4)+"',";
        }
        vetorModelos.push("base"+("0000" + (i)).slice(-4));
    }
    return stringModelos;
}

//Pega os poços selecionados e transforma em String para consulta
const stringPocos = pocos =>{
    let stringPocos = "";
    pocos.forEach(function(poco,index) {
        if(index == pocos.length - 1){
            stringPocos += "'"+poco+"'";
        }else{
            stringPocos += "'"+poco+"',";
        }
    })
    return stringPocos;
}

//Pega os atributos selecionados e transforma em String para consulta
const stringAtributos = (atributos) =>{
    let stringAtributos = "";

    atributos.forEach(function(atributo,index){
        if(index == atributos.length - 1){
            stringAtributos += "'"+atributo+"'"
        }else{
            stringAtributos += "'"+atributo+"',";
        }
    });
    return stringAtributos;
}

function consultaGrafico(tipoconsulta,pocosSelec,atribsSelec,modelosSelec){
    let dados = {
      consulta: tipoconsulta,
      pocos: pocosSelec,
      atributos: atribsSelec,
      modelos: modelosSelec,
      iteracao: iteracaoGraf,
      versao: versaoGraf,
      data: dataGraf
    };
  
    return fetch('main/consultabanco.php', {
      method: 'POST',
      body: JSON.stringify(dados),
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    });
  }