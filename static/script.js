let changedHook = {};


function main() {
	buildFormInputs();
	attachInputEventHandlers();
	showHookChanges();

	document.getElementById("revert_hook_changes").addEventListener('click', revertChanges)
	document.getElementById("submit_hook_changes").addEventListener('click', submitChanges);
	document.getElementById("changed_hook_download").addEventListener('click', download);
}


function buildFormInputs() {
	let form = document.getElementById('hook_changer_form');

	for (let i in OrigHook) {

		label = `<label> ${i} </label>`;
		input = getInput(i, OrigHook[i]);

		form.innerHTML += `<div class="hook_input_item"> ${label} ${input}</div>`;
	}
}


function showHookChanges() {
	
	var table = `
		<table class="table">
			<tr>
				<th colspan=3> Hook Changes </th> 
			</tr>

			<tr>
				<th> Property </th>
				<th> Original Value</th>
				<th> Changed Value </th>
			</tr>
	`

	for (let i in changedHook) {
		table += `
			<tr>
				<td> ${i} </td>
				<td> ${OrigHook[i]} </td>
				<td> ${changedHook[i]} </td>
			</tr>
		`
	}

	table += "</table>";

	if ( Object.keys(changedHook).length === 0 && changedHook.constructor === Object ) {
		//when no hook changes have been made
		table = "";
		
		hideElem(document.getElementById('submit_hook_changes'));
		hideElem(document.getElementById('changed_hook_download'));
	} else {
		showElem(document.getElementById('submit_hook_changes'));
		showElem(document.getElementById('changed_hook_download'));
	}

	document.getElementById('hook_changes_summary').innerHTML = table;
}

function showElem(elem) {
	elem.classList.remove('hide');
}

function hideElem(elem) {
	elem.classList.add('hide');
}


function submitChanges(revert) {
	console.log("Submitting Changes");

	showElem(document.getElementById('revert_hook_changes'));

	xhr = new XMLHttpRequest();
    var url = "/update_hook";
    xhr.open("POST", url);
    xhr.setRequestHeader("Content-type", "application/json");
    
    xhr.onreadystatechange = function () { 
    	
        if (xhr.readyState == 4 && xhr.status == 200) {
            var json = JSON.parse(xhr.responseText);
            
            if (revert == true) {
            	location.reload();
            }

            $('#bs_alert_success').show()

            setTimeout(function(){
            	$("#bs_alert_success").hide('fade');
            }, 3000);
        }
    }

    var data = JSON.stringify(changedHook);
    if (revert == true) {
    	data = JSON.stringify(OrigHook);
    }
    
    xhr.send(data);
	// let form = document.getElementById('hook_changer_form').submit();
}

function revertChanges() {
	console.log("Revert Hook Changes");
	submitChanges(true);
} 

function inputAction(evt) {
	let name = evt.target.name;
	let value = setCorrectType(evt.target.value);

	if (!value && value != "false" && value != 0) {
		revertLastChange(name, evt.target);
		return;
	}
	
	if (OrigHook.hasOwnProperty(name)) {
		
		if ( !checkIfValidChange(name, value) ) {
			// console.log("Invalid Change Made");
			revertLastChange(name, evt.target);
			// evt.target.value = OrigHook[name]; 
		} 

		else if (value != OrigHook[name]) {
			// console.log("OrigHook value different from changed value ");
			changedHook[name] = value;
			document.getElementsByName(name)[0].classList.add('value_changed');
		} 

		else {
			// console.log("OrigHook value same as changed value ");

			delete changedHook[name];
			document.getElementsByName(name)[0].classList.remove('value_changed');
		}

		// console.log("ChangedHook = ", changedHook);
	}

	showHookChanges();
	// console.log("Name = " + name + ", Value = " + value);
}


function revertLastChange (property, elem) {
	if ( changedHook.hasOwnProperty(property) ) {
		elem.value = changedHook[property];
	} else {
		elem.value = OrigHook[property];
	}
}


function setCorrectType(value) {
	
	if ( value == "null" ) {
		return null;
	}

	if (value == "true" || value == "false") {
		return value == "true";
	}

	else if (!isNaN(value)) {

		if (value.toString().indexOf('.') != -1) {
			return parseFloat(value);
		} else {
			return parseInt(value);
		}
	} 
}


function checkIfValidChange(property, value) {

	if (value == null) {
		return OrigHook[property] == null;
	}

	else if (typeof(value) == "boolean") {
		return typeof(OrigHook[property]) == "boolean";
	} 

	else if (!isNaN(value)) {

		
		if (value.toString().indexOf('.') != -1) {
			//check if original value is also a float.
			return OrigHook[property].toString().indexOf('.') != -1
		}

		else {
			//Check if original value is also a int.
			return !isNaN(OrigHook[property]);
		}
	}
}


function attachInputEventHandlers() {
	let inputs = document.getElementsByClassName("hook_input"); //document.getElementById('hook_changer_form').getElementsByTagName('input');
	
	for (let i in inputs) {
		if (typeof(inputs[i]) != "object" && !inputs[i].addEventListener) {
			continue;
		}
		inputs[i].addEventListener('keyup', inputAction);
	}
}

function getInput(i, hookItem) {
	
	let input;

	if (typeof(hookItem) == "boolean") {
		input = `
			True: <input class="hook_input .form-control-sm" name=${i} type="radio" class="hook_bool" value="true" ${hookItem == true ? "checked" : ''}>
			False: <input class="hook_input .form-control-sm" name=${i} type="radio" class="hook_bool" value="false" ${hookItem == false ? "checked" : ''}> 
		`
	}

	else if (typeof(hookItem) == "number") {
		input = `<input class="hook_input .form-control-sm" type="text" name="${i}" value="${hookItem}"/>`;
	}

	else if (hookItem.length >= 20) {
		input = `<textarea class="hook_input .form-control-sm" name="${i}> ${hookItem} </textarea>`;
	}

	else {
		input = `<input class="hook_input .form-control-sm" type="text" name="${i}" value="${hookItem}"/>`;
	}

	return input;
}

function download() {
	var json = JSON.stringify(changedHook, null, 4);
	var blob = new Blob([json], {type: "octet/stream"});
	downloadFile(blob, 'changedHook.json');
}

function downloadFile(blob, fileName) {
	var url = window.URL.createObjectURL(blob);
	var a = document.createElement('a');
	a.href = url;
	a.download = fileName;
	a.click();
	a.remove();

	document.addEventListener("focus", w=>(window.URL.revokeObjectURL(blob)));
}

main();