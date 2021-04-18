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
        role_list = []
        if self.num_player <= 4:
            num_bad = 1
        elif self.num_player <= 6:
            num_bad = 2
        elif self.num_player <= 9:
            num_bad = 3
        elif self.num_player <= 10:
            num_bad = 4
        role_list = [0] * num_bad
        role_list += [1] * (self.num_player + 1 - num_bad)
        return role_list

    """
        a state mechine control game state
    """
    def state_control(self,):
        while self.round <= 3:
            if self.state == Game_State.reset:
                self.round += 1
                print(f"round {self.round} start")
                self.round_reset()
                self.state = Game_State.play                
            elif self.state == Game_State.play:
                # TODO: play game
                print("playing end")
                self.state = Game_State.game_point
            elif self.state == Game_State.game_point:
                # TODO: set player point
                if self.round == 3:
                    self.state = Game_State.set_point
                    continue
                self.round_reset()
            elif self.state == Game_State.set_point:
                self.calc_rank()
                self.round += 1

            self.visualization()

    """
        reset board at new round start        
        board[5][9]
            start road at [2][0]
            end road at [0][8], [2][8], [4][8]
    """
    def board_reset(self,):
        self.board[2][0] = Road(0, Road_Type.start)
        end_road = [1, 2, 3]
        shuffle(end_road)
        i = 0
        for row in range(0, 5, 2):
            self.board[row][8] = Road(end_road[i], Road_Type.end)
            i += 1

    """
        random role for each players at new round start
    """
    def set_player_role(self):
        shuffle(self.role_list)
        for i, player in enumerate(self.player_list):
            player.role = self.role_list[i]

    """
        set player(s) action state
        :parms player_list: List[Player]
    """
    def set_player_state(self, player_list, action: Action=None):
        if self.state == Game_State.reset:
            for player in player_list:
                player.action_state = [False for _ in range(3)]
        elif self.state == Game_State.play:
            pass

    """
        reset the board, card pool, players state at new round start
    """
    def round_reset(self,):
        self.state = Game_State.reset
        self.board_reset()
        self.set_player_role()
        self.set_player_state(self.player_list)

    """
        check the player behavior is legality or not
    """
    def check_legality(self, player: Player, card: Card):
        pass

    """
        deal card for player(s)
        :parms player_list: List[Player]
    """
    def deal_card(self, player_list):
        pass

    """
        calculate each player points and rank
    """
    def calc_rank(self,):
        pass

    def visualization(self,):
        for row in range(5):
            print([self.board[row][col] for col in range(9)])
        print()
        pass


if __name__ == '__main__':
    gc = Game_Controller(4)
    print(gc)
    gc.visualization()
    gc.state_control()