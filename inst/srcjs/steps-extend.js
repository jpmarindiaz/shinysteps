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

toggleSidebarSteps = function(currentStep) {

    var shinyStepIds = $("#sidebar").children().map(function() {
        return this.id
    }).toArray().map(function(s) { return s.replace("sidebar_", "") });

    var otherSteps = shinyStepIds.filter(function(i) {
        return i != currentStep
    });

    console.log("OtherSteps", otherSteps)

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

    // Show current step - main
    $("#main_" + currentStep).show();

    // Hide all other steps - main
    otherSteps.map(function(s) {
        $("#main_" + s).hide();
    });

    if (typeof Shiny != "undefined") {
        Shiny.onInputChange("step_current", currentStep);
    }

}

switchToTab = function(step) {
    var tabIds = $(".tab-pane").map(function() { return this.id }).toArray();
    //var activeTabId = $(".tab-pane.active").map(function(){return this.id}).toArray()[0];
    var currentStepId = parseInt(step.replace("step", ""));
    var activeTabId = tabIds[currentStepId - 1];
    // console.log("activeTabId", activeTabId)
    $('.nav-pills a[href="#' + activeTabId + '"]').tab('show');
}

//



// if(shinyStepIds.length == 1){
//     $(".clickable").css("cursor", "auto");
// }

var headerOpts = $(".fixed-header").data("value");

if (!headerOpts.show) {
    $(".fixed-header").hide();
    $('.slideout-menu').css("top", "0px");
    $('.slideout-panel').css("margin-top", "0px");
} else {
    $('.fixed-header').css("height", headerOpts.height + "px");
    $('.slideout-menu').css("top", headerOpts.height + "px");
    $('.slideout-panel').css("margin-top", headerOpts.height + "px");
}

$(document).ready(function() {
    var initStep = $("#stepsPage").data("selected");
    console.log("iniStep", initStep)
    // toggleSidebarSteps(initStep); 
    // switchToTab(initStep);
    // weird see https: //groups.google.com/forum/#!topic/shiny-discuss/sDhULZUt03A
    setTimeout(function() {
        toggleSidebarSteps(initStep);
        switchToTab(initStep);
    }, 0);

});


$(document).on("click", "#steps_tabs a", function(){
  $("a").click(function(e) {

    var shinyStepIds = $("#sidebar").children().map(function() {
        return this.id
    }).toArray().map(function(s) { return s.replace("sidebar_", "") });
    
    var clickedTab = $(this).attr('href').replace("#", "");
    console.log("clickedTab", clickedTab)

    var tabIds = $(".tab-pane").map(function() { return this.id }).toArray();
    console.log("tabIds", tabIds)

    var tabIdx = tabIds.indexOf(clickedTab);
    console.log("Cliked Tab IDX", tabIdx)

    toggleSidebarSteps(shinyStepIds[tabIdx]);

  });
});


$(document).on("click", ".clickable", function() {

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

        var currentStep = $(".step.active")[0].id;
        currentStep = currentStep.replace("sidebar_", "");
        // console.log("toggleCurrent", currentStep);

        toggleSidebarSteps(currentStep);
        switchToTab(currentStep);

    });
});