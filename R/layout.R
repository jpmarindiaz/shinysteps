
#' @export
stepsPage <- function(...){
  deps <- list(
    htmlDependency("font-awesome", "4.1.0",
                   src = c(href = "//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.1.0/css/"),
                   stylesheet = "font-awesome.min.css"
    )
  )
  steps <- list(...)
  page <- shiny::bootstrapPage(steps)
  old <- attr(page, "html_dependencies", TRUE)
  htmlDependencies(page) <- c(old, deps)
  page
}

#' @export
stepsetPanel <- function(..., initStep = NULL){
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
    shinystepsCSS(sideBarClickable = length(ids) != 1),
    column(4,
           div(id="sidebar",
               sidebar
           )
    ),
    column(8,
           div(id = "main",
               main
           )
    ),
    shinystepsJS(ids,initStep)
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

shinystepsJS <- function(ids,initStep){
  jsfile <- system.file("js", "steps.js", package = "shinysteps")
  shinyStepIds <- paste0("var shinyStepIds = ['",paste0(ids,collapse = "','"),"']")
  #initStep <- paste0("toggleSteps('",initStep,"', shinyStepIds);\n")
  initStep <- paste0("var initStep = '",initStep,"';")
  js <- paste0(readLines(jsfile),collapse="\n")

  tags$script(
    paste(
      shinyStepIds,
      initStep,
      js
      ,sep = "\n")
  )
}

shinystepsCSS <- function(sideBarClickable = TRUE){
  styles <- ""
  if(sideBarClickable){
    styles <- "
    .clickable{
    cursor: pointer;
    }
  "

  }
  tags$style(
    styles
  )
}


