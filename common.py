import c4d
from c4d import gui, utils
import json
import time, os, math
from c4d.modules import mograph as mo
import gzip
import numpy as np
import quaternions


json.encoder.FLOAT_REPR = lambda o: format(o, '.6f').rstrip('0').rstrip('.')

#========================================
# var

doc = c4d.documents.GetActiveDocument()
fps = doc[c4d.DOCUMENT_FPS]

projDir = os.path.normpath(doc.GetDocumentPath() + "/../")

#========================================
# c4d utils

def search(name):
	return doc.SearchObject(name)

#========================================
# coordinates conversion

def convertToGLScaleFromMatrix(m):

    scale = [
        m.v1.GetLength(),
        m.v2.GetLength(),
        m.v3.GetLength()
    ]

    return scale

def convertToGLMatrix(mg):
    v1, v2, v3, off = mg.v1, mg.v2, mg.v3, mg.off

    return [
        v1.x, v1.y, -v1.z,
        v2.x, v2.y, -v2.z,
        v3.x, v3.y, -v3.z,
        off.x, off.y, -off.z,
    ]

def convertToGLPosition(point):
	return [
		point.x,
		point.y,
		point.z * -1
	]

def convertToGLQuaternion(mg):

    mg.Normalize()

    v1, v2, v3 = mg.v1, mg.v2, mg.v3

    mat = np.array([
        [v1.x, v1.y, v1.z],
        [v2.x, v2.y, v2.z],
        [v3.x, v3.y, v3.z]
    ])

    q = quaternions.mat2quat(mat)

    return [q[1], q[2], -q[3], q[0]]


def convertToGLScale(scale):
    return [scale.x, scale.y, scale.z]

#========================================
# frame processing

def clearConsole():
    c4d.CallCommand(13957)

def escPressed():
    bc = c4d.BaseContainer()
    rs = gui.GetInputState( c4d.BFM_INPUT_KEYBOARD, c4d.KEY_ESC, bc )
    if rs and bc[ c4d.BFM_INPUT_VALUE ]:
        return True
    return False

def setFrame(f):
    doc.SetTime(c4d.BaseTime(f, fps))
    redraw()

def setAbsFrame(f):
    doc.SetTime(c4d.BaseTime(f, fps))
    redraw()

def redraw():
    c4d.DrawViews(c4d.DA_ONLY_ACTIVE_VIEW|c4d.DA_NO_THREAD|c4d.DA_NO_REDUCTION|c4d.DA_STATICBREAK)
    c4d.GeSyncMessage(c4d.EVMSG_TIMECHANGED)
    c4d.EventAdd(c4d.EVENT_ANIMATE|c4d.EVENT_FORCEREDRAW)
