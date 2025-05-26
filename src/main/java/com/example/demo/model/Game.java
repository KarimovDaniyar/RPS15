package com.example.demo.model;
import java.util.HashMap; 
import java.util.List;
import java.util.Map;

public class Game {
    List<Move> moves;
    Map<String, Move> moveMap = new HashMap<>();
    
    public Game(List<Move> moves) {
        this.moves = moves;
        for (Move move : moves) {
            moveMap.put(move.getName(), move);
        }
    }

    public Game () {}

    public List<Move> getMoves() {
        return moves;
    }

    public void setMoves(List<Move> moves) {
        this.moves = moves;
        moveMap.clear();
        for (Move move: moves) {
            moveMap.put(move.getName(), move);
        }
    }

    public String playWithBot(String move, Move second) {
        Move first = moveMap.get(move);

        System.out.println("BOT MOVE" + second + " " +second.getName());

        if (first != null) {
            System.out.println(first.getName() + " VS " + second.getName());
            if (first.getName().equals(second.getName())) {
                System.out.println("Ничья");
                return Result.DRAW.getSymbol();
            } else {
                if (first.getBeats().contains(second.getName())) {
                    System.out.println("Вы выиграли");
                    return Result.WIN.getSymbol();
                } else {
                    System.out.println("Вы проиграли");
                    return Result.LOSS.getSymbol();
                }
            }
        } return Result.DRAW.getSymbol();
    }

    public Move getBotMove() {
        int randomNumber = (int) (Math.random() * moves.size());
        return moves.get(randomNumber);
    }
}
