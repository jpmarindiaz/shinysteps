
library(shinysteps)
library(shinyjs)
library(tidyverse)

styles <- "#sidebar{background-color: #f9f9f9"

ui <- stepsPage(skin = "magenta",styles = styles,
  stepsHeader(show = FALSE, height = 150,
    verbatimTextOutput("debug"),
    br()
    ),
  stepsBody(initStep = "step2",
               stepPanel(id="step1",
                         sideBarStep(title = "FIRST",
                                     p("sidebar step1")
                         ),
                         mainStep(
                           p("main step1"),
                           uiOutput("buttons")

                         )
               ),
               stepPanel(id="step2",
                         sideBarStep(title = "SECOND",
                                     p("step2 controls")
                         ),
                         mainStep(
                           p("main step2")
                         )
               ),
               stepPanel(id="step3",
                         sideBarStep(
                           p("step3 controls")
                         ),
                         mainStep(
                           h3("main 3")
                         )
               )
               ,
               stepPanel(id="step4",
                         sideBarStep(
                           p("step4 controls")
                         ),
                         mainStep(
                           h3("main 4")
                         )
               )
  )
)

server <- function(input,output,session){
  output$debug <- renderPrint({
    input$shinysteps_current
  })
  output$buttons <- renderUI({
    tagList(
      actionButton("btn", "go to step 3")
    )
  })

  observeEvent(input$btn, {
    nextStep <- "step3"
    current <- input$shinysteps_current
    steps <- input$shinysteps_stepIds
    session$sendCustomMessage("nextStep", nextStep)
  })

}
shinyApp(ui,server)




