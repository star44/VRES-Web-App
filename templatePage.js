(function () {

    var transforms = ["Linear", "Log", "Exponential", "Sigmoid"];

    var indexProfiles = [
        {indexName: "Acoustic Complexity Index", presetMinimum: 0.0, presetMaximum: 1.0},
        {indexName: "Entropy", presetMinimum: 0.0, presetMaximum: 1.0},
        {indexName: "Acoustic Events", presetMinimum: 0.0, presetMaximum: 1.0},
        {indexName: "Background Noise", presetMinimum: 0.0, presetMaximum: 1.0},
        {indexName: "Average Power", presetMinimum: 0.0, presetMaximum: 1.0},
        {indexName: "Acoustic Cover", presetMinimum: 0.0, presetMaximum: 1.0},
   //     {indexName: "DIF", presetMinimum: 0.0, presetMaximum: 1.0},
        {indexName: "Spectral Peak Track", presetMinimum: 0.0, presetMaximum: 1.0},
 //       {indexName: "SUM", presetMinimum: 0.0, presetMaximum: 1.0}
        {indexName: "Horizontal Richness ", presetMinimum: 0.0, presetMaximum: 1.0},
        {indexName: "Vertical Richness", presetMinimum: 0.0, presetMaximum: 1.0},
    ];


    window.addEventListener("load", setupEverything);


    function setupEverything() {
        var rawTemplate = document.querySelector("#controlPanelTemplate").innerText;
        var controlPanel = document.querySelector("#controlPanel");

        var templater = _.template(rawTemplate);

        var templatedText = templater({
            falseColorIndices: indexProfiles,
            transforms: transforms
        });

        controlPanel.innerHTML = templatedText;

        minInputs = Array.from(document.querySelectorAll(".minimum"));
        maxInputs = Array.from(document.querySelectorAll(".maximum"));
    }



})(window);

