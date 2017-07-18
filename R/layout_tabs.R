
#' @export
stepsPage <- function(stepsBody, skin = "magenta", styles = ""){
  #stepsPage <- function(stepsHeader, stepsBody, skin = "magenta", styles = ""){
  deps <- list(
    htmlDependency("font-awesome", "4.1.0",
                   src = c(href = "//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.1.0/css/"),
                   stylesheet = "font-awesome.min.css"
    ),
    # htmlDependency("slideout", "1.0.1",
    #                src = (file = system.file("srcjs", package = "shinysteps")),
    #                meta = list(
    #                  MobileOptimized = "320",
    #                  HandheldFriendly = "True",
    #                  "apple-mobile-web-app-capable" = "yes",
    #                  viewport = "width=device-width, initial-scale=1.0, user-scalable=no"
    #                ),
    #                script = "slideout.min.js"
    # ),
    # htmlDependency("steps-extend", "0.0.0",
    #                src = (file = system.file("srcjs", package = "shinysteps")),
    #                script = "steps-extend.js"
    # ),
    htmlDependency("stepsCSS", "0.0.1",
                   src = (file = system.file("css", package = "shinysteps")),
                   stylesheet = "shinysteps.css"
    )
  )

  jsfile <- system.file("srcjs", "steps-extend.js", package = "shinysteps")
  stepsJS <- tags$script(paste0(readLines(jsfile),collapse="\n"))

  page <- shiny::bootstrapPage(
    #stepsHeader,
    stepsBody,
    stepsJS,
    stepsCSS(styles)
  )

  old <- attr(page, "html_dependencies", TRUE)
  htmlDependencies(page) <- c(old, deps)
  page
}

#' @export
stepsHeader <- function(..., height = NULL, show = TRUE){
  div(class="fixed-header",
      ...,
      stepsHeaderJS(height = height, show = show)
  )
}

#' @export
stepsBody <- function(..., initStep = NULL){
  stepsExtendJS <- paste0(readLines(system.file("srcjs/steps-extend.js",package = "shinysteps")),
                          collapse = "\n")

  stepsExtendJS <- '


  toggleSteps = function() {


  var shinyStepIds = $("#sidebar").children().map(function(){
  return this.id
  }).toArray();
  console.log("stepIds",shinyStepIds)
  var shinyStepIds = ["step1","step2"];

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



  shinyjs.toggleSteps = function(params){

  var selector = ".clickable";
  $(selector).click(function(e) {
  console.log("CLICK",e)
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
  }
  '

  steps <- list(...)
  ids <- map(steps,"id")

  if(!is.null(initStep)){
    if(!initStep %in% ids) stop("initStep must be one of: ", paste(ids,collapse=", "))
  }else{
    initStep <- ids[1]
  }

  sidebar <-  map(steps,"sidebar")
  main <-  map(steps,"main")

  tagList(
    #div(id = "stepsPage",
      useShinyjs(),
      column(3,
             div(id="sidebar",
                 sidebar
             )
      ),
      column(9,
             tags$button(class = "btn-hamburger","="),
             # tabsetPanel(id = "tabs", type = "pills",
             #             unlist(main, recursive = FALSE)
             # ),
             do.call("tabsetPanel", c(id = "tabs", type = "pills",
                                      unlist(main, recursive = FALSE))
             ),
             stepsBodyJS(ids,initStep)
    )
    #extendShinyjs(text = stepsExtendJS)
    #inlineCSS(styles)
  )
}

#' @export
stepPanel <- function(id, sidebarStep, mainStep){
  list(
    id = id,
    sidebar = div(id=paste0("sidebar_",id),
                  buildSidebarStep(id,sidebarStep$title,sidebarStep$contents)
    ),
    main = buildMainStep(id, mainStep$title, mainStep$contents)
  )
}

#' @export
sidebarStep <- function(..., title = NULL){
  contents <- list(...)
  list(title = title, contents = contents)
}

#' @export
mainStep <- function(...,title = NULL){
  #tagList(list(...))
  contents <- list(...)
  list(title = title, contents = contents)
}

buildSidebarStep <- function(stepId, title = NULL, contents){
  title <- title %||% stepId
  tagList(
    div(id=paste0("sidebar_",stepId,"_title"), class = "clickable",
        h5(title,
           span(id=paste0("sidebar_",stepId,"_triangle-closed"),
                icon("chevron-right", class = "fa-1x")
           ),
           hidden(span(id=paste0("sidebar_",stepId,"_triangle-open"),
                       icon("chevron-down", class = "fa-1x"))
           )
        )
    ),
    div(id=paste0("sidebar_",stepId,"_contents"), class = "clickable",
        contents
    )
  )
}


buildMainStep <- function(stepId,title = NULL, contents){
  message("Build Main Step")
  str(stepId)
  title <- title %||% stepId
  tagList(
    tabPanel(id = stepId, title,
             fluidRow(
               contents
             )
    )
  )

}


stepsHeaderJS <- function(height, show){
  headerOpts <- list(
    height = height,
    show = show
  )
  tags$script(paste0("var headerOpts = ",jsonlite::toJSON(headerOpts,auto_unbox = TRUE)),";")
  tags$script("")
}

stepsBodyJS <- function(ids,initStep){
  #shinyStepIds <- paste0("var shinyStepIds = ['",paste0(ids,collapse = "','"),"']")
  #initStep <- paste0("var initStep = '",initStep,"';")
  # tags$script(
  #   paste(shinyStepIds,initStep,sep = "\n")
  # )
  js <- readLines(system.file("srcjs/steps-extend.js",package = "shinysteps"))
  tags$script("")
}

stepsCSS <- function(styles = ""){
  tags$style(
    styles
  )
}


