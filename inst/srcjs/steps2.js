

// Shinystep Opts

// var shinyStepIds = ['NULL','step1','step2','step3','step4']
// var initStep = 'step2';
// var headerOpts = {"height":30,"show":true}

var shinyStepIds = ['step1', 'step2'];

if (shinyStepIds.length == 1) {
    $(".clickable").css("cursor", "auto");
}

// if (!headerOpts.show) {
//     $(".fixed-header").hide();
//     $('.slideout-menu').css("top", "0px");
//     $('.slideout-panel').css("margin-top", "0px");
// } else {
//     $('.fixed-header').css("height", headerOpts.height + "px");
//     $('.slideout-menu').css("top", headerOpts.height + "px");
//     $('.slideout-panel').css("margin-top", headerOpts.height + "px");
// }

// Shinysteps

toggleSteps = function() {

    var currentStep = $(".step.active")[0].id;
    currentStep = currentStep.replace("sidebar_", "");
    // console.log("toggle current", currentStep);

    $(".stepsBinding").trigger("change");
    // $(".active").trigger("change");

    var otherSteps = shinyStepIds.filter(function(i) {
        return i != currentStep
    });

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
}

$(document).on("click", ".clickable", function() {

    $(".step").removeClass("active");

    // console.log("THIS", $(this)[0].id)
    var step = $(this)[0].id;
    step = step.replace("_title", "");
    // console.log("step class", "#" + step)
    $("#" + step).addClass("active");

    // step = step.replace("sidebar_", "");
    // currentStep = step.replace("_contents", "");
    // console.log("current step", currentStep)
    
    toggleSteps();
    // $(".step").trigger("change");
    // $(this).trigger("change");
});


var stepsBinding = new Shiny.InputBinding();

stepsBinding.find = function(scope) {
    return $(scope).find(".step");
};

stepsBinding.initialize = function(el) {
        $('.fixed-header').css("height", headerOpts.height + "px");
    $('.slideout-menu').css("top", headerOpts.height + "px");
    $('.slideout-panel').css("margin-top", headerOpts.height + "px");
    console.log("initialize", el)
    // toggleSteps(el);
};

stepsBinding.getValue = function(el) {
    // return {
    //   left: $.makeArray($(el).find("select.left option").map(function(i, e) { return e.value; })),
    //   right: $.makeArray($(el).find("select.right option").map(function(i, e) { return e.value; }))
    // }
    // console.log("getValue",el)
    var step = $(".step.active")[0].id;
    step = step.replace("sidebar_", "");
    console.log("getValue",step)
    return step
};

stepsBinding.setValue = function(el, value) {
    // TODO: implement
};

stepsBinding.subscribe = function(el, callback) {
    $(el).on("change.stepsBinding", function(e) {
        callback();
    });
};

stepsBinding.unsubscribe = function(el) {
    $(el).off(".stepsBinding");
};

// stepsBinding.getType = function() {
//   return "shinyjsexamples.chooser";
// };

Shiny.inputBindings.register(stepsBinding);