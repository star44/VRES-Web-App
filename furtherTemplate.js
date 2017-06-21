(function () {
	
	var numCanvases = 10;
	var canvasArray = [];

	for(var i = 0; i < numCanvases; i++) {
		canvasArray[i] = i + 1;
	}

	// This takes the text from within the template script tags
	var templateScriptTags = document.querySelector("#canvasesTemplate").innerText;

	// Where we are planning to put the template
	var destination = document.querySelector("#containsAllCanvases");

	// Assign an empty template to the script tags
	var templateHolder = _.template(templateScriptTags);

	// Send variables to this template
	var templateWithVariables = templateHolder({
									array: canvasArray
								});

	// Put the template described in templateScriptTags into the destination
	destination.innerHTML = templateWithVariables;

})(window);