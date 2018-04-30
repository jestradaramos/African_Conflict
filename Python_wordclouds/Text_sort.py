import numpy as np
import pandas as pd
import os


def main():
    file = 'african_conflicts.csv'
    column_names = ['NOTES','YEAR']
    DataFrame = pd.read_csv(file,skipinitialspace=True,usecols=column_names,encoding='ISO-8859-1')
    df=DataFrame.dropna()

    
    x = 1997
    while x <= 2017:
        f = str(x)
        filename = f + '.txt'
        (df.loc[df['YEAR']==x]).to_csv(filename,encoding='utf-8')
        file = open(f + '.txt','r',encoding='utf-8')
        
        
        total=[]
        store={}
        for line in file:
            A=line.split()
            for element in A:
                word=element.strip(". /\":;()-',!_?[]123456789#$%^*~+&@")
                word=word.lower()
                
                store[word]=store.get(word,0)+1
                if word!="":
                    total.append(word)
        file.close()
            
        p = dict(zip(store.values(),store.keys()))
        items=list(p.keys())
        count=list(p.values())
        items.sort(reverse=True)
        count.sort()
    
        file2=open(f+'_10.txt','w')

        for words in items:
            file2.write("{0:>1} {1:}\n".format(words//10,p[words]))
   
        file2.close()
        #os.remove(f+'.txt')
        x=x+1
        
        
        
if __name__=='__main__':
    main()
