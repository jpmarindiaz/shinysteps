styles <- "
.clickable{
cursor: pointer;
}
"

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
  ),
  inlineCSS(styles),
  br()
)

server <- function(input,output,session){
  output$debug <- renderPrint({
    input$shinySteps_current
  })
  output$buttons <- renderUI({
    tagList(
      textInput("text", "Enter text", "Hello"),
      actionButton("btn", "go to step 3")
    )
  })

  observeEvent(input$btn, {
    nextStep <- "step3"
    current <- input$shinySteps_current
    steps <- input$shinySteps_stepIds
    session$sendCustomMessage("nextStep", nextStep)
  })

}
shinyApp(ui,server)




