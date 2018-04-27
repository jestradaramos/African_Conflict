import json
import csv
import pandas as pd

data = {}

event_types = [ "violence against civilians", 
        "riots/protests", 
        "battle-no change of territory", 
        "strategic development", 
        "remote violence",
        "battle-non-state actor overtakes territory", 
        "headquarters or base established", 
        "non-violent transfer of territory", 
        "battle-government regains territory" ]

df = pd.read_csv("african_conflicts.csv", usecols = ["EVENT_DATE", "EVENT_TYPE"])

print(df)
df.EVENT_TYPE = df.EVENT_TYPE.str.upper()
df.EVENT_TYPE = df.EVENT_TYPE.str.strip()

df['EVENT_DATE'] = pd.to_datetime(df['EVENT_DATE'], errors='coerce')

x = df.groupby(["EVENT_TYPE", df.EVENT_DATE.dt.to_period('Y')]).size().reset_index(name='counts')
x.to_csv("linked.csv")
print(x)
