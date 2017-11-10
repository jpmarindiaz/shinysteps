
#' @export
stepsPage <- function(stepsHeader, stepsBody, skin = "magenta", styles = "", debug = FALSE){
  deps <- list(
    htmlDependency("font-awesome", "4.1.0",
                   src = c(href = "//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.1.0/css/"),
                   stylesheet = "font-awesome.min.css"
    ),
    htmlDependency("slideout", "1.0.1",
                   src = (file = system.file("srcjs", package = "shinysteps")),
                   meta = list(
                     MobileOptimized = "320",
                     HandheldFriendly = "True",
                     "apple-mobile-web-app-capable" = "yes",
                     viewport = "width=device-width, initial-scale=1.0, user-scalable=no"
                   ),
                   script = "slideout.min.js"
    ),
    htmlDependency("stepsCSS", "0.0.1",
                   src = (file = system.file("css", package = "shinysteps")),
                   stylesheet = "shinysteps.css"
    )
  )

  jsfile <- system.file("srcjs", "shinysteps.js", package = "shinysteps")
  stepsJS <- tags$script(paste0(readLines(jsfile),collapse="\n"))
  debugJS <- tags$script(ifelse(debug,"var debug = true;","var debug = false;"))
  page <- shiny::bootstrapPage(
    stepsHeader,
    stepsBody,
    debugJS,
    stepsJS,
    stepsCSS(styles)
  )
  old <- attr(page, "html_dependencies", TRUE)
  htmlDependencies(page) <- c(old, deps)
  page
}

#' @export
stepsHeader <- function(..., height = NULL, show = TRUE){
  headerOpts <- list(
    height = height,
    show = show
  )
  div(class="fixed-header", "data-value" = jsonlite::toJSON(headerOpts,auto_unbox = TRUE),
      useShinyjs(),
      showDebugUI("showDebug"),
      ...
  )
}



#' @export
stepsBody <- function(..., selected = NULL){
  steps <- list(...)
  ids <- map(steps,"id")

  if(!is.null(selected)){
    if(!selected %in% ids) stop("selected must be one of: ", paste(ids,collapse=", "))
  }else{
    selected <- ids[1]
  }

  sidebar <-  map(steps,"sidebar")
  main <-  map(steps,"main")

  tagList(
    div(id = "stepsPage", "data-selected" = selected,
        div(id="sidebar",
            sidebar
        ),
        div(id = "main",
            tags$button(class = "btn-hamburger","="),
              do.call("tabsetPanel", c(id = "steps_tabs", type = "pills",
                                       unlist(main, recursive = FALSE))
            ),
            stepsBodyJS(ids,selected)
        )
    )
  )
}

#' @export
stepPanel <- function(id, sidebarStep, mainStep){
  list(
    id = id,
    sidebar = div(id=paste0("sidebar_",id), class = "step",
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
  contents <- div(class = "tab-container", list(...))
  list(title = title, contents = contents)
}

buildSidebarStep <- function(stepId, title = NULL, contents){
  title <- title %||% stepId
  tagList(
    div(id=paste0("sidebar_",stepId,"_title"), class = "clickable",
        h5(title, class = "sidebar_title",
           span(id=paste0("sidebar_",stepId,"_triangle-closed"),
                icon("chevron-right", class = "fa-1x")
           ),
           span(id=paste0("sidebar_",stepId,"_triangle-open"),
                icon("chevron-down", class = "fa-1x")
           )
        )
    ),
    div(id=paste0("sidebar_",stepId,"_contents"), class = "sidebar_content",
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
               contents
    )
  )

}


stepsBodyJS <- function(ids,selected){
  #shinyStepIds <- paste0("var shinyStepIds = ['",paste0(ids,collapse = "','"),"']")
  #selected <- paste0("var selected = '",selected,"';")
  # tags$script(
  #   paste(shinyStepIds,selected,sep = "\n")
  # )
  js <- readLines(system.file("srcjs/steps-extend.js",package = "shinysteps"))
  tags$script("")
}

stepsCSS <- function(styles = ""){
  tags$style(
    styles
  )
}


