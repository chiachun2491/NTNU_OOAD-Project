#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Card.py
# @Author : DannyLeee (dannylee94049@gmail.com)
# @Link   : https://github.com/DannyLeee
# @Date   : 2021/4/16 下午11:02:05

import json
from enum import IntEnum


class Card():
    """card: the abstract class of all cards

    card number define:
        road: 0 ~ 43
            0:          ╬ [1, 1, 1, 1, 1] start road
            1:          ╬ [1, 1, 1, 1, 1] end road(gold) 71 (hide)
            2:          ╔ [1, 1, 1, 1, 1] end road(rock) 72 (hide)
            3:          ╔ [1, 1, 1, 1, 1] end road(rock) 73 (hide)
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
    """

    # -1 as empty card place
    def __init__(self, card_no=-1):
        self.card_no = card_no

    def __repr__(self):
        """output json format representation with Str"""
        repr_ = {
            "card_no": self.card_no
        }
        return json.dumps(repr_)

    def __eq__(self, other):
        return self.card_no == other.card_no


class RoadType(IntEnum):
    """road type for road card"""
    start = 0
    normal = 1
    end = 2


class Road(Card):

    def __init__(self, card_no=-1, rotate: int = 0, road_type: RoadType = RoadType.normal, connected: list = None):
        """road card

        connected: list of connection (middle, top, right, down, left) 0 for not connect (List)
        """
        super().__init__(card_no=card_no)
        self.rotate = rotate
        self.road_type = road_type
        self.connected = self.get_connection()

    def __repr__(self):
        """output json format representation with Str"""
        repr_ = super().__repr__()
        repr_ = json.loads(repr_)
        repr_.update({
            "rotate": self.rotate,
            "road_type": int(self.road_type)
        })
        return json.dumps(repr_)

    def get_connection(self):
        """set the road connection for road connection checking

        :returns
            connected: the connection of the road (List)
        """
        connected = [0] * 5
        if self.card_no >= 0 and self.card_no <= 3 or \
            self.card_no >= 13 and self.card_no <= 17 or\
            self.card_no >= 71 and self.card_no <= 73:
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

        if self.rotate:
            connected[1], connected[3] = connected[3], connected[1]
            connected[2], connected[4] = connected[4], connected[2]

        return connected


class ActionType(IntEnum):
    """action type for action card"""
    miner_lamp = 0
    minecart = 1
    mine_pick = 2
    rocks = 3
    map = 4


class Action(Card):
    """action card"""

    def __init__(self, card_no=-1, action_type=None, is_break=None):
        super().__init__(card_no=card_no)
        if action_type is None:
            self.action_type = self.get_action()
        else:
            self.action_type = action_type
        if is_break is None:
            self.is_break = self.get_break()
        else:
            self.is_break = is_break

    def __repr__(self):
        """output json format representation with Str"""
        repr_ = super().__repr__()
        repr_ = json.loads(repr_)
        repr_.update({
            "action_type": self.action_type,
            "is_break": self.is_break
        })
        return json.dumps(repr_)

    def get_action(self):
        if 44 <= self.card_no and self.card_no <= 48:
            return ActionType.miner_lamp
        elif 49 <= self.card_no and self.card_no <= 53:
            return ActionType.minecart
        elif 54 <= self.card_no and self.card_no <= 58:
            return ActionType.mine_pick
        elif self.card_no == 59:
            return [ActionType.mine_pick, ActionType.minecart]
        elif self.card_no == 60:
            return [ActionType.miner_lamp, ActionType.minecart]
        elif self.card_no == 61:
            return [ActionType.mine_pick, ActionType.miner_lamp]
        elif 62 <= self.card_no and self.card_no <= 64:
            return ActionType.rocks
        elif 65 <= self.card_no and self.card_no <= 70:
            return ActionType.map

    def get_break(self):
        if 44 <= self.card_no and self.card_no <= 46 \
                or 49 <= self.card_no and self.card_no <= 51 \
                or 54 <= self.card_no and self.card_no <= 56:
            return True
        return False


class Rocks(Action):
    """the card can destroy normal road"""
    def __init__(self, card_no=-1, action_type=ActionType.rocks, is_break=False):
        super().__init__(card_no=card_no, action_type=action_type, is_break=is_break)

    def __repr__(self):
        return super().__repr__()

    def destroy_road(self, ):
        pass


class Map(Action):
    """the card can peek gold(end road)"""
    def __init__(self, card_no=-1, action_type=ActionType.map, is_break=False):
        super().__init__(card_no=card_no, action_type=action_type, is_break=is_break)

    def __repr__(self):
        return super().__repr__()

    def peek_gold(self, ):
        pass
