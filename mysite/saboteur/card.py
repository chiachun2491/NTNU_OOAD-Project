#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# Card.py
# @Author : DannyLeee (dannylee94049@gmail.com)
# @Link   : https://github.com/DannyLeee
# @Date   : 2021/4/16 下午11:02:05

import json
from enum import IntEnum


class Card_Activate():
    """abstract class of strategy pattern"""

    def activate(self, card, gc, pos: int, action_type: int) -> dict:
        """abstract method of strategy pattern

        set board when the player behavior is legality
        :parms
            card: the card need to be set on board or player (Card)
            gc: the game controller object (GameController)
            pos: the position of the card determine on board or player (Int)
                (see Player.play_card for more position definition)
            action_type: the choice of repair which tool of the multi-repair action card (Int)
        :returns:
            message type and message pass to web server (dict)
        """
        pass


class Dig(Card_Activate):
    """class of strategy pattern for Road activate"""

    def activate(self, card, gc, pos: int, action_type: int) -> dict:
        r = pos // 9
        c = pos % 9
        gc.board[r][c] = card
        return {"msg_type": "INFO", "msg": f"{gc.now_play} 放置道路在 ({r+1}, {c+1})"}


class Influence(Card_Activate):
    """class of strategy pattern for Action activate"""

    def activate(self, card, gc, pos: int, action_type: int) -> dict:
        pos -= 45
        Influenced = gc.player_list[pos]
        gc.set_player_state([Influenced], card, action_type)
        is_break = "破壞" if card.is_break else "修理"
        tools = ["礦燈", "礦車", "礦鎬"]
        action_type = tools[action_type]
        return_msg = {"msg_type": "INFO",  "msg": f"{gc.now_play} {is_break}了 {Influenced.id} 的{action_type}"}
        return return_msg


class Destroy(Card_Activate):
    """class of strategy pattern for Rocks activate"""

    def activate(self, card, gc, pos: int, action_type: int) -> dict:
        r = pos // 9
        c = pos % 9
        gc.board[r][c] = Road(-1)
        return_msg = {"msg_type": "INFO",  "msg": f"{gc.now_play} 使用落石摧毀 ({r+1}, {c+1})"}
        return return_msg


class Peek(Card_Activate):
    """class of strategy pattern for Map activate"""

    def activate(self, card, gc, pos: int, action_type: int) -> dict:
        r = pos // 9
        c = pos % 9
        msg = f"({r+1}, {c+1}) "
        msg += "金礦" if gc.board[r][c].card_no == 71 else "不是金礦"
        return_msg = {"msg_type": "PEEK", "msg": msg}  # pass msg to player
        return return_msg


class Card_Legality():
    """abstract class of strategy pattern"""
    
    def check_legality(self, gc, player, card, pos: int, action_type: int) -> "tuple[bool, str]":
        """abstract method of strategy pattern

        check the player behavior is legality or not

        :parms
            gc: the game controller object
            player: the player who play card in this turn (Player)
            card: the card which `player` play (Card)
            pos: the position that the `card` need to be set (Int)
            action_type: the choice of repair which tool of the multi-repair action card (Int)

        :return
            legality: the `player` play the `card` at the `pos` is legal or not (Bool)
            illegal_msg: the illegal message will show to player if illegal (Str)
        """
        pass


class Road_Legality(Card_Legality):
    """class of strategy pattern for Road legality check"""
    
    def check_legality(self, gc, player, card, pos: int, action_type: int) -> "tuple[bool, str]":
        legality = True
        illegal_msg = ""
        if pos <= 44:
            r = pos // 9
            c = pos % 9
            if sum(player.action_state):
                legality = False
                illegal_msg = "由於某些工具被破壞 無法放置道路"
            elif gc.board[r][c].card_no != -1:
                legality = False
                illegal_msg = "此處已有道路"
            elif self.connect_to_rock(gc, card, r, c):
                legality = False
                illegal_msg = "道路不能連接至岩壁"
            else:
                # check road is connect to start or not
                went = [[False for _ in range(9)] for _ in range(5)]
                legality = gc.connect_to_start(card, r, c, went)
                illegal_msg = "此處並無法連通至起始道路"
        else:
            legality = False
            illegal_msg = "此卡牌無法對玩家使用"
        return legality, illegal_msg

    def connect_to_rock(self, gc, card, row: int, col: int) -> int:
        """check the road is connect to road beside or not

        :parms
            gc: the game controller object (GameController)
            card: the present road (Road)
            row: the present row (Int)
            col: the present column (Int)

        :returns
            is_connect: the num of road is connect to rock (Int)
        """
        is_connect = 0

        # check above, under, left and right road side's are rock or not
        if row != 1 and col != 8 or row != 3 and col != 8:  # if pos = 17 and 35 ignore above and under connect to rock
            if row - 1 >= 0:
                beside = gc.board[row - 1][col]
                if beside.card_no != -1 and \
                        (card.connected[1] ^ gc.board[row - 1][col].connected[3]):
                    is_connect += 1
            if row + 1 <= 4:
                beside = gc.board[row + 1][col]
                if beside.card_no != -1 and \
                        (card.connected[3] ^ gc.board[row + 1][col].connected[1]):
                    is_connect += 1
        if col - 1 >= 0:
            beside = gc.board[row][col - 1]
            if beside.card_no != -1 and \
                    (card.connected[4] ^ gc.board[row][col - 1].connected[2]):
                is_connect += 1
        if row != 0 and col != 7 or row != 2 and col != 7 or row != 4 and col != 7:  # if pos = 7 and 25 and 43 ignore right connect to rock
            if col + 1 <= 8:
                beside = gc.board[row][col + 1]
                if beside.card_no != -1 and \
                        (card.connected[2] ^ gc.board[row][col + 1].connected[4]):
                    is_connect += 1

        return is_connect


class Action_Legality(Card_Legality):
    """class of strategy pattern for Action legality check"""

    def check_legality(self, gc, player, card, pos: int, action_type: int) -> "tuple[bool, str]":
        legality = True
        illegal_msg = ""
        if pos <= 44:
            legality = False
            illegal_msg = "此卡牌無法放置於桌面上"
        else:
             # action_type = -1 if use multi repair card
            if action_type != -1 and action_type not in card.action_type:
                legality = False
                illegal_msg = "此卡牌無法修理選擇的工具"
            else:
                pos -= 45
                legality = gc.player_list[pos].action_state[action_type] ^ card.is_break
                is_break = "破壞" if card.is_break else "修理"
                tools = ["礦燈", "礦車", "礦鎬"]
                action_type = tools[action_type]
                illegal_msg = "" if legality else f"此玩家的 {action_type} 已被{is_break}"
        return legality, illegal_msg


class Rocks_Legality(Card_Legality):
    """class of strategy pattern for Rocks legality check"""

    def check_legality(self, gc, player, card, pos: int, action_type: int) -> "tuple[bool, str]":
        legality = True
        illegal_msg = ""
        if pos <= 44:
            r = pos // 9
            c = pos % 9
            if gc.board[r][c].road_type != RoadType.normal:
                legality = False
                illegal_msg = "落石無法摧毀起始/終點道路"
            elif gc.board[r][c].card_no == -1:
                legality = False
                illegal_msg = "落石無法摧毀沒有道路的位置"
        else:
            legality = False
            illegal_msg = "此卡牌無法對玩家使用"
        return legality, illegal_msg


class Map_Legality(Card_Legality):
    """class of strategy pattern for Map legality check"""

    def check_legality(self, gc, player, card, pos: int, action_type: int) -> "tuple[bool, str]":
        legality = True
        illegal_msg = ""
        if pos <= 44:
            r = pos // 9
            c = pos % 9
            if gc.board[r][c].road_type != RoadType.end:
                    legality = False
                    illegal_msg = "地圖卡不可使用於非終點道路"
        else:
            legality = False
            illegal_msg = "此卡牌無法對玩家使用"
        return legality, illegal_msg


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
    def __init__(self, card_no=-1, active_func: Card_Activate=None, legality_func: Card_Legality=None):
        self.card_no = card_no
        self.active_func = active_func
        self.legality_func = legality_func

    def to_dict(self):
        """output Card object representation with Dict"""
        return {
            "card_no": self.card_no
        }

    def __eq__(self, other):
        return self.card_no == other.card_no

    def activate(self, gc, pos: int, action_type: int) -> dict:
        """delegates some work to the strategy object instead of
        implementing multiple versions of the algorithm on its own.
        (except fold card which doing the same thing for every type of card)

        :parms
            gc: the game controller object (GameController)
            pos: the position of `card` will activate (Int)
            action_type: the choice of repair which tool of the multi-repair action card (Int)
        :returns
            return_msg: message type and message pass to web server (if have msg Dict or None)
                format same as `GameController.state_control()` defined
        """

        return_msg = None
        if pos == -1:
            gc.fold_deck += [self]
            return_msg = {"msg_type": "INFO", "msg": f"{gc.now_play} 棄牌"}
        else:
            return_msg = self.active_func.activate(self, gc, pos, action_type)
        return return_msg

    def check_legality(self, gc, player, pos, action_type) -> "tuple[bool, str]":
        legality = True
        return_msg = ""
        if pos == -1:
            pass # do nothing
        else:
            legality, return_msg = self.legality_func.check_legality(gc, player, self, pos, action_type)
        return legality, return_msg


class RoadType(IntEnum):
    """road type for road card"""
    start = 0
    normal = 1
    end = 2


class Road(Card):

    def __init__(self, card_no=-1, rotate: int = 0, road_type: RoadType = RoadType.normal,
                 active_func: Card_Activate = Dig(),
                 legality_func: Card_Legality = Road_Legality()):
        """road card

        connected: list of connection (middle, top, right, down, left) 0 for not connect (List)
        """
        super().__init__(card_no=card_no, active_func=active_func, legality_func=legality_func)
        self.rotate = rotate
        self.road_type = road_type
        self.connected = self.get_connection()

    def to_dict(self):
        """output Road object representation with Dict"""
        dict_ = super().to_dict()
        dict_.update({
            "rotate": self.rotate,
            "road_type": int(self.road_type)
        })
        return dict_

    def get_connection(self):
        """set the road connection for road connection checking

        :returns
            connected: the connection of the road (List)
        """
        connected = [0] * 5
        if self.card_no >= 0 and self.card_no <= 3 or \
                self.card_no >= 13 and self.card_no <= 17 or \
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


class Action(Card):
    """action card"""

    def __init__(self, card_no=-1, action_type=None, is_break=None,
                 active_func: Card_Activate = Influence(),
                 legality_func: Card_Legality = Action_Legality()):
        super().__init__(card_no=card_no, active_func=active_func, legality_func=legality_func)
        if action_type is None:
            self.action_type = self.get_action()
        else:
            self.action_type = action_type
        if is_break is None:
            self.is_break = self.get_break()
        else:
            self.is_break = is_break

    def to_dict(self):
        """output Action object representation with Dict"""
        dict_ = super().to_dict()
        dict_.update({
            "action_type": self.action_type,
            "is_break": self.is_break
        })
        return dict_

    def get_action(self):
        if 44 <= self.card_no and self.card_no <= 48:
            return [ActionType.miner_lamp]
        elif 49 <= self.card_no and self.card_no <= 53:
            return [ActionType.minecart]
        elif 54 <= self.card_no and self.card_no <= 58:
            return [ActionType.mine_pick]
        elif self.card_no == 59:
            return [ActionType.mine_pick, ActionType.minecart]
        elif self.card_no == 60:
            return [ActionType.miner_lamp, ActionType.minecart]
        elif self.card_no == 61:
            return [ActionType.mine_pick, ActionType.miner_lamp]

    def get_break(self):
        if 44 <= self.card_no and self.card_no <= 46 \
                or 49 <= self.card_no and self.card_no <= 51 \
                or 54 <= self.card_no and self.card_no <= 56:
            return True
        return False


class Rocks(Card):
    """the card can destroy normal road"""

    def __init__(self, card_no=-1, active_func: Card_Activate = Destroy(),
                 legality_func: Card_Legality = Rocks_Legality()):
        super().__init__(card_no=card_no, active_func=active_func, legality_func=legality_func)


class Map(Card):
    """the card can peek gold(end road)"""

    def __init__(self, card_no=-1, active_func: Card_Activate = Peek(),
                 legality_func: Card_Legality = Map_Legality()):
        super().__init__(card_no=card_no, active_func=active_func, legality_func=legality_func)
