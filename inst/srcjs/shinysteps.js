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



// STEPS FUNS

getSteps = function() {
    var shinyStepIds = $("#sidebar").children().map(function() {
        return this.id
    }).toArray().map(function(s) { return s.replace("sidebar_", "") });

    var activeStep = $('#stepsPage').data('selected');
    var otherSteps = shinyStepIds.filter(function(i) {
        return i != activeStep
    });
    var nextStep = shinyStepIds[shinyStepIds.indexOf(activeStep) + 1];
    var prevStep = shinyStepIds[shinyStepIds.indexOf(activeStep) - 1];
    return {
        ids: shinyStepIds,
        activeStep: activeStep,
        otherSteps: otherSteps,
        nextStep: nextStep,
        prevStep: prevStep
    }

};

setActiveStep = function(step) {
    $('#stepsPage').data('selected', step);
}

// STEPS

if(getSteps().ids.length == 1){
    $(".clickable").css("cursor", "auto");
}

var headerOpts = $(".fixed-header").data("value");

if (!headerOpts.show) {
    $(".fixed-header").hide();
    $('.slideout-menu').css("top", "0px");
    $('.slideout-panel').css("margin-top", "0px");
} else {
    $('.fixed-header').css("height", headerOpts.height + "px");
    $('#sidebar').css("top", $(".fixed-header").css("height"));
    $('#main').css("margin-top", $(".fixed-header").css("height"));
}



// toggleSidebarSteps = function(currentStep) {
toggleSidebarSteps = function() {

    var steps = getSteps();
    var shinyStepIds = steps.ids;
    var otherSteps = steps.otherSteps;

    var currentStep = steps.activeStep;
    if(debug){console.log("currentStep in Toggle: ", currentStep)}

    // Show current step - sidebar
    $("#sidebar_" + currentStep + "_contents").show();
    $("#sidebar_" + currentStep + "_triangle-closed").hide();
    $("#sidebar_" + currentStep + "_triangle-open").show();

    // Hide all other steps - sidebar
    otherSteps.map(function(s) {
        $("#sidebar_" + s + "_contents").hide();
        $("#sidebar_" + s + "_triangle-open").hide();
        $("#sidebar_" + s + "_triangle-closed").show();
    });
    if (typeof Shiny != "undefined") {
        Shiny.onInputChange("shinysteps_current", currentStep);
    }
}

switchToTab = function() {
    var activeStep = getSteps().activeStep;
    var activeStepId = activeStep[activeStep.length-1];
    // var tabIds = $(".tab-pane").map(function() { return this.id }).toArray();
    // var tabIds = $(".tab-pane").map(function() { return this.id }).toArray().map(function(x){ return(x[x.length-1])});
    if(debug){console.log("switchToTab active step", activeStep)}
    // if(debug){console.log("switchToTab tabIds", tabIds)}
    //$('[data-toggle="tab"][data-value='+ activeStep +']').tab('show');
    var href = $('[data-toggle="tab"]').attr("href");
    href = href.slice(0, -1);
    $('[data-toggle="tab"]a[href="'+ href + activeStepId +'"]').tab('show');
    
}

$(document).ready(function() {
    var initStep = $("#stepsPage").data("selected");
    if(debug){console.log("initStep", initStep)}
    setActiveStep(initStep);
    // weird see https: //groups.google.com/forum/#!topic/shiny-discuss/sDhULZUt03A
    setTimeout(function() {

        setActiveStep(initStep);
        toggleSidebarSteps();
        switchToTab(initStep);

        var headerOpts = $(".fixed-header").data("value");
        if (!headerOpts.show) {
            $(".fixed-header").hide();
        } else {
            $('#sidebar').css("top", $(".fixed-header").css("height"));
            $('#main').css("margin-top", $(".fixed-header").css("height"));
        }

    }, 0);
});

$('.fixed-header').on('shiny:visualchange', function(event) {
    if(debug){console.log("Header height", $(".fixed-header").css("height"))}
    var headerOpts = $(".fixed-header").data("value");
    if (!headerOpts.show) {
        $(".fixed-header").hide();
    } else {
        $('#sidebar').css("top", $(".fixed-header").css("height"));
        $('#main').css("margin-top", $(".fixed-header").css("height"));
    }
});

$(document).on("click", ".clickable", function(e) {
    var nextStep = e.currentTarget.id;
    if(debug){console.log("CLICK", nextStep);}
    nextStep = nextStep.replace("sidebar_", "");
    nextStep = nextStep.replace("_title", "");
    if(debug){console.log("click clickable: ", nextStep);}
    setActiveStep(nextStep);
    toggleSidebarSteps(nextStep);
    switchToTab();
});

$(document).on("click", "#steps_tabs a", function(e) { 
    var steps = getSteps();
    var shinyStepIds = steps.ids;
    // var clickedStep = $(this).attr('data-value');
    var clickedStep = $(this).attr('href');
    clickedStep = "step" + clickedStep[clickedStep.length-1];
    if(debug){console.log("clickedStep", clickedStep)}
    setActiveStep(clickedStep);
    toggleSidebarSteps();
});

$(document).on("click", ".btn-step-jump", function() {
    var step = $(".btn-step-jump").data("jumpto");
    if(debug){console.log("jumpto", step)}
    setActiveStep(step);
    toggleSidebarSteps();
    switchToTab();
});

$(document).on("click", ".btn-step-prev", function() {
    setActiveStep(getSteps().prevStep);
    toggleSidebarSteps();
    switchToTab();
});

$(document).on("click", ".btn-step-next", function() {
    var step = $(".btn-step-jump").data("jumpto");
    if(debug){console.log("jumpto", step)}
    setActiveStep(getSteps().nextStep);
    toggleSidebarSteps();
    switchToTab();
});
