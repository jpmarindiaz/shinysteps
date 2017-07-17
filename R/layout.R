
#' @export
stepsPage <- function(stepsHeader, stepsBody, skin = "magenta", styles = ""){
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
        #            meta = '
        # <meta http-equiv="cleartype" content="on">
        # <meta name="MobileOptimized" content="320">
        # <meta name="HandheldFriendly" content="True">
        # <meta name="apple-mobile-web-app-capable" content="yes">
        # <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">',
                   script = "slideout.min.js"
    ),
    # htmlDependency("input_binding", "0.0.0",
    #                src = (file = system.file("js", package = "shinysteps")),
    #                script = "input_binding_steps.js"
    # ),
    htmlDependency("stepsCSS", "0.0.1",
                   src = (file = system.file("css", package = "shinysteps")),
                   stylesheet = "shinysteps.css"
    )
  )

  jsfile <- system.file("srcjs", "steps.js", package = "shinysteps")
  stepsJS <- tags$script(paste0(readLines(jsfile),collapse="\n"))
  bindingJsfile <- system.file("srcjs", "input_binding_steps.js", package = "shinysteps")
  bindingJS <- tags$script(paste0(readLines(bindingJsfile),collapse="\n"))

  #page <- shiny::bootstrapPage(stepsHeader,stepsBody,stepsJS,stepsCSS(styles))
  page <- shiny::bootstrapPage(stepsHeader,stepsBody,stepsJS,bindingJS,stepsCSS(styles))

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
    div(id = "stepsPage",
        div(id="sidebar",
            sidebar
        ),
        div(id = "main",
            tags$button(class = "btn-hamburger","="),
            main
        ),
        stepsBodyJS(ids,initStep)
    )
  )
}

#' @export
stepPanel <- function(id, sideBarStep, mainStep){
  list(
    id = id,
    sidebar = div(id=paste0("sidebar_",id),
                  buildSideBarStep(id,sideBarStep$title,sideBarStep$contents)
    ),
    main = div(id=paste0("main_",id),mainStep)
  )
}

#' @export
sideBarStep <- function(..., title = NULL){
  contents <- list(...)
  list(title = title, contents = contents)
}

buildSideBarStep <- function(stepId, title = NULL, contents){
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


#' @export
mainStep <- function(...){
  tagList(list(...))
}

stepsHeaderJS <- function(height, show){
  headerOpts <- list(
    height = height,
    show = show
  )
  tags$script(paste0("var headerOpts = ",jsonlite::toJSON(headerOpts,auto_unbox = TRUE)),";")
}

stepsBodyJS <- function(ids,initStep){
  shinyStepIds <- paste0("var shinyStepIds = ['",paste0(ids,collapse = "','"),"']")
  initStep <- paste0("var initStep = '",initStep,"';")
  tags$script(
    paste(shinyStepIds,initStep,sep = "\n")
  )
}

stepsCSS <- function(styles = ""){
  tags$style(
    styles
  )
}


