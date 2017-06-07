
#' #' @export
#' nextStep <- function(nextStep){
#'   current <- input$shinySteps_current
#'   steps <- input$shinySteps_stepIds
#'   if(is.numeric(nextStep)){
#'     nextStep <- steps[nextStep]
#'   }
#'   session$sendCustomMessage("mymessage", nextStep)
#' }
