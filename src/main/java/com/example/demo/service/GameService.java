package com.example.demo.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.example.demo.model.Game;
import com.example.demo.model.GameResult;
import com.example.demo.model.Move;
import com.example.demo.model.Result;

@Service 
public class GameService {
    private final Game game;

    private final Map<String, Integer> sessionScore  = new HashMap<>();

    public GameService() {
        List<Move> moves = new ArrayList<>();
        // Расширенные правила для 15 элементов
        moves.add(new Move("rock", List.of("scissors", "fire", "snake", "human", "wolf", "sponge", "tree")));
        moves.add(new Move("fire", List.of("scissors", "paper", "snake", "human", "tree", "wolf", "sponge")));
        moves.add(new Move("scissors", List.of("paper", "snake", "human", "wolf", "sponge", "tree", "air")));
        moves.add(new Move("snake", List.of("human", "wolf", "sponge", "tree", "paper", "air", "water")));
        moves.add(new Move("human", List.of("tree", "wolf", "sponge", "paper", "air", "water", "dragon")));
        moves.add(new Move("tree", List.of("wolf", "dragon", "sponge", "paper", "air", "water", "devil")));
        moves.add(new Move("wolf", List.of("sponge", "paper", "air", "water", "dragon", "lightning", "devil")));
        moves.add(new Move("sponge", List.of("paper", "air", "water", "devil", "dragon", "gun", "lightning")));
        moves.add(new Move("paper", List.of("air", "rock", "water", "devil", "dragon", "gun", "lightning")));
        moves.add(new Move("air", List.of("fire", "rock", "water", "devil", "gun", "dragon", "lightning")));
        moves.add(new Move("water", List.of("devil", "dragon", "rock", "fire", "scissors", "gun", "lightning")));
        moves.add(new Move("dragon", List.of("devil", "lightning", "fire", "rock", "scissors", "gun", "snake")));
        moves.add(new Move("devil", List.of("rock", "fire", "scissors", "gun", "lightning", "snake", "human")));
        moves.add(new Move("lightning", List.of("gun", "scissors", "rock", "tree", "fire", "snake", "human")));
        moves.add(new Move("gun", List.of("rock", "tree", "fire", "scissors", "snake", "human", "wolf")));
        
        this.game = new Game(moves);
    }

     /**
     * Обрабатывает ход игрока
     * @param sessionId ID сессии игрока
     * @param playerMove Ход игрока (rock, paper, scissors)
     * @return Результат хода
     */

    public GameResult playMove(String sessionId, String playerMove) {
        if (!sessionScore.containsKey(sessionId + "_player")) {
            sessionScore.put(sessionId + "_player", 0);
            sessionScore.put(sessionId + "_opponent", 0);
        }

        int myScore = sessionScore.get(sessionId + "_player");
        int opponentScore = sessionScore.get(sessionId + "_opponent");

        if (myScore >= 3 || opponentScore >= 3) {
            resetGame(sessionId);
        }

        Move opponentMoveOdj = game.getOpponentMove();
        String opponentMove = opponentMoveOdj.getName();

        String result = game.playWithBot(playerMove, opponentMoveOdj);

        if (result.equals(Result.WIN.getSymbol())) {
            myScore++;
            sessionScore.put(sessionId + "_player", myScore);
        } else if (result.equals(Result.LOSSES.getSymbol())) {
            opponentScore++;
            sessionScore.put(sessionId + "_opponent", opponentScore);
        }

        GameResult gameResult = new GameResult();
        gameResult.setPlayerMove(playerMove);
        gameResult.setOpponentMove(opponentMove);
        gameResult.setResult(result.equals("+") ? "WIN" : result.equals("-") ? "LOSSES" : "DRAW");
        gameResult.setMyScore(myScore);
        gameResult.setOpponentScore(opponentScore);

        boolean gameOver = myScore >= 3 || opponentScore >= 3;
        gameResult.setGameOver(gameOver);

        if (gameOver) {
            if (myScore >= 3) {
                gameResult.setGameResult("YOU WIN");
            } else {
                gameResult.setGameResult("YOU LOSSES");
            }
        }

        return gameResult;
    }

    /**
     * @param sessionId
     */

     public void resetGame(String sessionId) {
        sessionScore.put(sessionId + "_player", 0);
        sessionScore.put(sessionId + "_opponent", 0);
     }

     public List<Move>getAvailableMoves() {
        return game.getMoves();
     }
}
