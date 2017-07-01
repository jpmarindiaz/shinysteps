// Sideout
// https://github.com/mango/slideout

var slideout = new Slideout({
    'menu': document.getElementById('sidebar'),
    'panel': document.getElementById('main'),
    'side': 'left',
    'padding': 300,
    'tolerance': 70
});

// Toggle button
document.querySelector('.btn-hamburger').addEventListener('click', function() {
    slideout.toggle();
});
// Enable touch
slideout.enableTouch();

// Show collapsed sidebar only on small screens
var jmediaquery = window.matchMedia("(min-width: 480px)")
jmediaquery.addListener(handleSmallScreen);
handleSmallScreen(jmediaquery);

function handleSmallScreen(jmediaquery) {
    if (!jmediaquery.matches) {
        // orientation changed
        slideout.open();
    } else {
        slideout.close();
    }
}

// Shinystep Opts

// var shinyStepIds = ['NULL','step1','step2','step3','step4']
// var initStep = 'step2';
// var headerOpts = {"height":30,"show":true}

if(shinyStepIds.length == 1){
    $(".clickable").css("cursor", "auto");
}

if (!headerOpts.show) {
    $(".fixed-header").hide();
    $('.slideout-menu').css("top", "0px");
    $('.slideout-panel').css("margin-top", "0px");
} else {
    $('.fixed-header').css("height", headerOpts.height + "px");
    $('.slideout-menu').css("top", headerOpts.height + "px");
    $('.slideout-panel').css("margin-top", headerOpts.height + "px");
}

// Shinysteps

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

    if (typeof Shiny != "undefined") {
        // Shiny.addCustomMessageHandler("ids", function(s) {
        //     console.log("IDS", s);
        // });

        Shiny.addCustomMessageHandler("nextStep", function(step) {
            console.log(step);
            toggleSteps(step, shinyStepIds);
        });
    }

    if (shinyStepIds.length == 1) {
        console.log("only one step", shinyStepIds)
        $(".clickable").hide()
    }

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
