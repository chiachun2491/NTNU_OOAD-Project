#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# card.py
# @Author : DannyLeee (dannylee94049@gmail.com)
# @Link   : https://github.com/DannyLeee
# @Date   : 2021/4/16 下午10:49:45

from card import Card

"""
    Player
"""
class Player():
    def __init__(self,):
        self.point = 0
        self.hand_cards = []
        self.role = True
        self.action_state = [False for _ in range(3)]
        pass

    """
        paly a road card on to board or an action card to some player
    """
    def play_card(self, card: Card) -> Card:
        pass

    def fold_card(self, card: Card) -> Card:
        pass