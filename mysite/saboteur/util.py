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
from card import *

def serialize(obj):
    return obj.__dict__

"""
    create a list of card for a dictionary list
    :parms obj_list: dictionary list (List[Dict])
"""
def create_card_list(obj_list: list):
    card_list = []
    for obj in obj_list:
        if obj["card_no"] <= 43:
            card = Road(**obj)
        elif obj["card_no"] <= 61:
            card = Action(**obj)
        elif obj["card_no"] <= 64:
            card = Rocks(**obj)
        elif obj["card_no"] <= 70:
            card = Map(**obj)
        card_list += [card]
    return card_list