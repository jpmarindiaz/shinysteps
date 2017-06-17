
#' #' @export
#' nextStep <- function(nextStep){
#'   current <- input$shinysteps_current
#'   steps <- input$shinysteps_stepIds
#'   if(is.numeric(nextStep)){
#'     nextStep <- steps[nextStep]
#'   }
#'   session$sendCustomMessage("mymessage", nextStep)
#' }
