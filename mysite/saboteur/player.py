#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# card.py
# @Author : DannyLeee (dannylee94049@gmail.com)
# @Link   : https://github.com/DannyLeee
# @Date   : 2021/4/16 下午10:49:45

import logging

from .card import *
from .util import *


class Player():
    """Player"""

    def __init__(self, id, point=0, hand_cards=None, role=0, action_state=[False] * 3):
        self.id = id
        self.point = point
        if hand_cards is None:
            self.hand_cards = []
        else:
            self.hand_cards = create_card_list(hand_cards)
        self.role = role
        self.action_state = action_state

    def __repr__(self):
        """output json format representation with Str"""
        repr_ = {
            "id": self.id,
            "point": self.point,
            "hand_cards": self.hand_cards,
            "role": self.role,
            "action_state": self.action_state
        }
        return json.dumps(repr_, default=serialize)

    def __eq__(self, id: str):
        return self.id == id

    def play_card(self, card_id: int, pos: int, rotate: int = 0, action_type: int = -1) -> (Card, int, int):
        """play a road card on to board or an action card to some player or fold card

        :parms
            card_id: the player play card's id (Int)
            pos: the position of the card (Int)
                pos define:
                    -1:         game_controller.fold_deck
                    0 ~ 44:     game_controller.board
                    45 ~ 54:    game_controller.player_list[0 ~ 9]
            action_type:
                the choice of repair which tool of the multi-repair action card (Int)
        :returns
            card: the card that player play (Card)
            pos: the position of the card (Int)
            action_type:
                the choice of repair which tool of the multi-repair action card (Int)
            """

        idx = self.hand_cards.index(Card(card_id))
        card = self.hand_cards.pop(idx)
        if hasattr(card, 'rotate'):
            card.rotate = rotate
        logging.debug(f"{card} pos: {pos} action_type: {action_type}")
        return card, pos, action_type
