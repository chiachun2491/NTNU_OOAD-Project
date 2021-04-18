#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# game_controller.py
# @Author : DannyLeee (dannylee94049@gmail.com)
# @Link   : https://github.com/DannyLeee
# @Date   : 2021/4/16 下午9:38:52

from enum import Enum
from random import shuffle

from player import Player
from card import *


"""
    game state at each round
"""
class Game_State(Enum):
    reset = 0
    play = 1
    game_point = 2
    set_point = 3

"""
    Game_Controller
"""
class Game_Controller():
    def __init__(self, num_player):
        self.round = 0
        self.state = Game_State.reset
        self.card_pool = [Card() for _ in range(71)]
        self.fold_deck = [Card() for _ in range(0)]
        self.num_player = num_player
        self.player_list = [Player() for _ in range(self.num_player)]
        self.board = [[Card() for _ in range(9)] for _ in range(5)]
        
        self.role_list = self.set_role()
        pass

    def __repr__(self):
        return f"""
round: {self.round} player numbers: {self.num_player}
state: {self.state}
card pool: {len(self.card_pool)}
folddeck: {len(self.fold_deck)}
role list: {self.role_list}"""

    """
        set number of role of each round by rule
    """
    def set_role(self):
        pass

    """
        a state mechine control game state
    """
    def state_control(self,):
        pass

    """
        reset board at new round start        
    """
    def board_reset(self,):
        pass

    """
        random role for each players at new round start
    """
    def set_player_role(self):
        pass

    """
        set player(s) action state
    """
    def set_player_state(self, player_list, action: Action=None):
        pass

    """
        reset the board, card pool, players state at new round start
    """
    def round_reset(self,):
        pass

    """
        check the player behavior is legality or not
    """
    def check_legality(self, player: Player, card: Card):
        pass

    """
        deal card for player(s)
    """
    def deal_card(self, player_list):
        pass

    """
        calculate each player points and rank
    """
    def calc_rank(self,):
        pass

    def visualization(self,):
        pass


if __name__ == '__main__':
    gc = Game_Controller(4)
    print(gc)