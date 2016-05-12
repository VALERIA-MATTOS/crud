var endereco='http://localhost:3000';

$(document).ready(function(){
	$.getJSON(endereco + '/product', function(data){
		var list='<option value="#"> Selecione uma opção. </option>';
		list+='<option value="@"> exibir todos produtos </option>';
		for (var x=0; x<data.length;x++){
			list+='<option value='+data[x].id+'>' + data[x].nome + '</option>';
		}
		$('#produtos').html(list);
	});
});

function buscarproduto(){
	var i=$('#produtos').val();
	if (i>=0){
		$.getJSON(endereco + '/product/'+ i, function(data){
			var result='';
			result+='<table border="1"><tr><th>Código</th><th>Produto</th><th>Valor</th><th>Status</th><th>Estoque</th></tr>';
			result+='<tr><td>' + data.id + '</td>' ;
			result+='<td>' + data.nome + '</td>' ;
			result+='<td> R$' + data.valor + '</td>';
			result+='<td>' + data.status + '</td>';
			result+='<td>' + data.estoque + '</td></tr></table>';
			$('#resultado').html(result);
		});
	}

	else {
		limpar(i);
		todosprodutos(i);
	}
}

function limpar(i){
	if (i==="#"){
		$('#resultado').html('');
	}
}

function todosprodutos (i){
	if (i==="@"){
		$.getJSON(endereco + '/product', function(data){
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
	}
}

function atualizarformulario (){
	$.getJSON(endereco + '/product/', function(data){
		var list='<option value="#"> Selecione uma opção. </option>';
		for (var x=0; x<data.length;x++){
			list+='<option value='+data[x].id+'>' + data[x].id + ' - ' + data[x].nome + '</option>';
		}
		$('#codigo').html(list);
	});
	$("#formEditar").toggle();
}

function editarproduto (){
	var i=$('#nome').val();
	$.ajax({
		url:endereco + '/product/' + i, 
		type: 'PUT',
		data: {
			id:$('#codigo').val(),
			nome:$('#nome').val(),
			valor:$('#valor').val(),
			status:$('input[name=status]:checked', '#formEditar').val(),
			estoque:$('#estoque').val()
		}
	});
}

function excluirproduto (){
	var i=$('#produtos').val();
	$.ajax({
		url:endereco + '/product/' + i, 
		type: 'DELETE'
	});
}