#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Card.py
# @Author : DannyLeee (dannylee94049@gmail.com)
# @Link   : https://github.com/DannyLeee
# @Date   : 2021/4/16 下午11:02:05

from enum import Enum, IntEnum

"""
    card
    the abstract class of all cards
    card number define:
        road: 0 ~ 43
            0:          ╬ [1, 1, 1, 1, 1] start road
            1:          ╬ [1, 1, 1, 1, 1] end road(gold)
            2:          ╔ [1, 1, 1, 1, 1] end road(rock)
            3:          ╔ [1, 1, 1, 1, 1] end road(rock)
            4 ~ 7:      ║ [1, 1, 0, 1, 0]
            8 ~ 12:     ╠ [1, 1, 1, 1, 0]
            13 ~ 17:    ╬ [1, 1, 1, 1, 1]
            18 ~ 21:    ╔ [1, 0, 1, 1, 0]
            22 ~ 26:    ╗ [1, 0, 0, 1, 1]
            27:         ╥ [0, 0, 0, 1, 0]
            28:           [0, 1, 0, 1, 1]
            29:           [0, 1, 1, 1, 1]
            30:           [0, 0, 1, 1, 0]
            31:           [0, 0, 0, 1, 1]
            32:         ╡ [0, 0, 0, 0, 1]
            33 ~ 37:    ╩ [1, 1, 1, 0, 1]
            38 ~ 40:    ═ [1, 0, 1, 0, 1]
            41:         ╫ [0, 1, 0, 1, 0]
            42:           [0, 1, 1, 0, 1]
            43:         ╪ [0, 0, 1, 0, 1]
        
        action: 44 ~ 70
            44 ~ 48:    miner_lamp(3 break)
            49 ~ 53:    minecart(3 break)
            54 ~ 58:    mine_pick(3 break)
            59:         mine_pick + minecart
            60:         mine_lamp + minecart
            61:         mine_pick + mine_lamp
            62 ~ 64:    rocks
            65 ~ 70:     map
        
        identity: 71 ~ 81 (skip)

"""
class Card():
    # -1 as empty card place
    def __init__(self, card_no=-1):
        self.card_no = card_no

    def __repr__(self):
        return f"{self.card_no}"

"""
    road type for road card
"""
class Road_Type(Enum):
    start = 0
    normal = 1
    end = 2
    
"""
    road card
    connected: [int] *5 (middel, top, right, down, left) 0 for not connect
"""
class Road(Card):
    def __init__(self, card_no=-1, road_type: Road_Type=Road_Type.normal):
        super().__init__(card_no=card_no)
        self.rotate = 0
        self.road_type = road_type
        self.connected = self.road_connection()

    def road_connection(self):
        connected = [0] * 5
        if self.card_no >= 0 or self.card_no <= 3 or \
            (self.card_no >= 13 and self.card_no <= 17):
            connected = [1] * 5
        elif self.card_no >= 18 and self.card_no <= 21:
            connected = [1, 0, 1, 1, 0]
        elif self.card_no >= 22 and self.card_no <= 26:
            connected = [1, 0, 0, 1, 1]
        elif self.card_no >= 4 and self.card_no <= 7:
            connected = [1, 1, 0, 1, 0]
        elif self.card_no >= 8 and self.card_no <= 12:
            connected = [1, 1, 1, 1, 0]
        elif self.card_no == 27:
            connected = [0, 0, 0, 1, 0]
        elif self.card_no == 28:
            connected = [0, 1, 0, 1, 1]
        elif self.card_no == 29:
            connected = [0, 1, 1, 1, 1]
        elif self.card_no == 30:
            connected = [0, 0, 1, 1, 0]
        elif self.card_no == 31:
            connected = [0, 0, 0, 1, 1]
        elif self.card_no == 32:
            connected = [0, 0, 0, 0, 1]
        elif self.card_no >= 33 and self.card_no <= 37:
            connected = [1, 1, 1, 0, 1]
        elif self.card_no >= 38 and self.card_no <= 40:
            connected = [1, 0, 1, 0, 1]
        elif self.card_no == 41:
            connected = [0, 1, 0, 1, 0]
        elif self.card_no == 42:
            connected = [0, 1, 1, 0, 1]
        elif self.card_no == 43:
            connected = [0, 0, 1, 0, 1]

        if self.rotate != 0:
            connected[1], connected[3] = connected[3], connected[1]
            connected[2], connected[4] = connected[4], connected[2]

        return connected

"""
    action type for action card
"""
class Action_Type(IntEnum):
    miner_lamp = 0
    minecart = 1
    mine_pick = 2
    rocks = 3
    map = 4

"""
    action card
    :parms action_type: List[Action_Type]
"""
class Action(Card):
    def __init__(self, card_no=-1, action_type=Action_Type.miner_lamp, is_break=False):
        super().__init__(card_no=card_no)
        self.action_type = action_type
        self.is_break = is_break

"""
    the card can destroy normal road
"""
class Rocks(Action):
    def __init__(self, card_no=-1, action_type=Action_Type.rocks, is_break=False):
        super().__init__(card_no=card_no, action_type=action_type, is_break=is_break)
    
    def destroy_road(self,):
        pass

"""
    the card can peek gold(end road)
"""
class Map(Action):
    def __init__(self, card_no=-1, action_type=Action_Type.map, is_break=False):
        super().__init__(card_no=card_no, action_type=action_type, is_break=is_break)

    def peek_gold(self,):
        pass

class Identity(Card):
    def __init__(self, card_no=-1, is_good=True):
        super().__init__(card_no=card_no)
        self.is_good = is_good