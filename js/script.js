var strings = {
	endereco:'http://localhost:3000/product/', 
	mensagemErroId:'<span class="erro">Não foi possível selecionar o produto.</span>', 
	mensagemErroPreenchimento:'<span class="erro">Informe corretamente todos os campos.</span>',
	mensagemConfirmarExclusão:'Tem certeza que deseja excluir este produto?',
	mensagemSucessoEditar:'<span class="erro">Fruta editada com sucesso!</span>',
	mensagemSucessoExcluir:'<span class="erro">Fruta excluida com sucesso!</span>'
};

$(document).ready(function(){
	$('#filtroStatus').hide();

    $('#pesquisarId').click(function(){
    	listarPorId();
    	fecharFormulario();
    	$('#campoId').val('');
    	$('#filtroStatus').hide();
    });

    $('#todosOsProdutos').click(function(){
    	$('#filtroStatus').val('todos');
    	todosProdutos();
    	fecharFormulario();
    	$('#filtroStatus').show();
    });

    $("#formularioInserir").click(function(){
        limparCampos();
        $('#editar').hide();
        $('#incluir').show();
        abrirFormulario();
        $('#filtroStatus').hide();
    });

    $("#incluir").click(function(){
        verificaCampos();
        $('#filtroStatus').hide();
    });

	$("#formularioEditar").click(function(){
        pegarId();
        $('#excluir').hide();
        $('#editar').hide();
        $('#editar').show();
        atualizarformulario();
        $('#filtroStatus').hide();
    });

    $('#cancelar').click(function(){
    	limparCampos();
    	fecharFormulario();
    });

    $("#editar").click(function(){
        editarProduto();
    });

	$("#excluir").click(function(){
        confirmar();
        $('#filtroStatus').hide();
    });

	$('#filtroStatus').change(function(){
        var indice = this.value;
        filtro(indice);
	});

    $("#valor").maskMoney({decimal: '.'});
    $("#estoque").maskMoney({decimal: '.', precision: 1, thousands: ''});
});

//faz que com o pressionamento da tecla enter, seja realizada a pesquisa
$(document).keypress(function(e) {
	if (e.which == 13) {
		listarPorId();
    	fecharFormulario();
    	$('#campoId').val('');
	}
});

//faz a requisição de todos os produtos
function todosProdutos(){
	$.getJSON(strings.endereco, function(data){
		var result='';
		result+='<table border="2"><tr><th>Código</th><th>Produto</th><th>Valor</th><th>Status</th><th>Estoque</th></tr><tr>';
		for (var n=0; n<data.length; n++){
			result+='<tr><td>' + data[n].id + '</td>' ;
			result+='<td>' + data[n].nome + '</td>' ;
			result+='<td> R$ ' + data[n].valor + '</td>';
			result+='<td>' + data[n].status + '</td>';
			result+='<td>' + data[n].estoque + '</td></tr>';
		}
		'</table>';
		$('#resultado').html(result);
	});
	esconderBotoes();
}

//isNaN testa se o que foi digitado não é um número
function listarPorId(){
	var id = $('#campoId').val();
	var num = isNaN(id);
	if(id!=='' && num===false){
		buscarProduto(id);
	}else{
		mensagemErroId();
	}
}

//faz a requisição de um produto (de acordo com a id digitada)
function buscarProduto(id){
	var id = id;
	$.getJSON(strings.endereco + id, function(data){
		var data = data;
		var result='';
		result+='<table border="2"><tr><th>Código</th><th>Produto</th><th>Valor</th><th>Status</th><th>Estoque</th></tr>';
		result+='<tr data-id='+data.id+'><td>' + data.id + '</td>' ;
		result+='<td>' + data.nome + '</td>' ;
		result+='<td> R$ ' + data.valor + '</td>';
		result+='<td>' + data.status + '</td>';
		result+='<td>' + data.estoque + '</td></tr></table>';
		$('#resultado').html(result);
		exibirBotoes();
	})
	.fail(function(){
		limpar();
		mensagemErroId();
	});
}

//função ajax serve para fazer as requisições PUT, POST e DELETE
function ajax (link,tipo){
	var nome = $('#nome').val(),
	nome = nome.toLowerCase();
	$.ajax({
		url:link,
		type: tipo,
		data: {
			nome:nome,
			valor:$('#valor').val(),
			status:$('input[name=status]:checked', '#formulario').val(),
			estoque:$('#estoque').val()
		}
	});
}

//POST, serve para adicionar um produto
function incluirProduto(){
	ajax(strings.endereco,'POST');
}

function editarProduto(){
	var id = $('#resultado').find('tr:nth-child(2)').data('id');
	editar(id);
}

//PUT, serve para editar um produto
function editar(id){
	ajax(strings.endereco+id,'PUT')
	fecharFormulario();
	limparCampos();
	$("#formularioEditar").hide();
	$('#resultado').html(strings.mensagemSucessoEditar);
}

//DELETE, serve para excluir um produto
function excluirProduto(){
	var id = $('#resultado').find('tr:nth-child(2)').data('id');
	ajax(strings.endereco+id,'DELETE');
	fecharFormulario();
	$("#formularioEditar").hide();
}


//verifica se todos os campos do formulário foram preenchidos
function verificaCampos(){
	var nome = $('#nome').val();
	var valor = $('#valor').val();
	var estoque = $('#estoque').val();
	if(nome===''||valor===''||estoque===''){
		$('#resultado').html(strings.mensagemErroPreenchimento);
	}
	else{
		incluirProduto();
		fecharFormulario();
        todosProdutos();
	}
}

//limpa os campos do formulário
function limparCampos(){
	$('#nome').val('');
	$('#valor').val('');
	$('#estoque').val('');
}

//salva a ID digitada antes de limpar a linha
function pegarId(){
	var id = $('#resultado').find('tr:nth-child(2)').data('id');
	preencheCampos(id);
}

//preenche os campos do formulário "editar" de acordo com os dados antigos da ID selecionada
function preencheCampos(id){
	var id = id;
	$.getJSON(strings.endereco + id, function(data){
		$('#nome').val(data.nome);
		$('#valor').val(data.valor);
		if(data.status==='A'){
			$('.A').prop('checked', true);
		}else{
			$('.I').prop('checked', true);
		}
		$('#estoque').val(data.estoque);
	});
}

//limpa a div onde são mostradas os resultados
function limpar(){
	$('#resultado').html('');
}

//mensagem alertando sobre a exclusão de um produto
function confirmar(){
	var press = confirm(strings.mensagemConfirmarExclusão);
	if(press === true){
		excluirProduto();
		esconderBotoes();
		limpar();
		$('#resultado').html(strings.mensagemSucessoExcluir);
	}
}

//verifica qual opção do filtro está selecionada
function filtro(indice){
	var selecionado = indice;
	console.log(selecionado);
	if (selecionado === "todos"){
		limpar();
		todosProdutos();
	}
	else if(selecionado === "ativos"){
		limpar();
		testaStatus(true);
	}
	else if(selecionado === "inativos"){
		limpar();
		testaStatus(false);
	}
}

//verifica se o status é "Ativo" ou "Inativo"
function testaStatus(status){
	$.getJSON(strings.endereco, function(result){
		var arrOut = '';
		if (status === true){
	        arrOut += ativoOuInativo('A', result);
	    }
	    else{
	        arrOut += ativoOuInativo('I', result);
	    } 
	   	 $('#resultado').append(arrOut);
	});
}

//escreve os produtos
function ativoOuInativo(status,result){
	var arrOut='';
	arrOut+='<table border="2"><tr><th>Código</th><th>Produto</th><th>Valor</th><th>Status</th><th>Estoque</th></tr><tr>';
	for (var n=0; n<result.length; n++){
		if (result[n].status===status){
			arrOut+='<tr><td>' + result[n].id + '</td>' ;
			arrOut+='<td>' + result[n].nome + '</td>' ;
			arrOut+='<td> R$ ' + result[n].valor + '</td>';
			arrOut+='<td>' + result[n].status + '</td>';
			arrOut+='<td>' + result[n].estoque + '</td></tr>';
		}
	}
	return arrOut;
}

//sequência de funções para ocultar/mostrar botões
function esconderBotoes(){
	$('#formularioEditar').hide();
	$('#excluir').hide();
}

function exibirBotoes(){
	$('#formularioEditar').show();
	$('#excluir').show();
}

function mensagemErroId(){
	$('#resultado').html(strings.mensagemErroId);
	esconderBotoes();
}

function fecharFormulario(){
	limparCampos();
	$("#formulario").hide();
}

function abrirFormulario(){
	limpar();
	esconderBotoes();
	$("#formulario").fadeIn('fast');
}

function atualizarformulario (){
	$('#formulario').show();
	$('#abrir').hide();
	$("#incluir").hide();
}