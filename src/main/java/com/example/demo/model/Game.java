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
                    return Result.LOSSES.getSymbol();
                }
            }
        } return Result.DRAW.getSymbol();
    }

    public Move getOpponentMove() {
        int randomNumber = (int) (Math.random() * moves.size());
        return moves.get(randomNumber);
    }

    public String playWithOpponent(String myMove, String opponentMove) {
        Move first = moveMap.get(myMove);
        Move second = moveMap.get(opponentMove);
        if (first.getName().equals(second.getName())) {
            System.out.println("Ничья");
            return Result.DRAW.getSymbol();
        } else {
            if (first.getBeats().contains(second.getName())) {
                System.out.println("Вы выиграли");
                return Result.WIN.getSymbol();
            } else {
                System.out.println("Вы проиграли");
                return Result.LOSSES.getSymbol();
            }
        }
    }
}
