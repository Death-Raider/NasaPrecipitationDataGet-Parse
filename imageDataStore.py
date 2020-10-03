from netCDF4 import Dataset
import numpy as np
from PIL import Image
import os
#parse file
def getFiles():
    #change location to where ever the download data folder is specially for the nasa data **ONLY**
    x = [os.path.join(r,file) for r,d,f in os.walk("F:\\data") for file in f]
    x.pop()
    return x
def create_image_data(location):
    rootgrp = Dataset(location, "r+", format="NETCDF4")
    time = rootgrp.variables["time"] #gets time variable from file
    lat = rootgrp.variables["lat"][:].tolist() #gets latitudes from file
    lon = rootgrp.variables["lon"][:].tolist() #gets longitudes from file
    precipitationData = rootgrp.variables["precipitationCal"][0].tolist() #gets precipitation value from file
    day = int(time[0] - 11109)
    rootgrp.close()#closes file
    img = Image.open("./world.bmp")
    img_data = img.load();
    coordinate_to_imgpoint = lambda arr: [float("{:.2f}".format(179.95+arr[1])),float("{:.2f}".format(89.95-arr[0]))]
    colorPick = lambda val: (30,30,int(-134*val/255+255))
    for i in range(len(precipitationData)):#longitudes
        for j in range(len(precipitationData[i])):#latitudes
            if precipitationData[i][j] == None:
                precipitationData[i][j] = -1
            if precipitationData[i][j] >= 5:
                lat_lon = coordinate_to_imgpoint([lat[j],lon[i]])
                img_data[lat_lon[0],lat_lon[1]] = colorPick(precipitationData[i][j])
    img.save(f"F:/imagesTrain/{day}.png")#Location to store the data
files = getFiles()
for ITERATOR in range(5100,len(files)):
    create_image_data(files[ITERATOR])
    print(ITERATOR)
