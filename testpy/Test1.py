#!/usr/bin/env python
# coding: utf-8

# In[13]:


from selenium import webdriver
import copy
from selenium.webdriver.common.keys import Keys
import pandas as pd
import numpy as np
import re
import os
import random
import sys
from threading import Thread
import time
from multiprocessing.pool import ThreadPool
from selenium.webdriver import ActionChains
import time
import random


# In[14]:


driver = webdriver.Firefox(".")
driver.implicitly_wait(1)


# In[15]:


driver.get("http://localhost:8000/")


# In[16]:


country=["France","Allemagne","Etats-Unis"]


# In[ ]:





# In[17]:


try:
    BaliseCountry=driver.find_element_by_xpath("//input[@list='contry_list']")
    BaliseCountry.send_keys(random.choices(country))
    time.sleep(5)
except:
    print("mince")


try:
    search=driver.find_element_by_xpath("//button[@id='searchButton']")
    search.click()
    time.sleep(5)
except:
    print("mince")


# In[18]:


try:

    y=30
    while True and y<1000:
        if y is not None:
            old_y=y
        else:
            old_y=0

        y+=300

        driver.execute_script("window.scrollTo(0, "+str(y)+")")
        time.sleep(1)
        newy=driver.execute_script("return window.pageYOffset;")
        print(old_y,newy)
        if abs(old_y-newy)<20 or old_y>newy :
            print("rentre deans le break")
            break
        old_y=newy
except Exception as e:
    print("deuxieme scroll",e)
time.sleep(10)



# In[19]:


BaliseCountry=driver.find_elements_by_xpath("//div[@id='button_graphe']")
for button_aff_price in BaliseCountry:
    print("butt_aff_price est :",button_aff_price)
    try:
        y=None
        cpt=0
        while True and cpt<100:
            #print("ntm1:::::: ",yamlFile[domain]['butt_aff_price'],"browser :",browser)
            #button_aff_price = browser.find_element_by_xpath(yamlFile[domain]['scroll_at'])
            #print("ntm2:::::: ",yamlFile[domain]['butt_aff_price'],button_aff_price)
            #button_aff_price.location_once_scrolled_into_view
            location = button_aff_price.location
            actions = ActionChains(driver)
            if y is not None:
                old_y=y
            else:
                old_y=0
            print("je suis dans le scroll_at",y,old_y)
            y=location['y']-500
            cpt+=1
            if abs(old_y-y)<20:
                break
            driver.execute_script("window.scrollTo(0, "+str(y)+")")
            time.sleep(3)
            location = button_aff_price.location
            y=location['y']-500
            driver.execute_script("window.scrollTo(0, "+str(y)+")")
            actions.click(button_aff_price).perform()


            time.sleep(12)
    except Exception as e:
        print("marche pas :",e)


# In[20]:


try:

    y=30
    while True and y<1000:
        if y is not None:
            old_y=y
        else:
            old_y=0

        y+=300

        driver.execute_script("window.scrollTo(0, "+str(y)+")")
        time.sleep(1)
        newy=driver.execute_script("return window.pageYOffset;")
        print(old_y,newy)
        if abs(old_y-newy)<20 or old_y>newy :
            print("rentre deans le break")
            break
        old_y=newy
except Exception as e:
    print("deuxieme scroll",e)
time.sleep(10)



# In[21]:


driver.close()


# In[ ]:




