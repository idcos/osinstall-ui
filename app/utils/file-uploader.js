export default function fileUploader(files,url,dataType) {
	var formData = new FormData();
	for(var i=0;i<files.length;i++){
		formData.append('file', files[i]);
	}
	
	return $.ajax({
		url: url,
		dataType: dataType,
		cache: false,
		contentType: false,
		processData: false,
		data: formData,
		type: 'post',
		success: function(response){
			return response;
		}
	});
}
