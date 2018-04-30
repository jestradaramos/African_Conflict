#!/usr/bin/env python

from os import path
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt
import graphics

from wordcloud import WordCloud

d = path.dirname(__file__)

x = 1997
while x <= 2017:
    f = str(x)
    filename = f + '.txt'
            
    # Read the whole text.
    text = open(path.join(d, filename),encoding='utf-8').read()

    # read the mask image
    # taken from

    africa = np.array(Image.open(path.join(d, "africa2.png")))

    
    wc = WordCloud(background_color="rgba(255, 255, 255, 0)", mode="RGBA",max_words=2000, mask=africa,)
    # generate word cloud
    wc.generate(text)

    # store to file
    wc.to_file(path.join(d, f+".png"))

    # show
    plt.imshow(wc, interpolation='bilinear')
    plt.axis("off")
    plt.figure()
    plt.imshow(africa, cmap=plt.cm.gray, interpolation='bilinear')
    
    plt.axis("off")
    
    #plt.show()
    plt.close()
    x+=1
