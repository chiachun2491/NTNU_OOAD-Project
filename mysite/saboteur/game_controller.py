#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# game_controller.py
# @Author : DannyLeee (dannylee94049@gmail.com)
# @Link   : https://github.com/DannyLeee
# @Date   : 2021/4/16 下午9:38:52

from util import *
logging.basicConfig(level=logging.DEBUG, format="%(levelname)s: %(message)s")

from player import Player


"""
    game state at each round
"""
class Game_State(IntEnum):
    reset = 0
    play = 1
    game_point = 2
    set_point = 3

"""
    Game_Controller
"""
class Game_Controller():
    def __init__(self, round, num_player, player_list, game_state, turn, card_pool,\
                fold_deck, board, gold_stack, winner, winner_list, gold_pos):
        super().__init__()
        self.round = round
        self.num_player = num_player
        self.player_list = [Player(**obj) for obj in player_list]
        self.game_state = game_state
        self.turn = turn
        self.card_pool = create_card_list(card_pool)
        self.fold_deck = create_card_list(fold_deck)
        self.board = [[Road(**obj) for obj in row] for row in board]
        self.gold_stack = gold_stack
        self.winner = winner
        self.winner_list = winner_list
        self.gold_pos = gold_pos

    """
        Constructor created from id list
        :parms player_id_list: the player's id list which need to be create (List[Str])
        :returns: a Game_Controller object (Game_Controller)
    """
    @classmethod
    def from_scratch(cls, player_id_list):
        with open("reset.json") as fp:
            obj = json.load(fp)

        obj.update({
            "num_player": len(player_id_list),
            "player_list": [{"id": str(id)} for id in player_id_list]
        })
        return cls(**obj)

    """
        output json format representation with Str
    """
    def __repr__(self):
        repr_ = {
            "round": self.round,
            "num_player": self.num_player,
            "player_list": self.player_list,
            "game_state": int(self.game_state),
            "turn": self.turn,
            "card_pool": self.card_pool,
            "fold_deck": self.fold_deck,
            "board": self.board,
            "gold_stack": self.gold_stack,
            "winner": self.winner,
            "winner_list": self.winner_list,
            "gold_pos": self.gold_pos
        }
        return json.dumps(repr_, default=serialize)

    """
        output json format representation with Dict
    """
    def to_json(self):
        return json.loads(self.__repr__())

    """
        a state machine control game state and do game control
        :parms card_id: the player play card's id
        :parms postion: the player play card's position
        :parms act_type: the player play action's type
    """
    def state_control(self, card_id: int, position: int, act_type: int=-1):
        if self.game_state == Game_State.reset:
            self.round += 1
            logging.info(f"round {self.round} start")
            self.round_reset()
            self.game_state = Game_State.play
            logging.info(pformat(self.to_json()))
            # self.view_player(self.player_list) # debug
            self.visualization() # debug

        elif self.game_state == Game_State.play:
            now_play = self.player_list[self.turn % self.num_player]
            
            logging.debug(f"player {self.turn % self.num_player}'s turn:")
            
            card, pos, action_type = now_play.play_card(card_id, position, act_type)
            legal, illegal_msg = self.check_legality(now_play, card, pos, action_type)
            while not legal:
                # return illegal card to player
                self.deal_card([now_play], card)
                logging.debug(f"{illegal_msg}\n")
                card, pos, action_type = now_play.play_card(card_id, position, act_type)
                legal, illegal_msg = self.check_legality(now_play, card, pos, action_type)

            self.set_board(card, pos, action_type)

            flag = 0
            for player in self.player_list:
                if len(player.hand_cards) == 0:
                    flag += 1

            if pos==7 or pos==17 or \
                pos==25 or pos==35 or pos==43: # good dwarf win
                logging.debug(f"gold position: {self.gold_pos}")
                gold_row = self.gold_pos // 9
                gold_col = self.gold_pos % 9
                went = [[False for _ in range(9)] for _ in range(5)]
                if self.connect_to_start(self.board[gold_row][gold_col], gold_row, gold_col, went):
                    logging.info("GOOD dwarfs win")
                    self.winner_list = [winner for winner in self.player_list if winner.role]
                    self.winner = now_play
                    flag -= 1
                    logging.info(f"round {self.round} end")
                    self.game_state = Game_State.game_point
            
            if len(self.card_pool) > 0:
                self.deal_card([now_play])

            self.turn += 1
            if flag == self.num_player: # bad dwarf win
                logging.info("BAD dwarfs win")
                self.winner_list = [winner for winner in self.player_list if winner.role==False]
                logging.info(f"round {self.round} end")
                self.game_state = Game_State.game_point

        elif self.game_state == Game_State.game_point:
            self.calc_point(self.winner_list, self.winner)
            self.view_player(self.player_list) # debug
            self.winner = None
            self.winner_list = []
            self.game_state = Game_State.reset

            if self.round == 3:
                self.game_state = Game_State.set_point

        elif self.game_state == Game_State.set_point:
            self.calc_rank()
            self.round += 1

            # self.visualization() # debug

    """
        reset board at new round start        
        board[5][9]
            start road at [2][0]
            end road at [0][8], [2][8], [4][8]
    """
    def board_reset(self):
        self.board = [[Road() for _ in range(9)] for _ in range(5)]
        self.board[2][0] = Road(0, road_type=Road_Type.start)
        end_road = [1, 2, 3]
        shuffle(end_road)
        self.gold_pos = end_road.index(1)*18 + 8
        i = 0
        for row in range(0, 5, 2):
            self.board[row][8] = Road(end_road[i], road_type=Road_Type.end)
            i += 1

    """
        set number of role of each round by rule
        :returns: number of role (List)
    """
    def set_role(self):
        num_bad_rule = [None,None,None,1,1,2,2,3,3,3,4] # bad dwarve num by rule
        role_list = []
        num_bad = num_bad_rule[self.num_player]

        role_list = [False] * num_bad
        role_list += [True] * (self.num_player + 1 - num_bad)
        return role_list

    """
        random role for each players at new round start
    """
    def set_player_role(self):
        role_list = self.set_role()
        shuffle(role_list)
        for i, player in enumerate(self.player_list):
            player.role = role_list[i]

    """
        set player(s) action state
        :parms player_list: list of player that need to be set action state (List[Player])
        :parms action: action card played by some player (Action)
        :parms action_type: the choice of repair which tool of the multi-repair action card (Int)
    """
    def set_player_state(self, player_list: list, action: Action=None, action_type: int=-1):
        if self.game_state == Game_State.reset:
            for player in player_list:
                player.action_state = [False for _ in range(3)]
        elif self.game_state == Game_State.play:
            player = player_list[0]
            player.action_state[action_type] = action.is_break

    """
        when new round start, 
        reset the gold stack, board, players' role and state, card pool,
        then deal card for every player
    """
    def round_reset(self):
        if self.round == 1:
            self.gold_stack = []
            self.gold_stack += [1 for _ in range(16)]
            self.gold_stack += [2 for _ in range(8)]
            self.gold_stack += [3 for _ in range(4)]
            shuffle(self.gold_stack)
        self.board_reset()
        self.set_player_role()
        self.set_player_state(self.player_list)
        self.card_pool = create_card_list([{"card_no": id} for id in range(4, 71)])
        shuffle(self.card_pool)
        shuffle(self.player_list)
        self.deal_card(self.player_list)

    """
        check the road is connect to starting road or not with DFS algorithm
        :parms card: the present road (Road)
        :parms row: the present row (Int)
        :parms col: the present column (Int)
        :parms went: where have went for DFS (Bool[5][9])
        :returns: the road is connect or not (Bool)
    """
    def connect_to_start(self, card: Road, row: int, col: int, went: list):
        # card = self.board[row][col]
        went[row][col] = True

        if row == 2 and col == 0:
            return True
        
        # boundary & self side connect & beside's road didn't go
        # has card beside & beside's card can connect
        # card beside can connect to middle
        if col-1 >= 0 and card.connected[4] and not went[row][col-1]: # left
            beside = self.board[row][col-1]
            if beside.card_no != -1 and beside.connected[2] and beside.connected[0]:
                return self.connect_to_start(self.board[row][col-1], row, col-1, went)
        
        if row-1 >= 0 and card.connected[1] and not went[row-1][col]: # top
            beside = self.board[row-1][col]
            if beside.card_no != -1 and beside.connected[3] and beside.connected[0]:
                return self.connect_to_start(self.board[row-1][col], row-1, col, went)

        if row+1 <= 4 and card.connected[3] and not went[row+1][col]: # down
            beside = self.board[row+1][col]
            if beside.card_no != -1 and beside.connected[1] and beside.connected[0]:
                return self.connect_to_start(self.board[row+1][col], row+1, col, went)
        
        if col+1 <= 8 and card.connected[2] and not went[row][col+1]: # right
            beside = self.board[row][col+1]
            if beside.card_no != -1 and beside.connected[4] and beside.connected[0]:
                return self.connect_to_start(self.board[row][col+1], row, col+1, went)

        return False

    """
        check the road is connect to road beside or not
        :parms card: the present road (Road)
        :parms row: the present row (Int)
        :parms col: the present column (Int)
        :returns is_connect: the num of road is connect to rock (Int)
    """    
    def connect_to_rock(self, card: Road, row: int, col:int) -> int:
        is_connect = 0
        
        # check above, under, left and right road side's are rock or not
        if row-1>=0:
            beside = self.board[row-1][col]
            if beside.card_no != -1 and \
                (card.connected[1] ^ self.board[row-1][col].connected[3]) :
                is_connect += 1
        if row+1<=4:
            beside = self.board[row+1][col]
            if beside.card_no != -1 and \
                (card.connected[3] ^ self.board[row+1][col].connected[1]) :
                is_connect += 1
        if col-1>=0:
            beside = self.board[row][col-1]
            if beside.card_no != -1 and \
                (card.connected[4] ^ self.board[row][col-1].connected[2]) :
                is_connect += 1
        if col+1<=8:
            beside = self.board[row][col+1]
            if beside.card_no != -1 and \
                (card.connected[2] ^ self.board[row][col+1].connected[4]) :
                is_connect += 1

        return is_connect

    """
        check the player behavior is legality or not
        :parms player: the player who play card in this turn (Player)
        :parms card: the card which `player` play (Card)
        :parms pos: the position that the `card` need to be set (Int)
        :parms action_type: the choice of repair which tool of the multi-repair action card (Int)
        :return legality: the `player` play the `card` at the `pos` is legal or not (Bool)
        :return illegal_msg: the illegal message will show to player if illegal (Str)
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
                elif self.connect_to_rock(card, r, c):
                    legality = False
                    illegal_msg = "road can't connect to rock"
                else:
                    # check road is connect to start or not
                    went = [[False for _ in range(9)] for _ in range(5)]
                    legality = self.connect_to_start(card, r, c, went)
                    illegal_msg = "the position does not connect to start road"
        
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
                illegal_msg = "except rocks and map action, can't play on card board"
        
        else: # play action card to player
            pos -= 45
            legality = self.player_list[pos].action_state[action_type] ^ card.is_break
            illegal_msg = "" if legality else "the player's tool are already broken/repaired"

        # TODO: pass illegal_msg to web server
        return legality, illegal_msg

    """
        set board when the player behavior is legality
        :parms card: the card need to be set on board or player (Card)
        :parms pos: the position of the card determine on board or player (Int)
                    (see Player.play_card for more position definition)
        :parms action_type: the choice of repair which tool of the multi-repair action card (Int)
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
        (check card_pool length before call)
        :parms player_list: list of player that need to deal card(s) (List[Player])
        :parms card: return the card if player play an illegal card (Card)
    """
    def deal_card(self, player_list: list, card: Card=None):
        hands_rule = [None,None,None,6,6,6,5,5,4,4,4] # number of hand cards by rule
        num_hands = hands_rule[self.num_player]
        for player in player_list:
            if self.game_state == Game_State.reset:
                player.hand_cards = self.card_pool[ : num_hands]
                self.card_pool = self.card_pool[num_hands : ]
            elif self.game_state == Game_State.play:
                if card is not None:
                    player.hand_cards += [card]
                else:
                    player.hand_cards += [self.card_pool.pop(0)]

    """
        calculate points for each player at every game point.
        and consider all player are greedy select the highest point gold card
        :parms winner_list: players who is same team with winner (List[Player])
        :parms winner: which player connected the end road that has gold (Player)
    """
    def calc_point(self, winner_list: list, winner: Player=None):
        num_winner = len(winner_list)

        if num_winner == 0: # sometime no winner in 3,4 player
            return

        if winner is not None: # good dwarf win
            gold_list = sorted(self.gold_stack[ : num_winner], reverse=True)
            self.gold_stack = self.gold_stack[num_winner : ]
            winner_list.reverse() # Counterclockwise
            idx = winner_list.index(winner)
            while len(gold_list) > 0:
                winner_list[idx % num_winner].point += gold_list.pop(0)
                idx += 1
        else:
            point_rule = [None, 4, 3, 3, 2] # bad dwarf point by rule

            for player in range(num_winner):
                point = point_rule[num_winner]
                winner_list[player].point += point
                while point > 0:
                    idx = 0
                    while idx < len(self.gold_stack):
                        if point - self.gold_stack[idx] >= 0:
                            point -= self.gold_stack.pop(idx)
                        idx += 1

    """
        calculate each player points and rank
    """
    def calc_rank(self):
        self.player_list.sort(key= lambda player: player.point, reverse=True)
        for rank, player in enumerate(self.player_list):
            logging.debug(f"rank {rank+1}: {player.id}\tpoint: {player.point}")
        # TODO: pass result to web werver

    # for debug
    def visualization(self):
        for row in range(5):
            print([self.board[row][col].card_no for col in range(9)])
        print()

    # for debug
    def view_player(self, player_list):
        for i, player in enumerate(player_list):
            logging.debug(f"{i} point: {player.point}\trole: {player.role}\thand cards: {player.hand_cards} {len(player.hand_cards)}\tstate: {player.action_state}")

if __name__ == '__main__':
    ## form json
    # with open("test2.json") as fp:
    #     obj = json.load(fp)
    # gc = Game_Controller(**obj)

    ## from id list
    gc = Game_Controller.from_scratch(["asdf", "qwer", "zxcv"])
    logging.info(pformat(gc.to_json()))
    gc.state_control(0, 0) # play road/action card
    gc.state_control(0, 0, 0) # play multi-repair action card