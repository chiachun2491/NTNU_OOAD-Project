#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# util.py
# @Author : DannyLeee (dannylee94049@gmail.com)
# @Link   : https://github.com/DannyLeee
# @Date   : 2021/5/3 下午5:36:55

from enum import IntEnum
from random import shuffle
import logging
import json
from pprint import pformat
 

def serialize(obj):
    return obj.__dict__
