install.packages('pandas')
library(pandas)
install.packages('base')
library(base)
options(max.print=999999)
df <- read.csv("C:/Users/godeva/Documents/GitHub/African_Conflict/Goutham/disinctValues.csv", header=TRUE)
test <- with(df, table(source, target, value))

write.table(test, file = "reducer.csv", sep = ",", col.names = NA,
            qmethod = "double")
