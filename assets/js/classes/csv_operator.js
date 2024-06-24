
class CSVOperator
{
	constructor(table, filename = "")
	{
		this.table = table;
		this.filename = filename;
	}
	DownloadCSVFile_ = (csv_data) =>
	{
		let csv_file, download_link;
	
		csv_file = new Blob([csv_data], {type: "text/csv"});
	
		download_link = document.createElement("a");
		download_link.download = this.filename;
		download_link.href = window.URL.createObjectURL(csv_file);
		download_link.style.display = "none";
		document.body.appendChild(download_link);
		download_link.click();
		document.body.removeChild(download_link);
	}
	TableToCSV_ = () =>
	{
		let data = [];
		let rows = document.querySelectorAll(`${this.table} tr`);
	
		for (let i = 0; i < rows.length; i++)
		{
			let row = [], cols = rows[i].querySelectorAll("td, th");
	
			for (let j = 0; j < cols.length; j++)
				row.push(cols[j].innerText);
	
			data.push(row.join("\t"));
		}
	
		return data.join("\n");
	}
};