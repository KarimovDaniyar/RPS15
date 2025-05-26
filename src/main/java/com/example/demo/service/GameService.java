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
            sessionScore.put(sessionId + "_bot", 0);
        }

        int playerScore = sessionScore.get(sessionId + "_player");
        int botScore = sessionScore.get(sessionId + "_bot");

        if (playerScore >= 3 || botScore >= 3) {
            resetGame(sessionId);
            playerScore = 0;
            botScore = 0;
        }

        Move botMoveOdj = game.getBotMove();
        System.out.println("botMoveObj " + botMoveOdj);
        String botMove = botMoveOdj.getName();

        String result = game.playWithBot(playerMove, botMoveOdj);

        if (result.equals(Result.WIN.getSymbol())) {
            playerScore++;
            sessionScore.put(sessionId + "_player", playerScore);
        } else if (result.equals(Result.LOSS.getSymbol())) {
            botScore++;
            sessionScore.put(sessionId + "_bot", botScore);
        }

        GameResult gameResult = new GameResult();
        gameResult.setPlayerMove(playerMove);
        gameResult.setBotMove(botMove);
        gameResult.setResult(result.equals("+") ? "WIN" : result.equals("-") ? "LOSS" : "DRAW");
        gameResult.setPlayerScore(playerScore);
        gameResult.setBotScore(botScore);

        boolean gameOver = playerScore >= 3 || botScore >= 3;
        gameResult.setGameOver(gameOver);

        if (gameOver) {
            if (playerScore >= 3) {
                gameResult.setGameResult("YOU WIN");
            } else {
                gameResult.setGameResult("YOU LOSS");
            }
        }

        return gameResult;
    }

    /**
     * @param sessionId
     */

     public void resetGame(String sessionId) {
        sessionScore.put(sessionId + "_player", 0);
        sessionScore.put(sessionId + "_bot", 0);
     }

     public List<Move>getAvailableMoves() {
        return game.getMoves();
     }
}
