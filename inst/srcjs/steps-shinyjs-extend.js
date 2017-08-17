// // Sideout
// // https://github.com/mango/slideout

// var slideout = new Slideout({
//     'menu': document.getElementById('sidebar'),
//     'panel': document.getElementById('main'),
//     'side': 'left',
//     'padding': 300,
//     'tolerance': 70
// });

// // Toggle button
// document.querySelector('.btn-hamburger').addEventListener('click', function() {
//     slideout.toggle();
// });
// // Enable touch
// slideout.enableTouch();

// // Show collapsed sidebar only on small screens
// var jmediaquery = window.matchMedia("(min-width: 480px)")
// jmediaquery.addListener(handleSmallScreen);
// handleSmallScreen(jmediaquery);

// function handleSmallScreen(jmediaquery) {
//     if (!jmediaquery.matches) {
//         // orientation changed
//         slideout.open();
//     } else {
//         slideout.close();
//     }
// }

// STEPS

// if(shinyStepIds.length == 1){
//     $(".clickable").css("cursor", "auto");
// }

// var headerOpts = $(".fixed-header").data("value");

// if (!headerOpts.show) {
//     $(".fixed-header").hide();
//     // $('.slideout-menu').css("top", "0px");
//     // $('.slideout-panel').css("margin-top", "0px");
// } else {
//     // $('.fixed-header').css("height", headerOpts.height + "px");
//     // $('.slideout-menu').css("top", headerOpts.height + "px");
//     // $('.slideout-panel').css("margin-top", headerOpts.height + "px");
//     $('#sidebar').css("top", $(".fixed-header").css("height"));
//     $('#main').css("margin-top", $(".fixed-header").css("height"));
// }

// STEPS FUNS


// Shinyjs Extend




shinyjs.getSteps = function() {
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



// toggleSidebarSteps = function(currentStep) {
toggleSidebarSteps = function() {

    var steps = getSteps();
    var shinyStepIds = steps.ids;
    var otherSteps = steps.otherSteps;

    var currentStep = steps.activeStep;
    console.log("currentStep in Toggle: ", currentStep)

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

    // // Show current step - main
    // $("#main_" + currentStep).show();

    // // Hide all other steps - main
    // otherSteps.map(function(s) {
    //     $("#main_" + s).hide();
    // });

    if (typeof Shiny != "undefined") {
        Shiny.onInputChange("step_current", currentStep);
    }

    // $('#stepsPage').data('selected', currentStep);
    // $(".step").removeClass("active");
    // $("#sidebar_" + currentStep).addClass("active");

}

switchToTab = function() {
    var step = getSteps().activeStep;
    var tabIds = $(".tab-pane").map(function() { return this.id }).toArray();
    //var activeTabId = $(".tab-pane.active").map(function(){return this.id}).toArray()[0];
    var currentStepId = parseInt(step.replace("step", ""));
    var activeTabId = tabIds[currentStepId - 1];
    // console.log("activeTabId", activeTabId)
    $('.nav-pills a[href="#' + activeTabId + '"]').tab('show');
}

//





$(document).ready(function() {
    var initStep = $("#stepsPage").data("selected");
    console.log("iniStep", initStep)

    setActiveStep(initStep);

    // toggleSidebarSteps(initStep); 
    // switchToTab(initStep);
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
    console.log("Header height", $(".fixed-header").css("height"))
    var headerOpts = $(".fixed-header").data("value");
    if (!headerOpts.show) {
        $(".fixed-header").hide();
    } else {
        $('#sidebar').css("top", $(".fixed-header").css("height"));
        $('#main').css("margin-top", $(".fixed-header").css("height"));
    }
});



$(document).on("click", ".clickable", function(e) {

    // var selector = ".clickable";
    // $(selector).click(function(e) {
    var nextStep = e.currentTarget.id;
    console.log("CLICK", nextStep);

    nextStep = nextStep.replace("sidebar_", "");
    nextStep = nextStep.replace("_title", "");
    // currentStep = step.replace("_contents", "");

    // var currentStep = $(".step.active")[0].id;
    // currentStep = currentStep.replace("sidebar_", "");
    console.log("click clickable: ", nextStep);

    // var nextStep = getSteps().activeStep;
    setActiveStep(nextStep);
    toggleSidebarSteps(nextStep);
    switchToTab();
    // });
});


$(document).on("click", "#steps_tabs a", function(e) {
    // $("a").click(function(e) {

    var steps = getSteps();
    var shinyStepIds = steps.ids;

    var clickedTab = $(this).attr('href').replace("#", "");
    console.log("clickedTab", clickedTab)

    var tabIds = $(".tab-pane").map(function() { return this.id }).toArray();
    console.log("tabIds", tabIds)

    var tabIdx = tabIds.indexOf(clickedTab);
    console.log("Cliked Tab IDX", tabIdx)
    console.log("shinyStepIds", shinyStepIds)

    var currentStep = shinyStepIds[tabIdx];
    console.log("Current Step in tabs", currentStep)

    setActiveStep(currentStep);
    toggleSidebarSteps();

    // });
});




$(document).on("click", ".btn-step-jump", function() {
    // var selector = this;
    // $(selector).click(function(e) {
    var step = $(".btn-step-jump").data("jumpto");
    console.log("jumpto", step)

    // $(".step").removeClass("active");
    // $("#sidebar_" + step).addClass("active");

    setActiveStep(step);
    toggleSidebarSteps();
    switchToTab();

    // });
});

$(document).on("click", ".btn-step-prev", function() {
    // var selector = this;
    // $(selector).click(function(e) {

    setActiveStep(getSteps().prevStep);
    toggleSidebarSteps();
    switchToTab();

    // });
});

$(document).on("click", ".btn-step-next", function() {
    // var selector = this;
    // $(selector).click(function(e) {
    var step = $(".btn-step-jump").data("jumpto");
    console.log("jumpto", step)

    // $(".step").removeClass("active");
    // $("#sidebar_" + step).addClass("active");

    setActiveStep(getSteps().nextStep);
    toggleSidebarSteps();
    switchToTab();

    // });
});