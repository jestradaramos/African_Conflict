import pandas as pd

df = pd.read_csv("african_conflicts.csv", encoding='latin1',
        usecols=["EVENT_DATE","EVENT_ID_CNTY","FATALITIES", "LATITUDE",
            "LONGITUDE"]).sort_values(by="EVENT_DATE")
df.to_csv("../map.csv")
print(df)
