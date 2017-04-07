/*
$('#todoinput').bind('keypress',function(event){
	if(event.keyCode == 13){
		var input = $("#todoinput").val();
		//$("#todoli").html(input);
		$.ajax({
			url:'/todo/ajax',
			type:'POST',
			async:false,
			data:{input : input},
			timeout:5000,
			dataType:'text',    //返回的数据格式：json/xml/html/script/jsonp/text
			success:function(data){
				if (data.toString() === 'success'){
					appendOneMoreLi(input);
				}
			},
			error:function(err){
				console.log(err);
			}
		})
	}
});
*/

$('#todoinput').bind('keypress',function(event){
	if(event.keyCode == 13) {
		var input = $("#todoinput").val();
		$("#todoinput").val("");
		appendOneMoreLi(input);
	}
});

function appendOneMoreLi(input) {
	var left_len = $("#tdul_left li").length;
	var right_len = $("#tdul_right li").length;
	if (left_len < 10){
		$("#tdul_left").append("<li>"+input+"</li>");
		$("#tdul_left li").attr("class","list-group-item");
		bindLiClick();
	}else if (right_len < 10){
		$("#tdul_right").append("<li>"+input+"</li>");
		$("#tdul_right li").attr("class","list-group-item");
		bindLiClick();
	}else{
		alert('full');
	}
}

function bindLiClick() {
	$("li").click(function (e) {
		e.preventDefault();
		var txt = $(this).html();
		$(this).html("<s>"+txt+"</s>");
		$(this).unbind('click');
	})
}