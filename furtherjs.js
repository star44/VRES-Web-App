window.addEventListener("load", further, false);
function further() {

    // Get the frequency bounds chosen in the last page
    var lowFrequency = sessionStorage.lowerFrequency;
    var highFrequency = sessionStorage.upperFrequency;
    
    // Some 'defines'
    var largestFrequency = 12000;
    var largestCanvasHeight = 256;
    var numberOfIndices = 3;
    
    // Calculating portions so that offsets can be calculated when rendering the image
    var portionCoveringHigh = highFrequency / largestFrequency;
    var portionCoveringLow = lowFrequency / largestFrequency;
    var portionOfRange = (highFrequency - lowFrequency) / largestFrequency;

    var lowerFreqPara = document.querySelector("#furtherjsLower");
    var upperFreqPara = document.querySelector("#furtherjsUpper");

    lowerFreqPara.innerText = lowFrequency.toString();
    upperFreqPara.innerText = highFrequency.toString();

    var canvasObjects = [];
    var imageData = [];
    var bytesPerPixel = 4;
    var allCanvases = Array.from(document.querySelectorAll(".spectroCanvases"));
    var allCanvasHolders = Array.from(document.querySelectorAll(".spectroCanvasHolder"));
    var allCanvasRows = Array.from(document.querySelectorAll(".canvasRow"));
    var allSliderHolders = Array.from(document.querySelectorAll(".slider"));
    var allSliderBuffers = document.querySelectorAll(".buffer");
    var allAxisBuffers = document.querySelectorAll(".axisBuffer");
    var allGotoHolders = document.querySelectorAll(".gotoLinkHolder");
    var allVerticalAxisHolders = document.querySelectorAll(".yAxis");

    var xAxisDivs = Array.from(document.querySelectorAll(".xAxis"));
    var yAxisSpans = Array.from(document.querySelectorAll(".yAxis"));
    
    var numPixelsInCanvas = allCanvases[0].height * allCanvases[0].width;
    var numBytesInCanvas = numPixelsInCanvas * bytesPerPixel;
    
    allCanvasHolders.forEach(function(canvasHolder) {
        canvasHolder.onclick = canvasHolderCallback;
    });

    // WILL need to change how the directory is saved when there is more days to be plotted
    var address = "data/";
    var prefix;
    var prefix1 = "WBH12HOURS-20160"
    var prefix3 = "03__Towsey.Acoustic.";
    var suffix = ".csv";
    var indices = ["ACI", "ENT", "EVN", "BGN", "POW", "CVR", "SPT", "RHZ", "RVT"];
    // Save indices chosen in previous page as a free variable
    var indicesSelected = takeIndicesFromSessionStorage(indices);

    // Update the height of the canvas based on what frequency range was chosen, and parse/plot the indices
    allCanvases.forEach(function(canvas, day) {
        prefix = prefix1 + day.toString() + prefix3;
        canvas.height = largestCanvasHeight * portionOfRange;
        var context = canvas.getContext("2d");
        context.width = canvas.width;
        context.height = canvas.height;
        imageData[day] = context.createImageData(context.width, context.height);
        canvasObjects[day] = {
            day: day,
            canvas: canvas,
            context: context,
            imageData: imageData[day],
            selected: false
        };
        parsing(address, prefix, indices, indicesSelected, suffix, canvasObjects[day]);
    });
    
    // Takes the event, handles getting rid of all pop ups, and adding in a new one at desired location
    function canvasHolderCallback(event) {
        var selectedCanvasHolder = event.target;
        var canvasNumber = allCanvases.indexOf(selectedCanvasHolder);
        // If this canvas has already been selected
        if (canvasObjects[canvasNumber].selected) {
            unhighlightAllCanvases();
            deleteAllHorizontalAxes();
            deleteAllVerticalAxes();
            deleteAllSliders();
            deleteAllGotoButtons();
        }
        // If the canvas was not already highlighted
        else {
            unhighlightAllCanvases();
            highlightCanvas(canvasNumber);
            deleteAllVerticalAxes();
            deleteAllHorizontalAxes(canvasNumber);
            addVerticalAxis(canvasNumber);
            addHorizontalAxis(canvasNumber);
            deleteAllSliders();
            deleteAllGotoButtons();
            addSlider(canvasNumber);
            deselectPreviousCanvas();
        }
        canvasObjects[canvasNumber].selected = !canvasObjects[canvasNumber].selected;
    }

    function deleteAllGotoButtons () {
        allGotoHolders.forEach(function (gotoHolder) {
            gotoHolder.innerHTML = "";
            gotoHolder.style.width = "0px";
            gotoHolder.style.height = "0px";
        });
    }

    function deselectPreviousCanvas () {
        var previousCanvasNumber = canvasObjects.findIndex(function (canvasObject) {
                                                                return canvasObject.selected;
                                                            });
        if (previousCanvasNumber != undefined && previousCanvasNumber != -1) {
            canvasObjects[previousCanvasNumber].selected = false;
        }
    }

    function addSlider(canvasNumber) {
        var sliderHolder = allSliderHolders[canvasNumber];
        var slider = document.createElement("input");
        goToButton = document.createElement("a");
        allGotoHolders[canvasNumber].style.height = "30px";
        allGotoHolders[canvasNumber].style.width = "80px";
        allGotoHolders[canvasNumber].appendChild(goToButton);
        sliderHolder.style.height = "30px";
        sliderHolder.style.width = "1600px";
        allSliderBuffers[canvasNumber].style.width = "50px";
        slider.type = "range";
        slider.style.width = "1440px";
        sliderHolder.appendChild(slider);
        slider.onchange = sliderOnChange;
    }


    function deleteAllSliders() {
        allSliderHolders.forEach(function (sliderHolder, canvasNumber) {
            sliderHolder.innerHTML = "";
            sliderHolder.style.height = "0px";
            sliderHolder.style.width = "0px";
            allSliderHolders[canvasNumber].style.width = "0px";
        });
    }
    
    function unhighlightAllCanvases() {
        allCanvasRows.forEach(function(canvasRow) {
            canvasRow.style.backgroundColor = "";
        });
    }

    function highlightCanvas(canvasNumber) {
        allCanvasRows[canvasNumber].style.backgroundColor = "lightgray";
    }

    function deleteAllHorizontalAxes() {
        xAxisDivs.forEach(function (xAxisDiv) {
            xAxisDiv.innerHTML = "";
            xAxisDiv.style.width = "0px";
            xAxisDiv.style.height = "0px";
        });
    }

    function deleteAllVerticalAxes () {
        allVerticalAxisHolders.forEach(function (axisHolder) {
            axisHolder.innerHTML = "";
            axisHolder.style.width = "0px";
            axisHolder.style.height = "0px";
        });
    }

    // function resizeCanvasRow (canvasNumber) {
    //     var spectrogramHeight = Math.floor(255 * portionOfRange);
    //     var rowHeight = spectrogramHeight + 100;
    //     //allCanvasRows[canvasNumber].style.height = rowHeight.toString() + "px";
    //     allCanvasRows.forEach(function (canvasRow) {
    //         canvasRow.style.height = rowHeight.toString() + "px";
    //     });
    // }

    function addVerticalAxis (canvasNumber) {
        var spectrogramHeight = Math.floor(255 * portionOfRange);
        var numTicks = (spectrogramHeight < 200) ? 3 : 5;
        allVerticalAxisHolders[canvasNumber].style.width = "50px";
        allVerticalAxisHolders[canvasNumber].style.height = spectrogramHeight.toString() + "px";
        var verticalAxis = d3.svg.axis();
        var svgPlaced = d3.select(allVerticalAxisHolders[canvasNumber])
                                .append("svg");
        var axisScale = d3.scale.linear()
                                .domain([12000 * portionCoveringHigh, 12000 * portionCoveringLow])
                                .range([0, 255 * portionOfRange]);
        var scaledAxis = verticalAxis.scale(axisScale)
                                .orient("right")
                                .ticks(numTicks);
        var axis = svgPlaced.attr("class", "yaxis")
                                .attr("width", 50)
                                .attr("height", 260 * portionOfRange);
        var groupedAxis = axis.append("g");
        groupedAxis.call(scaledAxis);
    }

    function addHorizontalAxis (canvasNumber) {
        var xAxisDiv = xAxisDivs[canvasNumber];
        var hoursInDay = 24;
        var domainValue = 0;
        var domainValues = [];
        var rangeValue = 0;
        var rangeValues = [];
        for (var timeSlot = 0; timeSlot < hoursInDay + 2; timeSlot++) {
            domainValues[timeSlot] = domainValue;
            rangeValues[timeSlot] = rangeValue + 100;
            domainValue++;
            rangeValue += 60;
        }
        allAxisBuffers[canvasNumber].style.width = "30px";
        allAxisBuffers[canvasNumber].style.height = "10px";
        xAxisDiv.style.width = "1500px";
        xAxisDiv.style.height = "30px";

        var horizontalAxis = d3.svg.axis();
        var svgPlaced = d3.select(xAxisDiv).append("svg");
        var axisScale = d3.scale.ordinal()
                                .domain(domainValues)
                                .range(rangeValues);
        var scaledAxis = horizontalAxis.scale(axisScale)
                                .orient("down");
        var axis = svgPlaced.attr("class", "xaxis")
                            .attr("width", 1500)
                            .attr("height", 30);
        var groupedAxis = axis.append("g");
        groupedAxis.call(scaledAxis);
    }


    // Should take a particular day. Using the indices saved in session storage,
    // This function should pass the data loaded for those particular indices for the given day
    // And put them on the canvas assigned to that given day.
    function parsing(address, prefix, indices, indicesSelected, suffix, canvasObject) {
        var titles = [];
        var bigData = [];
        // Append each index's image data to the bigData array of objects
        indicesSelected.forEach(function(index) {
            parseDataWithD3(index);
        });
        // Input: Integer value that represents the index to be drawn
        // Process: Parses CSV file, normalises Image Data, then draws it on canvas after ensuring all indices have been parsed
        function parseDataWithD3(index) {
            titles[index] = (address + prefix + indices[index] + suffix);
            return d3.text(titles[index], "text/csv", function(csv) {
                // Save the image data matrix to this local variable
                var data = d3.csv.parseRows(csv);
                bigData[index] = appendMaxMinSpliceBigData(data, index);
                bigData[index].dataConverted = normaliseArray(bigData[index]);
                var noUndefinedElements = -1 === bigData.findIndex(function(element) {
                    return element === undefined;
                });
                var definedElements = numberOfDefinedElements(bigData);
                // Check if we have all our data, and ensuring that we don't leave any elements undefined
                if (definedElements === numberOfIndices) {
                    var transformParameters = transformsParameters();
                    var arrayOfImageMatrices = transform(bigData, transformParameters[0], transformParameters[1], transformParameters[2]);
                    bigData.forEach(function (dataObject, index) {
                        dataObject.dataConverted = arrayOfImageMatrices[index];
                    });
                    putDataOnCanvas(bigData, canvasObject);
                }
            });
        }
    }

    // Inputs: Array of objects
    // Outputs: Number of elements of that object that are defined
    function numberOfDefinedElements(bigData) {
        var count = 0;
        bigData.forEach(function(dataObject) {
            count++;
        });
        return count;
    }

    // Input: Array of objects containing min, max, and image data
    // Process: Loop through every pixel on the canvas, setting the RGB elements to their corresponding values in the image data
    function putDataOnCanvas(bigData, canvasObject) {
        var columnOffset;
        var rowOffset;
        var byteIndex;
        var canvas = allCanvases[0];
        var byteNumber;
        for(var row = 0; row < canvas.height; row++) {
            rowOffset = row * canvas.width * bytesPerPixel;
            for(var column = 0; column < canvas.width; column++) {
                columnOffset = column * bytesPerPixel;
                byteIndex = rowOffset + columnOffset;
                byteNumber = 0;
                bigData.forEach(function(dataObject) {
                    canvasObject.imageData.data[byteIndex + byteNumber] = 256 * dataObject.dataConverted[column][canvas.height - row];
                    byteNumber++;
                });
                canvasObject.imageData.data[byteIndex + 3] = 256;
            }
        }
        canvasObject.context.putImageData(canvasObject.imageData, 0, 0);
    }


    // Input: Object that contains the Image data, min and max
    // Output: Image data after it has been normalised
    function normaliseArray(dataObject) {
        dataObject.dataConverted.forEach(function(row, rowNumber) {
            row.forEach(function(element, columnNumber) {
                dataObject.dataConverted[rowNumber][columnNumber] = (element - dataObject.min) / (dataObject.max - dataObject.min);
            });
        });
        return dataObject.dataConverted;
    }

    // Input: Indices as string (from session storage)
    // Output: Array of indices converted to integers
    function takeIndicesFromSessionStorage(indices) {
        return eval("[" + sessionStorage.indices + "]");
    }


    // Inputs: Image data matrix with first row and first column being labels. All elements are strings
    // Outputs: An object containing: data matrix with only numbers (in double form), mins and maxes
    function appendMaxMinSpliceBigData(data, index) {
        var min = Infinity;
        var max = -Infinity;
        var lowerPortion = Math.floor(256 * eval(sessionStorage.lowerFrequency) / 12000);
        var upperPortion = 256 - Math.floor(256 * eval(sessionStorage.upperFrequency) / 12000);
        // This gets rid of the name column
        data.splice(0, 1);
        for (var i = 0; i < data.length; i++) {
            data[i].splice(0, 1);
            data[i].splice(0, lowerPortion);
            data[i].splice(data[i].length - upperPortion, data[i].length);
            for (var j = 0; j < data[i].length; j++) {
                data[i][j] = Number(data[i][j]);
                min = min > data[i][j] ? data[i][j] : min;
                max = max < data[i][j] ? data[i][j] : max;
            }
        }
        var object = {
            dataConverted: data,
            max: max,
            min: min
        };
        return object;
    }

    function transformsParameters () {

        // Initialise the parameters that we recommend for good practice
        // Order is y0, x0, dilationX, dilationY
        var logarithmicParameters = [ 1.2, -0.3, 1, 1 ];
        var exponentialParameters = [ 0, 0, -5, 1/150 ];
        var sigmoidParameters = [ 1, 0.5, 1, 1 ];

        // Return as an array
        return [logarithmicParameters, exponentialParameters, sigmoidParameters];
    }

    function transform (rescaledObjects, logarithmicParameters, exponentialParameters, sigmoidParameters) {
        var y0 = 0;
        var x0 = 1;
        var dilationX = 2;
        var dilationY = 3;
        var transformedArray = [];
        var allColors = eval('[' + sessionStorage.indices + ']');
        var transformsArray = sessionStorage.transforms.split(',');
        //for(var k = 0; k < rescaledObjects.length; k++){
        rescaledObjects.forEach(function (rescaledObject, k) {


            var chosenTransform = allColors[k];
            var maximum = rescaledObjects[k].max;
            for(var i = 0; i < rescaledObjects[k].dataConverted.length; i++){
                for(var j = 0; j < rescaledObjects[k].dataConverted[i].length; j++){
                    if(transformsArray[k] === "Log") {
                    rescaledObjects[k].dataConverted[i][j] =  logarithmicParameters[dilationY] * Math.log(logarithmicParameters[dilationX] * rescaledObjects[k].dataConverted[i][j] - logarithmicParameters[x0]) + logarithmicParameters[y0];
                    }
                    if(transformsArray[k] === "Exponential") {
                    rescaledObjects[k].dataConverted[i][j] = exponentialParameters[dilationY] * Math.exp(exponentialParameters[dilationX] * rescaledObjects[k].dataConverted[i][j] - exponentialParameters[x0]);
                    }
                    if(transformsArray[k] === "Sigmoid") {
                        rescaledObjects[k].dataConverted[i][j] = sigmoidParameters[dilationY] / (1 + Math.exp(-10 * (rescaledObjects[k].dataConverted[i][j] - sigmoidParameters[x0]))) + sigmoidParameters[y0];
                    }
                    if(rescaledObjects[k].dataConverted[i][j] < 0) {
                        rescaledObjects[k].dataConverted[i][j] = 0;
                    }
                    if(rescaledObjects[k].dataConverted[i][j] > 1) {
                        rescaledObjects[k].dataConverted[i][j] = 1;
                    }
                }
            }
            transformedArray[k] = (rescaledObjects[k].dataConverted);
        });
        return transformedArray;
    }

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
}
