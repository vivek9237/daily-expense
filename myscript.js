//Global Variables
var script_url = "https://script.google.com/macros/s/AKfycbxrSF_eZPNqkac_ny79-ZuYU3vBGKabYQ1gWdAi7vIjCaXql0A/exec";

var expenseValidationMessage = "Enter value in expense";
var valueReturnedFromGoogleIfAlreadyExist = "Expense Record Already crreated for this date. Use Update button to update.";
function getSheetName(){
	return document.getElementById("sheetname").innerText;
}
function getMaxValue(){
	return document.getElementById("maxValue").innerText;
}
// Make an AJAX call to Google Script
function insert_value() {
	var weekNum = getWeekFromDate(new Date($("#id").val()));
	var id1=	"*"+$("#id").val();
	var temp= $("#name").val().split("+").join("%2B");
	var name = temp.split("-").join("0-")
	var max = getMaxValue();
	if(!validateExpense(name))
	{
		alert(expenseValidationMessage);
		return;
	}
	$("#re").css("visibility","hidden");
	document.getElementById("text").innerHTML = "Adding...";
	document.getElementById("overlay").style.display = "block";
	$('#mySpinner').addClass('spinner');
	
	var url = script_url+"?callback=ctrlq&name="+name+"&id="+id1+"&max="+max+"&sheet="+getSheetName()+"&weekNum="+weekNum+"&action=insert";

	var request = jQuery.ajax({
		crossDomain: true,
		url: url ,
		method: "GET",
		dataType: "jsonp"
	});
}


  
function popupBreakdown(id) {
	var popup = document.getElementById(id);
	popup.classList.toggle("show");
	var popup1 = document.getElementById(id);
	setTimeout(function() {
		if(popup1.className=="popuptext show"){
			popup.classList.toggle("show");
		}
	}, 3500);
	
}
 
  
  
function update_value(){
	var weekNum = getWeekFromDate(new Date($("#id").val()));
	var id1=	"*"+$("#id").val();
	var temp= $("#name").val().split("+").join("%2B");
	var name = temp.split("-").join("0-")
	if(!validateExpense(name))
	{
		alert(expenseValidationMessage);
		return;
	}
	
	$("#re").css("visibility","hidden");
	document.getElementById("text").innerHTML = "Updating..";
	document.getElementById("overlay").style.display = "block";
	var url = script_url+"?callback=ctrlq&name="+name+"&id="+id1+"&sheet="+getSheetName()+"&weekNum="+weekNum+"&action=update";
	
	var request = jQuery.ajax({
		crossDomain: true,
		url: url ,
		method: "GET",
		dataType: "jsonp"
	});
}
	
function deletePrompt(message) {
	var person = prompt(message, "");
	if (person == "" || person== null || person.length<3) {
		alert("Deletion failed!");
		return false;
	}
	else{
	return true;
	}
}
 
  
  
function delete_value(){
	if (deletePrompt("Delete Record for "+$("#id").val()+"!\nEnter 3 characters to confirm")) {
		$("#re").css("visibility","hidden");
		document.getElementById("text").innerHTML = "Deleting...";
		document.getElementById("overlay").style.display = "block";
		$('#mySpinner').addClass('spinner');
		var id1=	"*"+$("#id").val();
		var name= $("#name").val();
		var url = script_url+"?callback=ctrlq&name="+name+"&id="+id1+"&sheet="+getSheetName()+"&action=delete";
		var request = jQuery.ajax({
			crossDomain: true,
			url: url ,
			method: "GET",
			dataType: "jsonp"
		});
	} else {
		return;
	}
	
}


  // print the returned data
function ctrlq(e) {
	if(e.result==valueReturnedFromGoogleIfAlreadyExist){
		update_value();
		return;
	}
	$("#re").html(e.result);
	$("#re").css("visibility","visible");
	read_value();	
}
  
  
function validateExpense(name){
	if(name==""){
		return false;
	}
	else {
		return true;
	}
	
}


function read_value() {
	document.getElementById("name").value = "";
	$("#re").css("visibility","hidden");
	document.getElementById("text").innerHTML = "Loading...";
	document.getElementById("overlay").style.display = "block";
	var url = script_url+"?action=read&sheet="+getSheetName();
	$.getJSON(url, function (json) {
    // Set the variables from the results array
   
        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
		table.setAttribute('id', 'tableID');

        var header = table.createTHead();
		var row = header.insertRow(0);     
		var cell1 = row.insertCell(0);
	//	var cell2 = row.insertCell(1);
		var cell3 = row.insertCell(1);
		var cell4 = row.insertCell(2);
		var cell5 = row.insertCell(3);
	
		cell1.innerHTML = "<b>Date</b>";
		//cell1.setAttribute('onclick', 'sortTable()');
		//cell2.innerHTML = "<b>Breakdown</b>";
		cell3.innerHTML = "<b>Expense</b>";
		cell4.innerHTML = "<b>Max</b>";
		cell5.innerHTML = "<b>Savings</b>";
        var body = table.createTBody();
        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < json.records.length; i++) {		
			if(json.records[i].ID.length>1){
            tr = body.insertRow(-1);
				var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = json.records[i].ID;
				tabCell = tr.insertCell(-1);
				tabCell.innerHTML = json.records[i].breakdown;
				tabCell.setAttribute('class', 'breakdown');
				tabCell.setAttribute('style', 'display:none;');
				tabCell.setAttribute('id', i);
				tabCell = tr.insertCell(-1);//
				tabCell.innerHTML = "<div class=\"popup\" onclick=\"popupBreakdown('myPopup"+i+"')\">"+json.records[i].NAME+"<span class=\"popuptext\" id=\"myPopup"+i+"\">&nbsp;&nbsp;"+json.records[i].breakdown+"&nbsp;&nbsp;</span></div>";
				tabCell.setAttribute('class', 'expense');
				//tabCell.setAttribute('onclick', 'openPopUp('+i+')');
				tabCell = tr.insertCell(-1);
				tabCell.innerHTML = json.records[i].max;
				tabCell = tr.insertCell(-1);
				tabCell.innerHTML = json.records[i].savings;
            }
      }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById("showData");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
		document.getElementById("overlay").style.display = "none";
		sortTable();
		$("#re").css("visibility","visible");
    });
}



function myFunction() {
	var x = document.getElementById("myTopnav");
	if (x.className === "topnav") {
		x.className += " responsive";
	} else {
		x.className = "topnav";
	}
}


function openPopUp(id){
	var breakdown = document.getElementById(id).innerText;
	alert("Clicked "+breakdown);
}



function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("tableID");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.getElementsByTagName("TR");
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (rows.length - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[0];
      y = rows[i + 1].getElementsByTagName("TD")[0];
      //check if the two rows should switch place:
      if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
        //if so, mark as a switch and break the loop:
        shouldSwitch= true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}

function onload(){
	document.getElementsByTagName("body")[0].setAttribute("oncopy", "return false");
	document.getElementsByTagName("body")[0].setAttribute("oncut", "return false");
	document.getElementsByTagName("body")[0].setAttribute("onpaste", "return false");
	document.getElementById("id").valueAsDate = new Date();
}


function indexOnload(){
	document.getElementById("weeknumber").innerHTML = "Week Number = "+getWeekFromDate(new Date());
	document.getElementById("weekDayName").innerHTML = "Today is "+getDayNameFromDate(new Date());
	//document.getElementById("monthName").innerHTML = "Current month - "+getMonthNameFromDate(new Date());
}

function getWeekFromDate(date){
	var onejan = new Date(date.getFullYear(), 0, 1);
	return Math.ceil((((date - onejan) / 86400000) + onejan.getDay() + 1) / 7);
}

function getDayNameFromDate(date){
	var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	return dayNames[date.getDay()]
}

function getMonthNameFromDate(date){
	var month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    return month[date.getMonth()];
}
//////////////////////////////////////////////////////////////



function insert_value_2(){
	var weekNum = getWeekFromDate(new Date($("#id").val()));
	var id1=	"*"+$("#id").val();
	var temp= $("#name").val().split("+").join("%2B");
	var name = temp.split("-").join("0-")
	if(!validateExpense(name))
	{
		alert(expenseValidationMessage);
		return;
	}
	var paidBy = $("#paidby").val();
	if(paidBy == null)
	{
		alert(expenseValidationMessage);
		return;
	}
	$("#re").css("visibility","hidden");
	document.getElementById("text").innerHTML = "Adding...";
	document.getElementById("overlay").style.display = "block";
	$('#mySpinner').addClass('spinner');
	
	var url = script_url+"?callback=ctrlq2&name="+name+"&id="+id1+"&paidBy="+paidBy+"&sheet="+getSheetName()+"&weekNum="+weekNum+"&action=insert2";

	var request = jQuery.ajax({
		crossDomain: true,
		url: url ,
		method: "GET",
		dataType: "jsonp"
	});
}

function update_value_2(){
	var weekNum = getWeekFromDate(new Date($("#id").val()));
	var id1=	"*"+$("#id").val();
	var temp= $("#name").val().split("+").join("%2B");
	var name = temp.split("-").join("0-")
	if(!validateExpense(name))
	{
		alert(expenseValidationMessage);
		return;
	}
	
	$("#re").css("visibility","hidden");
	document.getElementById("text").innerHTML = "Updating..";
	document.getElementById("overlay").style.display = "block";
	var url = script_url+"?callback=ctrlq2&name="+name+"&id="+id1+"&sheet="+getSheetName()+"&weekNum="+weekNum+"&action=update2";
	
	var request = jQuery.ajax({
		crossDomain: true,
		url: url ,
		method: "GET",
		dataType: "jsonp"
	});
}

function ctrlq2(e) {
	if(e.result==valueReturnedFromGoogleIfAlreadyExist){
		update_value_2();
		return;
	}
	$("#re").html(e.result);
	$("#re").css("visibility","visible");
	read_value_2();	
}


function read_value_2() {
	document.getElementById("name").value = "";
	$("#re").css("visibility","hidden");
	document.getElementById("text").innerHTML = "Loading...";
	document.getElementById("overlay").style.display = "block";
	var url = script_url+"?action=read&sheet="+getSheetName();
	$.getJSON(url, function (json) {
    // Set the variables from the results array
   
        // CREATE DYNAMIC TABLE.
        var table = document.createElement("table");
		table.setAttribute('id', 'tableID');

        var header = table.createTHead();
		var row = header.insertRow(0);     
		var cell1 = row.insertCell(0);
		var cell3 = row.insertCell(1);
		var cell4 = row.insertCell(2);
	
		cell1.innerHTML = "<b>Date</b>";
		cell3.innerHTML = "<b>Paid By</b>";
		cell4.innerHTML = "<b>Expense</b>";
        var body = table.createTBody();
        // ADD JSON DATA TO THE TABLE AS ROWS.
        for (var i = 0; i < json.records.length; i++) {		
			if(json.records[i].ID.length>1){
            tr = body.insertRow(-1);
				var tabCell = tr.insertCell(-1);
                tabCell.innerHTML = json.records[i].ID;
				tabCell = tr.insertCell(-1);
				tabCell.innerHTML = json.records[i].breakdown;
				tabCell.setAttribute('class', 'breakdown');
				tabCell.setAttribute('style', 'display:none;');
				tabCell.setAttribute('id', i);
				tabCell = tr.insertCell(-1);
				tabCell.innerHTML = json.records[i].NAME;
				tabCell = tr.insertCell(-1);
				tabCell.innerHTML = "<div class=\"popup\" onclick=\"popupBreakdown('myPopup"+i+"')\">"+json.records[i].Paid+"<span class=\"popuptext\" id=\"myPopup"+i+"\">&nbsp;&nbsp;"+json.records[i].breakdown+"&nbsp;&nbsp;</span></div>";
				tabCell.setAttribute('class', 'expense');
            }
      }

        // FINALLY ADD THE NEWLY CREATED TABLE WITH JSON DATA TO A CONTAINER.
        var divContainer = document.getElementById("showData");
        divContainer.innerHTML = "";
        divContainer.appendChild(table);
		document.getElementById("overlay").style.display = "none";
		sortTable();
		$("#re").css("visibility","visible");
    });
}


function delete_value_2(){
	if (deletePrompt("Delete Record for "+$("#id").val()+"!\nEnter 3 characters to confirm")) {
		$("#re").css("visibility","hidden");
		document.getElementById("text").innerHTML = "Deleting...";
		document.getElementById("overlay").style.display = "block";
		$('#mySpinner').addClass('spinner');
		var id1=	"*"+$("#id").val();
		var name= $("#name").val();
		var url = script_url+"?callback=ctrlq2&name="+name+"&id="+id1+"&sheet="+getSheetName()+"&action=delete";
		var request = jQuery.ajax({
			crossDomain: true,
			url: url ,
			method: "GET",
			dataType: "jsonp"
		});
	} else {
		return;
	}
	
}