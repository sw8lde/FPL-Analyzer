
function exportToCSV(fileName, rows) {
	let processRow = function(row) {
		let finalVal = '';
		for(let j = 0; j < row.length; j++) {
			let innerValue = row[j] == undefined ? '' : row[j].toString();
			if(row[j] instanceof Date) {
				innerValue = row[j].toLocaleString();
			};
			let result = innerValue.replace(/"/g, '""');
			if(result.search(/("|,|\n)/g) >= 0)
			result = '"' + result + '"';
			if(j > 0)
			finalVal += ',';
			finalVal += result;
		}
		return finalVal + '\n';
	};

	let csvFile = '';
	for(let i = 0; i < rows.length; i++) {
		csvFile += processRow(rows[i]);
	}

	let blob = new Blob([csvFile], {type: 'text/csv;charset=utf-8;'});
	if(navigator.msSaveBlob) {
		navigator.msSaveBlob(blob, fileName);
	} else {
		let link = document.createElement("a");
		if(link.download !== undefined) {
			link.setAttribute("href", URL.createObjectURL(blob));
			link.setAttribute("download", fileName);
			link.style.visibility = 'hidden';
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		}
	}
}

$(function() {
	$('#side-nav .select, .filters-popup .select').focusout(function() {
   	$(this).removeClass('open')
   	.find('tbody').slideUp(200);
	});
	$('#side-nav .select thead, .filters-popup .select thead').click(function() {
		$(this).next().width($(this).width())
		.slideToggle(200)
		.parent().toggleClass('open');
	});
	$('#side-nav .select:not(.multi) td, .filters-popup .select:not(.multi) td').click(function() {
		$(this).parent().parent().slideUp(200)
		.parent().removeClass('open')
		.find('th').eq(0).text($(this).text());
	});
});
