toggleSteps = function() {
    var shinyStepIds = $("#sidebar").children().map(function() {
        return this.id
    }).toArray();
    console.log("stepIds", shinyStepIds)
    var shinyStepIds = ["step1", "step2"];

    var currentStep = $(".step.active")[0].id;
    currentStep = currentStep.replace("sidebar_", "");
    console.log("toggleCurrent", currentStep);

    var otherSteps = shinyStepIds.filter(function(i) {
        return i != currentStep
    });

    console.log("OtherSteps", otherSteps)

    // Show current step - sidebar
    $("#sidebar_" + currentStep + "_contents").show();
    $("#sidebar_" + currentStep + "_triangle-closed").hide();
    $("#sidebar_" + currentStep + "_triangle-open").show();

    // if (typeof Shiny != "undefined") {
    //     Shiny.onInputChange("shinysteps_current", currentStep);
    // }

    // Hide all other steps - sidebar
    otherSteps.map(function(s) {
        $("#sidebar_" + s + "_contents").hide();
        $("#sidebar_" + s + "_triangle-open").hide();
        $("#sidebar_" + s + "_triangle-closed").show();
    });

    // Show current step - main
    $("#main_" + currentStep).show();

    // Hide all other steps - main
    otherSteps.map(function(s) {
        $("#main_" + s).hide();
    });

    Shiny.onInputChange("step_current", currentStep);

}



// shinyjs.toggleSteps = function(params) {

    var selector = ".clickable";
    $(selector).click(function(e) {
        console.log("CLICK", e)
        var step = e.currentTarget.id;
        step = step.replace("sidebar_", "");
        step = step.replace("_title", "");
        currentStep = step.replace("_contents", "");

        $(".step").removeClass("active");

        // console.log("THIS", $(this)[0].id)
        var step = $(this)[0].id;
        step = step.replace("_title", "");
        // console.log("step class", "#" + step)
        $("#" + step).addClass("active");

        toggleSteps();
        //return currentStep;
    });
// }
