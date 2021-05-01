#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# card.py
# @Author : DannyLeee (dannylee94049@gmail.com)
# @Link   : https://github.com/DannyLeee
# @Date   : 2021/4/16 下午10:49:45

import logging

from card import *

"""
    Player
"""
class Player():
    def __init__(self,):
        self.point = 0
        self.hand_cards = [Card() for _ in range(6)]
        self.role = True
        self.action_state = [False for _ in range(3)]
        pass

    """
        paly a road card on to board or an action card to some player

        :returns card: the card that player play
        :returns pos: the position of the card
        pos define:
            -1:         game_controller.fold_deck
            0 ~ 44:     game_controller.board
            45 ~ 54:    game_controller.player_list[0 ~ 9]
        :returns action_type: the choice of repair which tool to of the multi-repair action card
    """
    def play_card(self) -> (Card, int):
        card = self.hand_cards.pop(0) # debug
        logging.debug(card)
        pos = input("input position: ") # debug
        action_type = -1 # debug
        if isinstance(card, Action):
            if isinstance(card.action_type, list):
                action_type = input("input action type: ") # debug
            else:
                action_type = card.action_type
        elif isinstance(card, Road) and pos != "-1":
            rotate = input("input rotate degrees: ") # debug
            card.rotate = int(rotate)
            card.connected = card.road_connection()

        return card, int(pos), int(action_type) # debug int()