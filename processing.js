/**
 * Created by Sarmad on 15/12/2015.
 */

window.addEventListener( "load", processing, false );

function processing() {

	// Variable for number of indices...
    var numIndices = 7;

    // Set up localStorage...
	/*if( localStorage.length === 0 ) {
		var inputs = [];
		for( var index = 0; index < numIndices; index++ ) {
			inputs[index] = { transform: "Linear", min: "", max: "", buttons: [ false, false, false ] };
		}
		localStorage.setItem( "inputs", JSON.stringify( inputs ) );
	}
	var presetValues = JSON.parse( localStorage.inputs );
	console.log( presetValues );
*/

	// Set up canvas
	var canvas = document.getElementById("canvas");
    var context = canvas.getContext("2d");
	var slider = document.getElementById("navigationSlider");
	var goToButton = document.getElementById("goToButton");
    canvas.height = 255;
    canvas.width = 1431; 
    context.width = 1431;
    context.height = 255;

	// set up slider
	slider.min = 0;
	slider.max = 1431;
	slider.onchange = sliderOnChange;

    var imageData = context.createImageData(context.width, context.height);
    imageData.width = 1431;
    imageData.height = 255;

    var height = 255,
        width = 1431;

    var dataSubsets = [];



  /*  // Set up the x-axis
    var xAxisDestination = document.querySelector( "#xAxis" );
    // Access the axis object with this variable:
    var xAxis = d3.svg.axis();
    
    // Append an SVG to the body with these attributes:
    var SVGPlaced = d3.select( xAxisDestination ).append( "svg" );
	// Run the d3 function that makes the axisScale
	var finalValue = 0;
	var domain = [];
	var range = [];

	while( finalValue < 1500 ) {
		domain.push( finalValue );
		range.push( finalValue + 105 );
		finalValue += 60;
	}

    var axisScale = d3.scale.ordinal()
	    						.domain( domain )
	    						.range( range );
    var axisScaled = xAxis.scale( axisScale )
    							.orient( "bottom" );
    // Add attributes to the SVG:
    var axisInitialised = SVGPlaced.attr( "class", "xaxis" )
    							.attr( "width", 1600 )
    							.attr( "height", 30 );
    // Append a 'g' tag to group the axis into the one thing:
    var groupedSVG = axisInitialised.append( "g" );
    groupedSVG.call( axisScaled );

    var xCatch = Array.from( document.querySelectorAll( ".xaxis" ) );
    
    while( xCatch.length > 1 ) {
    	xAxisDestination.removeChild( xCatch[0] );
    }

*/
// Set up the x-axis
    var xAxisDestination = document.querySelector("#xAxis");
    // Access the axis object with this variable:
    var xAxis = d3.svg.axis();
    
    // Append an SVG to the body with these attributes:
    var SVGPlaced = d3.select( xAxisDestination ).append("svg");
	// Run the d3 function that makes the axisScale
	var rangeValue = 0;
	var domainValue = 0;
	var domain = [];
	var range = [];

	while( domainValue < 25 ) {
		domain.push( domainValue );
		range.push( rangeValue + 130 );
		rangeValue += 60;
		domainValue++;
	}

    var axisScale = d3.scale.ordinal()
	    						.domain(domain)
	    						.range(range);
    var axisScaled = xAxis.scale(axisScale)
    							.orient("bottom");
    // Add attributes to the SVG:
    var axisInitialised = SVGPlaced.attr("class", "xaxis")
    							.attr("width", 1600)
    							.attr("height", 30);
    // Append a 'g' tag to group the axis into the one thing:
    var groupedSVG = axisInitialised.append("g");
    groupedSVG.call( axisScaled );

    var xCatch = Array.from( document.querySelectorAll(".xaxis"));
    
	if(xCatch.length > 1) {
    	xAxisDestination.removeChild(xCatch[0]);
    }

    
    // Set up the y-axis:
    var yAxisDestination = document.querySelector("#yAxis");
    var yAxis = d3.svg.axis();
    var ySVGPlaced = d3.select(yAxisDestination).append("svg");
    var yAxisScale = d3.scale.linear()
    							.domain( [12000, 0] )
    							.range( [0, 255] );
    var yAxisScaled = yAxis.scale( yAxisScale )
    							.orient( "right" );
    var yAxisInitialised = ySVGPlaced.attr( "class", "yaxis" )
    							.attr( "width", 50 )
    							.attr( "height", 260 );
    var groupedYSVG = yAxisInitialised.append( "g" );
    groupedYSVG.call(yAxisScaled);

    var yCatch = Array.from( document.querySelectorAll( ".yaxis" ) );

    while( yCatch.length > 1 ) {
    	yAxisDestination.removeChild(yCatch[0]);
    }

    var viewChanges = document.querySelector("#viewChanges");
    viewChanges.onchange = viewChangesCallback;

	// Array of colors to be updated every time a button is pressed
	var allColors = [null, null, null];


	// These weren't free variables before cookies were implemented.
	var selects = Array.from( document.querySelectorAll( ".transform" ) );	
    var transforms = Array.from( document.querySelectorAll( ".transform" ) );

	// Saving the render button to a variable. Operations on the variable can change the entire object
    var renderButton = document.querySelector("#render");
	renderButton.onclick = chooseCSV;

	var renormalise = document.querySelector("#renorm");
    renormalise.onclick = viewNormalisedImage;

    var clearButton = document.querySelector("#clear");
    clearButton.onclick = emptyCanvas;

    //var secondxDiv = document.querySelector("#secondxAxisHolder");
    var secondxAxisDiv = document.querySelector("#secondxAxis");
    console.log(secondxAxisDiv);


	// Saving each radio button into arrays for each colour
    var redRadioInputs = Array.from(document.querySelectorAll(".red"));
    var greenRadioInputs = Array.from(document.querySelectorAll(".green"));
    var blueRadioInputs = Array.from(document.querySelectorAll(".blue"));

    // Load good defaults onto page:
    redRadioInputs[0].checked = true;
    greenRadioInputs[1].checked = true;
    blueRadioInputs[2].checked = true;


    allColors = [ 0, 1, 2 ];

    allColors.forEach( function( index ) {
    	selects[index].disabled = false;
    } );

    sessionStorage.setItem('indices', allColors);



    //Assigning text inputs to variables:
    var maxText = Array.from( document.querySelectorAll(".maximum") );
    var minText = Array.from( document.querySelectorAll(".minimum") );

    //var normMin = Array.from( document.querySelectorAll( ".normMin" ) );
    //var normMax = Array.from( document.querySelectorAll( ".normMax" ) );

    var standardMin = Array.from( document.querySelectorAll( ".MIN" ) );
    var standardMax = Array.from( document.querySelectorAll( ".MAX" ) );

    var saving;

    // Save the frequency band inputs as variables
    var lowerBand = document.querySelector("#lowerBand");
    var upperBand = document.querySelector("#upperBand");

    // Do event handling for these variables
    lowerBand.onchange = lowerBandOnChange;
    upperBand.onchange = upperBandOnChange;

    sessionStorage.setItem('lowerFrequency', eval(lowerBand.value));
    sessionStorage.setItem('upperFrequency', eval(upperBand.value));
    sessionStorage.setItem('viewChanges', false);
    sessionStorage.setItem('transforms', ['Linear', 'Linear', 'Linear']);

	// Saving each array into one big array
    var allRadioInputs = [redRadioInputs, greenRadioInputs, blueRadioInputs];
	


    // Create an event handler for each button to go to the buttonMain function
	for (var i = 0; i < numIndices; i++) {
        redRadioInputs[i].onclick = buttonMain;
        greenRadioInputs[i].onclick = buttonMain;
        blueRadioInputs[i].onclick = buttonMain;
    }

    function lowerBandOnChange() {
    	sessionStorage.lowerFrequency = eval(lowerBand.value);
    	renormalise.disabled = true;
    }

    function upperBandOnChange() {
    	sessionStorage.upperFrequency = eval(upperBand.value);
    	renormalise.disabled = true;
    }

    // event handler for slider
	function sliderOnChange(target, type, bubbles, cancelable) {
		var sliderValue = target.srcElement.value;
		//console.log("Slider change", target, sliderValue);

		// assuming a scale of 60.0 s/px
		var second = Math.floor(sliderValue * 60);

		var url = generateLink(second);
		goToButton.innerHTML = "Go to: " + sliderValue;
		goToButton.href = url;
		
		if (!url) {
			goToButton.removeAttribute("href");
		}
	}

	function generateLink(startOffset) {

		var audioRecordings = [
		//in javascript, months start from 0 so 1 is 0
				{id: 255206, recorded_at: new Date(2013, 11, 12, 0, 0, 0)},
				{id: 255208, recorded_at: new Date(2013,11, 12, 6, 50, 0)},
				{id: 255211, recorded_at: new Date(2013,11, 12, 13, 36, 0)},
				{id: 255213, recorded_at: new Date(2013, 11, 12, 20, 22, 0)}
			];
  
		var midnight = new Date(2013, 11, 25, 0, 0, 0);
		var offset = new Date((+midnight + (startOffset * 1000)));

		var i;
		for (i = 0; i < audioRecordings.length; i ++) {
			var low = +(audioRecordings[i].recorded_at);
			var high = +((audioRecordings[i+1] || {recorded_at: new Date(2020, 0, 1)}).recorded_at);

			if (+offset >= low && +offset < high) {
				break;
			}
		}
		
		if (i >= audioRecordings.length) {
			console.warn("Cannot link to:", startOffset);
			return undefined;
		}

		var audioRecordingId = audioRecordings[i].id;
		startOffset = (+offset - +(audioRecordings[i].recorded_at)) / 1000;

		console.info ("Debug link:", audioRecordingId, startOffset);
		return "https://www.ecosounds.org/listen/" + audioRecordingId + "?start=" + startOffset.toFixed(0);
	}


// Setting up ALL INDICES:
	var bigData = [];
   	var address = "data/";
	var prefix = "WBH12HOURS-20160403__Towsey.Acoustic.";

	//var prefix = "BICK_20131212__Towsey.Acoustic.";
	
	var suffix = ".csv";
	var indices = [ "ACI", "ENT", "EVN", "BGN", "POW", "CVR", "SPT", "RHZ" , "RVT"];
	var titles = [];
	var allMax = [];
	var allMin = [];
	var allRescaleObjects = [];


	// Parse all data before you actually do anything! :)

	for (var i = 0; i < indices.length; i++) {
		titles[i] = (address + prefix + indices[i] + suffix);

		blah(i);

		function blah(i) {
	    	return d3.text(titles[i], "text/csv", function(csv) {
	        	var data = d3.csv.parseRows(csv);
	        	appendMaxMinSpliceBigData(data, i);
			});
    	}

		writeTextValues(i);
	}

	function appendMaxMinSpliceBigData(data, index) {

		var min = Infinity;
		var max = -Infinity;

		data.splice(0, 1);
		
		for (var i = 0; i < data.length; i++) {
			data[i].splice(0, 1);
			for (var j = 0; j < data[i].length; j++) {
				data[i][j] = Number( data[i][j] );
				min = min > data[i][j] ? data[i][j] : min;
				max = max < data[i][j] ? data[i][j] : max;
			}
		}

		var object = {
						dataConverted: data, 
						max: max, 
						min: min
					};

		bigData[index] = object;
		
		standardMin[index].innerHTML = object.min.toFixed(2).toString();
		standardMax[index].innerHTML = object.max.toFixed(2).toString();

	}

	function writeTextValues( index ) {
		//normalisedMinimum = 0;
		//normMin[ index ].innerHTML = normalisedMinimum.toFixed(2).toString();


		//normalisedMaximum = 1;
		//normMax[ index ].innerHTML = normalisedMaximum.toFixed(2).toString();

	}


	var chooseCookieMode = Array.from( document.querySelectorAll( ".configuration" ) );
	var configurationSettings = document.querySelector( "#configuration" );
	configurationSettings.onchange = compareListToValues;


	function compareListToValues(){
		if(configurationSettings.value === configurationSettings[0].value) {
	    	// Load Preset Options
	    	preconfigure(0);
	    }
	    if(configurationSettings.value === configurationSettings[1].value) {
	    	// Save Current Selection
	    	preconfigure(1);
	    }
	    if(configurationSettings.value === configurationSettings[2].value) {
	    	// Do not Save/Load
	    	preconfigure(2);
	    }
	}


	function preconfigure( configurationNumber ) {
		console.log( configurationNumber );
    	
    	// If we are writing our own inputs:
    	if( configurationNumber === 0 || configurationNumber === 1) {

    		// Choose if we are saving or not...
    		saving = ( configurationNumber === 1 ); 

    		// Enable all buttons:
    		allRadioInputs.forEach( function( colorInput, column ) {
    			colorInput.forEach( function( radioButton, row ) {
    				radioButton.disabled = false;
    			} );
    		} );

    	}

    	// If we're loading preset inputs:
    	if( configurationNumber === 2 ) {
    		
    		saving = false;

			// Write pre-saved inputs to document
    		presetValues.forEach( function( JSONdata, row ) {
    			
    			console.log( typeof JSONdata.max.toString(), maxText[row] );

	    		maxText[row].value = ( JSONdata.max != " " ) ? JSONdata.max : 5;
	    		minText[row].value = ( JSONdata.min != " " ) ? JSONdata.min : 5;

    			JSONdata.buttons.forEach( function( buttonChecked, column ) {
    				allRadioInputs[column][row].checked = buttonChecked;

    				// Update allColors for the disable() function to work
    				allColors[column] = ( buttonChecked ) ? row : allColors[column];
    			} );

    		} );

    		disable();
    	}
	}


    function buttonClicking(i) {
    	console.log( buttonSelect );

		allRadioInputs.forEach(function(columnOfInputs, row) {
			columnOfInputs.forEach(function(radioButton, column) {
				radioButton.checked = buttonSelect[row][column]
				radioButton.disabled = true;

				if(radioButton.checked) {
					allColors[row] = column;
				}

			});
		});
    }

	
	// AHA! TAKE THAT WEIRDO FUNCTIONS	
	// I GOT YOU FIGURED OUT
	// Now for the render button...

	var eachRow = Array.from( document.querySelectorAll( ".row" ) );
	var popupArray = [ null, null, null, null, null, null, null ];
	var popupContent = [ "Ias;ldkjfa;sdlkn.,mgz.xm,cvn;kjas;dfkhalkjhgas", "asdlkjhgbmnadb,zxclkvjhadsf", "asdlkjfh", "asdlkfjh", "aldkfjha:", "asdlkjhg", "asdlkjgh" ];


    function buttonMain(event) {
		//The event that called this function can be saved as an input if needed
		// This will store the entire HTML input tag of the button that was clicked (which gives us access to id, class, etc.) 
		var target = event.target;

		//popupsFull = Array.from( document.querySelectorAll( ".popup" ) ).length === 3;


		
        var columnOldRow = trackColor( target ); // Good
		var row = overwriteColumnIn_allColors( columnOldRow[0], target ); // Good
		clickSelectedButtonIn_column_row( columnOldRow[0], row ); // Good
		eraseCommonRow( columnOldRow[0], row );

        updateAllIndices( row );
        //addPopup();

        disable();
        // Update the sessionStorage
        sessionStorage.indices = allColors;
    }

    function addPopup() {
    	popupArray.forEach( function( popup, row ) {
    		// Check if that row has been pressed
    		var pressed = allColors.indexOf( row ) != -1;
    		// Add pop up
    		if( popup === null && pressed ) {
    			var newBold = document.createElement( "b" );
    			var newDiv = document.createElement( "div" );
    			newDiv.innerHTML = popupContent[row];
    			eachRow[row].appendChild( newBold );
    			newBold.appendChild( newDiv );
    			popupArray[row] = 0;
    		}

    		// Remove unused pop up:
    		if( popup != null && !pressed ) {
    			var boldArray = Array.from( eachRow[row].getElementsByTagName( "b" ) );
    			var oldBold = boldArray[row];
    			popupArray[row] = null;
    			eachRow[row].removeChild( oldBold );

    		}

    	} );
    }

	

	function trackColor(target){
		// If the button's input tags contain the word "red", fixate on column 0. 
		// Else, keep "column" as what it was before.
		var column;

        column = target.classList.contains("red") ? 0 : column;
        column = target.classList.contains("green") ? 1 : column;
        column = target.classList.contains("blue") ? 2 : column;
		
		// This saves the last button that was clicked in the column we're looking at
        var oldRow = allColors[column];
		
		return [column, oldRow];
	}
	
	
	function overwriteColumnIn_allColors( column, target ){
		// Tracks what column was clicked, and what row the target is in
        var row = allRadioInputs[column].indexOf(target);

        allColors[column] = row;
		allRadioInputs[column][row].checked = true;
		
		return row;
	}
	
	function clickSelectedButtonIn_column_row( column, row ){
		// This successfully overwrites the buttons checked in the column
        allRadioInputs[column].forEach(function(element, index){
            element.checked = element.checked && index === row;
        });
	}
	
	function eraseCommonRow( targetColumn, row ){
		
		
		for( var i = 0; i < allRadioInputs.length; i++ ){
			
			if( i === targetColumn ){
				continue;
			}
			
			index = allRadioInputs[i].findIndex( function( button, index ){
				return button.checked;
			} );
			
			if( row === index ){
				allRadioInputs[i][index].checked = false;
			}	
		}
	}
	

    function updateAllIndices(row) {

        allRadioInputs.forEach(function (columnOfInputs, column) {
            allColors[column] = columnOfInputs.findIndex( function( button, index ){
                return button.checked;
            });
            if( allColors[column] === -1 ){
                allColors[column] = null;
            }
        });
    }
    

    function disable(){
    	// Counting how many buttons have been clicked
		var allThreeButtons = allColors.indexOf(null) === -1;
		// Momentarily disable everything
		for(var i = 0; i < transforms.length; i++) {
			minText[i].disabled = true;
			maxText[i].disabled = true;
			transforms[i].disabled = true;
		}
		//Enable the rows that are listed in allColors
		for(var i = 0; i < allColors.length; i++) {
			var index = allColors[i];
			if( index === null ) {
				continue;
			}
			minText[index].disabled = false;
			maxText[index].disabled = false;
			transforms[index].disabled = false;
		}
		renderButton.disabled = !(allThreeButtons);
    }
	
	function chooseCSV () {
		getData();
		renormalise.disabled = false;
		sessionStorage.transforms = updateTransformsSelection();
		deleteSecondCanvas();
		deleteVerticalAxis();
		console.log(sessionStorage.transforms);
	}		
	
	function getData(){
        var objects = [];   
        allColors.forEach(function (index) {		
        	var data = bigData[index];
        	append(data, objects);
        });         
    }

    function deleteSecondCanvas() {
    	smallerCanvas.style.height = "0px";
    	smallerCanvasHolder.style.height = "0px";
    	secondxAxisDiv.innerHTML = "";
    	secondxAxisDiv.style.height = "0px";
    }

    // Takes the transform selected in order and updates the session storage object with that information
    // This information will be used in rendering the image data in the next page
    function updateTransformsSelection() {
    	var information = [];
    	allColors.forEach(function (index) {
    		information[index] = transforms[index].value;
    	});
    	return information;
    }
 
 	// Putting all data objects into an array
 	// Putting all corresponding data subset objects into an array
    function append (data, objects) {
        objects.push(data);
        if (objects.length === 3) {
            imageMain(objects);
            objects.forEach(function (object, index) {
            	dataSubsets[index] = extractDataSubset(object, index);
            	standardMin[index].innerHTML = dataSubsets[index].min.toFixed(2).toString();
            	standardMax[index].innerHTML = dataSubsets[index].max.toFixed(2).toString();
            });
            console.log(dataSubsets, objects);
        }         
    }

    function viewNormalisedImage () {
    	var holder = document.querySelector("#smallerCanvasHolder");
    	var secondCanvas = document.querySelector("#smallerCanvas");
    	secondContext = secondCanvas.getContext("2d");
    	resizeCanvas(secondCanvas, secondContext, holder);
    	renormalise.disabled = true;
    	renormaliseArray();
    	var transformParameters = transformsParameters();
		var arrayOfImageDatas = transform(dataSubsets, transformParameters[0], transformParameters[1], transformParameters[2]);
    	loadSmallImage(secondCanvas, secondContext, arrayOfImageDatas);
    	addHorizontalAxis();
    	addVerticalAxis();
    }

    function loadSmallImage (secondCanvas, secondContext, arrayOfImageDatas) {
    	const highestFrequency = 12000;
    	var smallerImageData = secondContext.createImageData(secondContext.width, secondContext.height);
    	var byteIndex;
    	var verticalIndex;
    	var offset = Math.floor(canvas.height * eval(lowerBand.value) / highestFrequency);
    	for(var row = 0; row < secondCanvas.height; row++) {
    		verticalIndex = secondCanvas.height - row + offset;
    		for(var column = 0; column < secondCanvas.width; column++) {
    			byteIndex = 4 * (secondCanvas.width * row + column);
    			smallerImageData.data[byteIndex + 0] = 255 * arrayOfImageDatas[0][column][verticalIndex];
    			smallerImageData.data[byteIndex + 1] = 255 * arrayOfImageDatas[1][column][verticalIndex];
    			smallerImageData.data[byteIndex + 2] = 255 * arrayOfImageDatas[2][column][verticalIndex];
    			smallerImageData.data[byteIndex + 3] = 255;
    		}
    	}
    	secondContext.putImageData(smallerImageData, 0, 0);
    }

    function addVerticalAxis () {
    	var portionOfRange = (eval(sessionStorage.upperFrequency) - eval(sessionStorage.lowerFrequency)) / 12000;
    	var portionCoveringHigh = eval(sessionStorage.upperFrequency) / 12000;
    	var portionCoveringLow = eval(sessionStorage.lowerFrequency) / 12000;
        var spectrogramHeight = Math.floor(255 * portionOfRange);
        var axisHolder = document.querySelector("#secondyAxis");
        var secondBuffer = document.querySelector("#secondBuffer");
        var numTicks = (spectrogramHeight < 200) ? 3 : 5;
        secondBuffer.style.width = "20px";
        secondBuffer.style.height = "10px";
        axisHolder.style.width = "150px";
        axisHolder.style.height = spectrogramHeight.toString() + "px";
        var verticalAxis = d3.svg.axis();
        var svgPlaced = d3.select(axisHolder)
                                .append("svg");
        var axisScale = d3.scale.linear()
                                .domain([12000 * portionCoveringHigh, 12000 * portionCoveringLow])
                                .range([0, 255 * portionOfRange]);
        var scaledAxis = verticalAxis.scale(axisScale)
                                .orient("right")
                                .ticks(numTicks);
        var axis = svgPlaced.attr("class", "yaxis")
                                .attr("width", 70)
                                .attr("height", Math.floor(portionOfRange * 270));
        var groupedAxis = axis.append("g");
        groupedAxis.call(scaledAxis);
    }

    function deleteVerticalAxis() {
    	var axisHolder = document.querySelector("#secondyAxis");
    	var secondBuffer = document.querySelector("#secondBuffer");
        secondBuffer.style.width = "0px";
        secondBuffer.style.height = "0px";
    	axisHolder.style.height = "0px";
    	axisHolder.style.width = "0px";
    	axisHolder.innerHTML = "";
    }


    function addHorizontalAxis() {
        var hoursInDay = 24;
        var domainValue = 0;
        var domainValues = [];
        var rangeValue = 0;
        var rangeValues = [];
        for (var timeSlot = 0; timeSlot < hoursInDay + 1; timeSlot++) {
            domainValues[timeSlot] = domainValue;
            rangeValues[timeSlot] = rangeValue + 100;
            domainValue++;
            rangeValue += 60;
        }
        console.log(domainValues, rangeValues);
        secondxAxisDiv.style.width = "1600px";
        secondxAxisDiv.style.height = "30px";
        var svgContainer = d3.select(secondxAxisDiv)
                                    .append("svg")
                                    .attr("width", 1600)
                                    .attr("height", 30);
        var axisScale1 = d3.scale.linear()
                                    .domain([0, 1400])
                                    .range([100, 2000]);
        var axisScale = d3.scale.ordinal()
                                    .domain(domainValues)
                                    .range(rangeValues);
        var xAxis = d3.svg.axis().scale(axisScale).orient("bottom");
        var xAxisGroup = svgContainer.append("g")
                                    .call(xAxis);
    }


    function resizeCanvas(secondCanvas, secondContext, holder) {
    	const highestFrequency = 12000;
    	var top = eval(upperBand.value) / highestFrequency;
    	var bottom = eval(lowerBand.value) / highestFrequency;
    	var proportionShown = top - bottom;
    	holder.style.height = Math.floor(canvas.height * proportionShown).toString() + "px";
   		secondCanvas.style.height = holder.style.height;
   		secondCanvas.parentElement.style.height = holder.style.height; 
   		secondCanvas.height = Math.floor(canvas.height * proportionShown);
   		secondCanvas.width = canvas.width;
   		secondContext.height = secondCanvas.height;
   		secondContext.width = secondCanvas.width;
    }

    // 
    function renormaliseArray () {
    	var normalisedArray;
    	dataSubsets.forEach(function (dataSubset, subsetNumber) {
    		normalisedArray = [];
    		dataSubset.dataConverted.forEach(function (rowOfNumbers, rowNumber) {
    			normalisedArray[rowNumber] = [];
    			rowOfNumbers.forEach(function (number, columnNumber) {
    				normalisedArray[rowNumber][columnNumber] = (number - dataSubset.min) / (dataSubset.max - dataSubset.min);
    			});
    		});
    		dataSubset.dataConverted = normalisedArray;
    	});
    }

    function extractDataSubset (object, index) {
    	var highestFrequency = 12000;
    	var lowerPortion = eval(sessionStorage.lowerFrequency) / highestFrequency;
    	var upperPortion = eval(sessionStorage.upperFrequency) / highestFrequency;
    	var upperIndex = Math.floor(canvas.height * upperPortion);
    	var lowerIndex = Math.floor(canvas.height * lowerPortion);
    	var matrix = [];
    	var min = Infinity;
    	var max = -Infinity;
    	for (var i = 0; i < object.dataConverted.length; i++) {
    		matrix[i] = [];
    		for(var j = lowerIndex; j < upperIndex; j++) {
    			matrix[i][j] = object.dataConverted[i][j];
    			min = matrix[i][j] < min ? matrix[i][j] : min;
    			max = matrix[i][j] > max ? matrix[i][j] : max;
    		}
    	}
    	var newDataObject = {
			    			dataConverted: matrix,
			    			max: max,
			    			min: min,
			    			start: lowerIndex,
			    			end: upperIndex
			    		};
		return newDataObject;
    }

 /*
 HEY EVERYONE! IMAGE MAIN STARTS HERE
 WOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO
 */
     
    function imageMain (objects){
    	if(saving) {
    		writeDataToJSON();
    	}
        var rescaledObjects = rescale(objects);
        //var transformParameters = transformsParameters();
		//var transformedArray = transform(rescaledObjects, transformParameters[0], transformParameters[1], transformParameters[2]); // This function just needs to return an array of arrays to work
        var transformedArray = [];
        rescaledObjects.forEach(function (image, index) {
        	transformedArray[index] = image.dataConverted;
        });

        loadImage(canvas, context, transformedArray);
    }


    function writeDataToJSON () {
    	presetValues.forEach(function (JSONdata, row) {
    		//Text Inputs
    		JSONdata.min = minText[row].value;
    		JSONdata.max = maxText[row].value;
    		//Buttons
    		JSONdata.buttons.forEach(function (button, column) {
    			button = allRadioInputs[column][row].checked;

    			// Dodgyness here...
    			presetValues[row].buttons[column] = button;
    		});
    	});
    	var storageString = JSON.stringify(presetValues);
    	sessionStorage.clear()
    	sessionStorage.inputs = storageString;
    }
     

    function rescale (rescaleObjects) {
		var objectArray = [];
		var changing = eval(sessionStorage.viewChanges);
        for (var k = 0; k < rescaleObjects.length; k++) {
        	var array = [];
        	rescaleObjects[k] = bigData[allColors[k]];
            var matrix = rescaleObjects[k].dataConverted;
            var typedMaxValue = maxText[ allColors[k] ].value;
            var typedMinValue = minText[ allColors[k] ].value;
			var minimum = rescaleObjects[k].min;
			var maximum = rescaleObjects[k].max;
			var zero = 0;
			var one = 1;
			if(Number(typedMaxValue) < maximum) {
				if(typedMaxValue != "") {
					//normMax[ allColors[k] ].innerHTML = ( ( Number( typedMaxValue ) - rescaleObjects[k].min ) / ( rescaleObjects[k].max - rescaleObjects[k].min ) ).toFixed(2).toString();
					maximum = Number(typedMaxValue);
				}
			}
			if(Number(typedMinValue) > minimum) {
				if(typedMinValue != "") {
					//normMin[ allColors[k] ].innerHTML = (Number((typedMinValue) - rescaleObjects[k].min) / (rescaleObjects[k].max - rescaleObjects[k].min)).toFixed(2).toString();
					minimum = Number(typedMinValue);
				}
			}
            for (var i = 0; i < rescaleObjects[0].dataConverted.length; i++) {
            	array[i] = [];
                for (var j = 0; j < rescaleObjects[0].dataConverted[i].length; j++) {
                    if(matrix[i][j] >= minimum && matrix[i][j] <= maximum) {
						array[i][j] = (matrix[i][j] - minimum) / (maximum - minimum);
                    }
                    if(matrix[i][j] > maximum) {
                    	array[i][j] = 1;
                    }
                    if(matrix[i][j] < minimum) {
                    	array[i][j] = 0;
                    }
                }
            }
            var blah = { 
            	dataConverted: array, 
            	max: maximum, 
            	min: minimum  
            };
            objectArray[k] = blah;
        }
        return objectArray;
    }
	

    function transformsParameters () {

    	// Initialise the parameters that we recommend for good practice
    	// Order is y0, x0, dilationX, dilationY
    	var logarithmicParameters = [1.2, -0.3, 1, 1];
    	var exponentialParameters = [0, 0, -5, 1 / 150];
    	var sigmoidParameters = [1, 0.5, 1, 1 ];

    	// Return as an array
    	return [logarithmicParameters, exponentialParameters, sigmoidParameters];
    }
	
	function viewChangesCallback () {
    	sessionStorage.viewingChanges = viewChanges.checked;
    }

	function transform (rescaledObjects, logarithmicParameters, exponentialParameters, sigmoidParameters) {
		var y0 = 0;
		var x0 = 1;
		var dilationX = 2;
		var dilationY = 3;
		var transformedArray = [];
		for (var k = 0; k < rescaledObjects.length; k++){
			var chosenTransform = allColors[k];
			var maximum = rescaledObjects[k].max;
			for (var i = 0; i < rescaledObjects[k].dataConverted.length; i++){
				for (var j = 0; j < rescaledObjects[k].dataConverted[i].length; j++){
					if (selects[chosenTransform].value === "Log") {
					rescaledObjects[k].dataConverted[i][j] =  logarithmicParameters[dilationY] * Math.log(logarithmicParameters[dilationX] * rescaledObjects[k].dataConverted[i][j] - logarithmicParameters[x0]) + logarithmicParameters[y0];
					}
					if (selects[chosenTransform].value === "Exponential") {
					rescaledObjects[k].dataConverted[i][j] = exponentialParameters[dilationY] * Math.exp(exponentialParameters[dilationX] * rescaledObjects[k].dataConverted[i][j] - exponentialParameters[x0]);
					}
					if (selects[chosenTransform].value === "Sigmoid") {
						rescaledObjects[k].dataConverted[i][j] = sigmoidParameters[dilationY] / (1 + Math.exp(-10 * (rescaledObjects[k].dataConverted[i][j] - sigmoidParameters[x0]))) + sigmoidParameters[y0];
					}
					if (rescaledObjects[k].dataConverted[i][j] < 0) {
						rescaledObjects[k].dataConverted[i][j] = 0;
					}
					if (rescaledObjects[k].dataConverted[i][j] > 1) {
						rescaledObjects[k].dataConverted[i][j] = 1;
					}
				}
			}
			transformedArray[k] = (rescaledObjects[k].dataConverted);
		}
		return transformedArray;
	}
	

    function loadImage (receivedCanvas, receivedContext, transformedArray) {

    	var lowerBound = eval(sessionStorage.lowerFrequency);
    	var upperBound = eval(sessionStorage.upperFrequency);
    	var highestFrequency = 12000;
    	var lowerPortion = lowerBound / highestFrequency;
    	var upperPortion = upperBound / highestFrequency;
    	var base = viewChanges.checked ? (receivedCanvas.height - Math.floor(upperPortion * receivedCanvas.height)) : 0;
    	height = viewChanges.checked ? (receivedCanvas.height - Math.floor(lowerPortion * receivedCanvas.height)) : receivedCanvas.height;
		
		console.log("Base: " + base);
		console.log("Height: " + height);


		for (var k = 0; k < transformedArray.length; k++) {		
	        for (var i = 0; i < width; i++) {
	            for (var j = base; j < height; j++){
	                var y = receivedCanvas.height - j;
	                var byteIndex =  (j * (width * 4)) + (i * 4); // Calculates the offset of the "R" element in each pixel
	                imageData.data[byteIndex + k] = 255 * (transformedArray[k][i][y]);
	                imageData.data[byteIndex + 3] = 255; // alpha
	            }
	        }
	    }
        receivedContext.putImageData(imageData, 0, 0);
    }


    function emptyCanvas () {
    	console.log(imageData.data.length);
    	for (var byte = 0; byte < imageData.data.length; byte++) {
    		imageData.data[byte] = 0;
    	}
    	console.log(imageData.data);
    	context.putImageData(imageData, 0, 0);
    }
}

