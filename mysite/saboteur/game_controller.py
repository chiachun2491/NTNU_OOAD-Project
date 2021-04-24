#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# game_controller.py
# @Author : DannyLeee (dannylee94049@gmail.com)
# @Link   : https://github.com/DannyLeee
# @Date   : 2021/4/16 下午9:38:52

from enum import Enum
from random import shuffle
import logging
logging.basicConfig(level=logging.DEBUG, format="%(levelname)s: %(message)s")

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
        self.card_pool = [Card(idx) for idx in range(4, 71)]
        self.fold_deck = [Card() for _ in range(0)]
        self.num_player = num_player
        self.player_list = [Player() for _ in range(self.num_player)]
        self.board = [[Road() for _ in range(9)] for _ in range(5)]
        self.role_list = self.set_role()
        self.gold_list = []
        self.gold_list += [1 for _ in range(16)]
        self.gold_list += [2 for _ in range(8)]
        self.gold_list += [3 for _ in range(4)]
        shuffle(self.gold_list)
        hands_rule = [None,None,None,6,6,6,5,5,4,4,4] # number of hand cards by rule
        self.num_hands = hands_rule[num_player]

    def __repr__(self):
        return f"""
round: {self.round} player numbers: {self.num_player}
state: {self.state}
card pool: {len(self.card_pool)}
fold deck: {len(self.fold_deck)}
role list: {self.role_list}
gole_list: {self.gold_list}"""

    """
        set number of role of each round by rule
    """
    def set_role(self):
        num_bad_rule = [None,None,None,1,1,2,2,3,3,3,4] # bad dwarve num by rule
        role_list = []
        num_bad = num_bad_rule[self.num_player]

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
                logging.info(f"round {self.round} start")
                self.round_reset()
                self.state = Game_State.play
                self.view_player(self.player_list) # debug
            elif self.state == Game_State.play:
                # TODO: play game
                turn = 0
                while True: # debug
                    now_play = self.player_list[turn % self.num_player]
                    
                    logging.debug(f"player {turn % self.num_player}'s turn:")
                    
                    card, pos, action_type = now_play.play_card()
                    legal, illegal_msg = self.check_legality(now_play, card, pos, action_type)
                    while not legal:
                        # return illegal card to player
                        self.deal_card([now_play], card)
                        logging.debug(f"{illegal_msg}\n")
                        card, pos, action_type = now_play.play_card()
                        legal, illegal_msg = self.check_legality(now_play, card, pos, action_type)

                    self.set_board(card, pos, action_type)
                    
                    if len(self.card_pool) > 0:
                        self.deal_card([now_play])
                    
                    flag = 0
                    for player in self.player_list:
                        if len(player.hand_cards) == 0:
                            flag += 1

                    if flag == self.num_player:
                        break

                    turn += 1
                logging.info(f"round {self.round} end")
                self.state = Game_State.set_point # debug set_point
            elif self.state == Game_State.game_point:
                winner = self.player_list[0] # debug
                self.calc_point(winner, [p for p in self.player_list if p.role==winner.role]) # debug(parameter)
                self.view_player(self.player_list) # debug

                if self.round == 3:
                    self.state = Game_State.set_point
                    continue
                self.state = Game_State.reset
            elif self.state == Game_State.set_point:
                self.calc_rank()
                self.round += 1

            # self.visualization() # debug

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
        self.role_list = self.set_role()
        shuffle(self.role_list)
        for i, player in enumerate(self.player_list):
            player.role = self.role_list[i]
        self.role_list.pop() # pop the last identity card that doesn't use

    """
        set player(s) action state
        :parms player_list: List[Player]
        :parms action_type: the choice of repair which tool to of the multi-repair action card
    """
    def set_player_state(self, player_list, action: Action=None, action_type: int=-1):
        if self.state == Game_State.reset:
            for player in player_list:
                player.action_state = [False for _ in range(3)]
        elif self.state == Game_State.play:
            player = player_list[0]
            player.action_state[action_type] = action.is_break

    """
        reset the board, card pool, players state at new round start
    """
    def round_reset(self,):
        self.state = Game_State.reset
        self.board_reset()
        self.set_player_role()
        self.set_player_state(self.player_list)
        self.card_pool = [Road(idx) for idx in range(4, 18)] # debug 15
        self.card_pool += [Action(idx, is_break=False) for idx in range(44, 46)] # debug 2 good lamp
        self.card_pool += [Action(idx, is_break=True) for idx in range(46, 49)] # debug 3 bad lamp
        self.card_pool += [Rocks(idx, is_break=False) for idx in range(62, 65)] # debug 3 rocks
        self.card_pool += [Map(idx, is_break=False) for idx in range(65, 67)] # debug 2 map
        self.card_pool += [Action(59, [Action_Type.mine_pick, Action_Type.minecart])] # debug
        shuffle(self.card_pool)
        self.deal_card(self.player_list)

    """
        check the player behavior is legality or not
        :parms player: the player who play card in this turn
        :parms card: the card which `player` play
        :parms pos: the position that the `card` need to be set
        :parms action_type: the choice of repair which tool to of the multi-repair action card
        :return legality: the `player` play the `card` at the `pos` is legal or not
        :return illegal_msg: the illegal message will show to player if illegal
    """
    def check_legality(self, player: Player, card: Card, pos: int, action_type: int) -> (bool, str):
        legality = True
        illegal_msg = ""

        if pos == -1: # fold card
            pass # do nothing
        elif pos <= 44: # play road card on board
            r = pos //9
            c = pos % 9
            if isinstance(card, Road):
                if sum(player.action_state):
                    legality = False
                    illegal_msg = "some tool are broken can't build road"
                elif self.board[r][c].card_no != -1:
                    legality = False
                    illegal_msg = "the position have road already"
                # TODO: check road is connect to start or not
                pass
        
            elif isinstance(card, Rocks):
                if self.board[r][c].road_type == Road_Type.start \
                    or self.board[r][c].road_type == Road_Type.end:
                    legality = False
                    illegal_msg = "rock card can't destroy start/end road"
                elif self.board[r][c].card_no == -1:
                        legality = False
                        illegal_msg = "rock card can't destroy empty position"

            elif isinstance(card, Map):
                if self.board[r][c].road_type != Road_Type.end:
                    legality = False
                    illegal_msg = "map card can't peek non end road"
            
            else:
                legality = False
                illegal_msg = "except rocks and map action, card can't play on card board"
        
        else: # play action card to player
            pos -= 45
            legality = self.player_list[pos].action_state[action_type] ^ card.is_break
            illegal_msg = "" if legality else "the player's tool are already broken/repaired"

        return legality, illegal_msg

    """
        set board when the player behavior is legality
        :parms card: the card need to be set on board or player
        :parms pos: the position of the card determine on board or player
                    (see Player.play_card for more position definition)
        :parms action_type: the choice of repair which tool to of the multi-repair action card
    """
    def set_board(self, card: Card, pos: int, action_type: int):
        if pos == -1: # fold any card
            self.fold_deck += [card]
        elif pos <= 44: # play road card on board
            r = pos //9
            c = pos % 9
            if isinstance(card, Road):
                self.board[r][c] = card
            elif isinstance(card, Rocks):
                self.board[r][c] = Road(-1)
            elif isinstance(card, Map):
                logging.debug(self.board[r][c])
                # TODO: pass msg to player
        else: # play action card to player
            pos -= 45
            self.set_player_state([self.player_list[pos]], card, action_type)

    """
        deal card for player(s)
        check card_pool length before call
        :parms player_list: List[Player]
        :parms card: return the card if player play an illegal card (Card)
    """
    def deal_card(self, player_list, card: Card=None):
        for player in player_list:
            if self.state == Game_State.reset:
                player.hand_cards = self.card_pool[ : self.num_hands]
                self.card_pool = self.card_pool[self.num_hands : ]
            elif self.state == Game_State.play:
                if card is not None:
                    player.hand_cards += [card]
                else:
                    player.hand_cards += [self.card_pool.pop(0)]

    """
        calculate points for each player at every game point.
        and consider all player are greedy select the highest point gold card
        :parms winner: which player connected the end road that has gold (List[Player])
        :parms winner_list: players who is same team with winner
    """
    def calc_point(self, winner: Player, winner_list):
        num_winner = len(winner_list)

        if num_winner == 0: # sometime no winner in 3,4 player
            return

        if winner.role: # good dwarve win
            gold_list = sorted(self.gold_list[ : num_winner], reverse=True)
            self.gold_list = self.gold_list[num_winner : ]
            winner_list.reverse()
            idx = winner_list.index(winner)
            while len(gold_list) > 0:
                winner_list[idx % num_winner].point += gold_list.pop(0)
                idx += 1
        else:
            point_rule = [None, 4, 3, 3, 2] # bad dwarve point by rule

            for player in range(num_winner):
                point = point_rule[num_winner]
                winner_list[player].point += point
                while point > 0:
                    idx = 0
                    while idx < len(self.gold_list):
                        if point - self.gold_list[idx] >= 0:
                            point -= self.gold_list.pop(idx)
                        idx += 1

    """
        calculate each player points and rank
    """
    def calc_rank(self):
        pass

    """
        visualize the board (may pass to frontend render)
    """
    def visualization(self):
        for row in range(5):
            print([self.board[row][col] for col in range(9)])
        print()
        # TODO: pass to frontend render

    # for debug
    def view_player(self, player_list):
        for i, player in enumerate(player_list):
            logging.debug(f"{i} point: {player.point}\trole: {player.role}\thand cards: {player.hand_cards} {len(player.hand_cards)}\tstate: {player.action_state}")

if __name__ == '__main__':
    gc = Game_Controller(4)
    logging.info(gc)
    gc.state_control()
    gc.visualization()
    logging.info(gc)
    gc.view_player(gc.player_list)