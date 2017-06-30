
library(shinysteps)
library(shinyjs)
library(tidyverse)


#js <- paste(readLines("../js/steps.js"),collapse = "\n")


ui <- stepsPage(
  verbatimTextOutput("debug"),
  uiOutput("buttons"),
  stepsetPanel(initStep = "step1",
               stepPanel(id="step1",
                         sideBarStep(title = "FIRST",
                                     p("sidebar step1")
                         ),
                         mainStep(
                           p("main step1")
                         )
               )
  )
)

server <- function(input,output,session){
  output$debug <- renderPrint({
    input$shinysteps_current
  })
}
shinyApp(ui,server)




