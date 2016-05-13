//Correções:
//Select não exibe opção para listar tudo;
//Pesquisa por ID
//Botão para listar tudo
//
//
//

var strings= {endereco:'http://localhost:3000/product/', mensagemErroId:'Não foi possível selecionar o produto.'};

$(document).ready(function(){
	/*listar();
	$("#produtos").change(function(){
        buscarproduto();
    });*/

    $('#pesquisarId').click(function(){
    	listarPorId();
    });

    $('#todosOsProdutos').click(function(){
    	todosprodutos();
    });

	$("#editar").click(function(){
        atualizarformulario();
    });
    $("#submit").click(function(){
        editarproduto();
    });
	$("#excluir").click(function(){
        excluirproduto();
    });
    $("#abrir").click(function(){
        abrirformulario();
    });
	$("#submit2").click(function(){
        incluirproduto();
    });  
});

function exibirbotoes(){
	$('#editar').show();
	$('#excluir').show();
}

function esconderbotoes(){
	$('#editar').hide();
	$('#excluir').hide();
}

function listar (){
	$.getJSON(strings.endereco, function(data){
		var list='<option value="#"> Selecione uma opção. </option>';
		for (var x=0; x<data.length;x++){
			list+='<option value='+data[x].id+'>' + data[x].nome + '</option>';
		}
		$('#produtos').html(list);
	});
}

function listarPorId(){
	var id = $('#campoId').val();
	var num = isNaN(id);
	if(id!=='' && num===false){
		buscarproduto(id);
	}else{
		mensagemErroId();
	}
}

function mensagemErroId(){
	$('#resultado').html(strings.mensagemErroId);
}

function buscarproduto(id){
	var i = id;
	console.log(i);
	//var i=$('#produtos').val();
	//if (i>=0){
		$.getJSON(strings.endereco + i, function(data){
			var result='';
			result+='<table border="1"><tr><th>Código</th><th>Produto</th><th>Valor</th><th>Status</th><th>Estoque</th></tr>';
			result+='<tr><td>' + data.id + '</td>' ;
			result+='<td>' + data.nome + '</td>' ;
			result+='<td> R$' + data.valor + '</td>';
			result+='<td>' + data.status + '</td>';
			result+='<td>' + data.estoque + '</td></tr></table>';
			$('#resultado').html(result);
			exibirbotoes();
		});
	/*	
	}

	else {
		limpar(i);
		todosprodutos(i);
	}
	*/
}

function limpar(i){
	if (i==="#"){
		$('#resultado').html('');
		esconderbotoes();
	}
}

function todosprodutos (){
	//if (i==="@"){
		$.getJSON(strings.endereco, function(data){
			var result='';
			result+='<table border="1"><tr><th>Código</th><th>Produto</th><th>Valor</th><th>Status</th><th>Estoque</th></tr><tr>';
			for (var n=0; n<data.length; n++){
				result+='<tr><td>' + data[n].id + '</td>' ;
				result+='<td>' + data[n].nome + '</td>' ;
				result+='<td> R$' + data[n].valor + '</td>';
				result+='<td>' + data[n].status + '</td>';
				result+='<td>' + data[n].estoque + '</td></tr>';
			}
			'</table>';
			$('#resultado').html(result);
		});
		esconderbotoes();
	//}
}

function atualizarformulario (){
	$('#formulario').toggle();
	$('#abrir').hide();
	$("#submit2").hide();
}

function editarproduto (){
	var i=$('#produtos').val();
	$.ajax({
		url:endereco + i, 
		type: 'PUT',
		data: {
			nome:$('#nome').val(),
			valor:$('#valor').val(),
			status:$('input[name=status]:checked', '#formulario').val(),
			estoque:$('#estoque').val()
		}
	});
}

function excluirproduto(){
	var i=$('#produtos').val();
	$.ajax({
		url:endereco + i, 
		type: 'DELETE'
	});
}

function abrirformulario (){
	$("#formulario").toggle();
	$("#submit").hide();
}

function incluirproduto (){
	$.ajax({
		url:endereco, 
		type: 'POST',
		data: {
			nome:$('#nome').val(), 
			valor:$('#valor').val(),
			status:$('input[name=status]:checked', '#formulario').val(),
			estoque:$('#estoque').val()
		}
	});
}