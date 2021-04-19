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
    """
    def play_card(self) -> (Card, int):
        card = self.hand_cards.pop(0) # debug
        pos = input("input position:") # debug
        return card, int(pos) # debug int()