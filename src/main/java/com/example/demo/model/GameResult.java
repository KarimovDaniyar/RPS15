package com.example.demo.model;

public class GameResult {
    private String myMove;
    private String opponentMove;
    private String result;
    private int myScore;
    private int opponentScore;
    private boolean gameOver;
    private String gameString;
    private String gameResult;

    public GameResult() {}

    public int getOpponentScore() {
        return opponentScore;
    }

    public void setOpponentScore(int opponentScore) {
        this.opponentScore = opponentScore;
    }

    public int getMyScore() {
        return myScore;
    }

    public void setMyScore(int myScore) {
        this.myScore = myScore;
    }

    public boolean isGameOver() {
        return gameOver;
    }

    public void setGameOver(boolean gameOver) {
        this.gameOver = gameOver;
    }

    public String getGameString() {
        return gameString;
    }

    public void setGameString(String gameString) {
        this.gameString = gameString;
    }

    public String getResult() {
        return result;
    }

    public void setResult(String result) {
        this.result = result;
    }

    public String getOpponentMove() {
        return opponentMove;
    }

    public void setOpponentMove(String opponentMove) {
        this.opponentMove = opponentMove;
    }

    public String getMyMove() {
        return myMove;
    }

    public void setMyMove(String myMove) {
        this.myMove = myMove;
    }

    public String getGameResult() {
        return gameResult;
    }

    public void setGameResult(String gameResult) {
        this.gameResult = gameResult;
    }
}
