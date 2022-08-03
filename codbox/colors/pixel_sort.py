import cv2
import numpy as np
import math
import colorsys
import pandas as pd
import os
import argparse
from tqdm import tqdm
import sound
parser = argparse.ArgumentParser()  # you iniatize as such
parser.add_argument("-f", required=True, help="enter fileName of your picture")
args = parser.parse_args()  # you take the arguments from command line
os.makedirs("Image_sort/" + str(args.f))
print(str(args.f).capitalize() + " directory is created.")
df = []
total = 0
dict, final, img_list = {}, [], []
def createDataSet(val=0, data=[]):
    global dict
    dict[len(data)] = data
    if val != 0:
        if val == max(dict.keys()):
            final_df = pd.DataFrame(dict[val], columns=["Blue", "Green", "Red"])
            final_df.to_excel("Image_sort/" + str(args.f) + "/" + "output.xlsx")
def generateColors(c_sorted, frame, row):
    global df, img_list
    height = 25
    img = np.zeros((height, len(c_sorted), 3), np.uint8)
    for x in range(0, len(c_sorted)):
        r, g, b = c_sorted[x][0] * 255, c_sorted[x][1] * 255, c_sorted[x][2] * 255
        c = [r, g, b]
        df.append(c)
        img[:, x] = c  # the color value for the xth column , this gives the color band
        frame[row, x] = c  # changes added for every row in the frame

    createDataSet(data=df)
    return img, frame
def measure(count, row, col, height, width):
    global total
    total += count
    if row == height - 1 and col == width - 1:
        createDataSet(val=total)
def step(bgr, repetitions=1):
    b, g, r = bgr
    lum = math.sqrt(0.241 * r + 0.691 * g + 0.068 * b)
    h, s, v = colorsys.rgb_to_hsv(
        r, g, b
    )  # h,s,v is a better option for classifying each color
    h2 = int(h * repetitions)
    v2 = int(v * repetitions)
    if h2 % 2 == 1:
        v2 = repetitions - v2
        lum = repetitions - lum

    return h2, lum, v2
def findThreshold(lst, add):
    for i in lst:
        add.append(sum(i))
    return (max(add) + min(add)) / 2
def makeVideo():
    out = cv2.VideoWriter(
        "Image_sort/" + str(args.f) + "/" + str(args.f) + ".mp4",
        cv2.VideoWriter_fourcc(*"mp4v"),
        16,
        (800, 500),
    )
    for count in tqdm(range(1, 500 + 1)):
        fileName = "Image_sort/" + str(args.f) + "/" + str(count) + ".jpg"
        img = cv2.imread(fileName)
        out.write(img)
        os.remove(fileName)
    out.release()
def main():
    global img_list
    img = cv2.imread("Image/" + str(args.f) + ".jpg")
    img = cv2.resize(img, (800, 500))
    img_list.append(img)
    height, width, _ = img.shape
    print(">>> Row-wise Color sorting")
    for row in tqdm(range(0, height)):
        color, color_n = [], []
        add = []
        for col in range(0, width):
            val = img[row][col].tolist()
            val = [i / 255.0 for i in val]
            color.append(val)
        thresh = findThreshold(
            color, add
        )
        if np.all(np.asarray(color)) == True:
            color.sort(key=lambda bgr: step(bgr, 8))
            band, img = generateColors(color, img, row)
            measure(len(color), row, col, height, width)
        if np.all(np.asarray(color)) == False:
            for ind, i in enumerate(color):
                if np.any(np.asarray(i)) == True and sum(i) < thresh:
                    color_n.append(i)
            color_n.sort(key=lambda bgr: step(bgr, 8))
            band, img = generateColors(color_n, img, row)
            measure(len(color_n), row, col, height, width)
        cv2.imwrite("Image_sort/" + str(args.f) + "/" + str(row + 1) + ".jpg", img)
    cv2.imwrite(
        "Image_sort/" + str(args.f) + "/" + str(args.f) + ".jpg", img
    ) 
    print("\n>>> Formation of the Video progress of the pixel-sorted image")
    makeVideo()
    sound.main(
        args.f
    ) 
main()
