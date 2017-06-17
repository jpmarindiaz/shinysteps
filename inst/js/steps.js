toggleSteps = function(currentStep, shinyStepIds) {
    var otherSteps = shinyStepIds.filter(function(i) {
        return i != currentStep
    });

    // Show current step - sidebar
    $("#sidebar_" + currentStep + "_contents").show();
    $("#sidebar_" + currentStep + "_triangle-closed").hide();
    $("#sidebar_" + currentStep + "_triangle-open").show();
    if (typeof Shiny != "undefined") {
        Shiny.onInputChange("shinysteps_current", currentStep);
    }
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
}

$(document).ready(function() {

    Shiny.addCustomMessageHandler("nextStep", function(step) {
        console.log(step);
        toggleSteps(step, shinyStepIds);
    });

    var selector = ".clickable";
    $(selector).click(function(e) {
        // console.log(e)
        var step = e.currentTarget.id;
        step = step.replace("sidebar_", "");
        step = step.replace("_title", "");
        currentStep = step.replace("_contents", "");
        toggleSteps(currentStep, shinyStepIds);
    });

    // toggleSteps(initStep, shinyStepIds); 
    // weird see https://groups.google.com/forum/#!topic/shiny-discuss/sDhULZUt03A
    setTimeout(function() {
        toggleSteps(initStep, shinyStepIds);
        if (typeof Shiny != "undefined") {
            Shiny.onInputChange("shinysteps_stepIds", shinyStepIds);
        }
    }, 0);

});
