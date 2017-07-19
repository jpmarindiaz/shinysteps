
pagerButtons <- function(id, prevLabel = "Previous", nextLabel = "Next"){
  tags$ul(id = id, class = "pager",
         tags$li(class = "previous",
                tags$a(href="#", prevLabel)
         ),
         tags$li(class = "next",
                tags$a(href="#", nextLabel)
         )
  )
}

