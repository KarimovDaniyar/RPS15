package com.example.demo.model;

public class GameResult {
    private String playerMove;
    private String botMove;
    private String result;
    private int playerScore;
    private int botScore;
    private boolean gameOver;
    private String gameString;
    private String gameResult;

    public GameResult() {}

    public int getBotScore() {
        return botScore;
    }

    public void setBotScore(int botScore) {
        this.botScore = botScore;
    }

    public int getPlayerScore() {
        return playerScore;
    }

    public void setPlayerScore(int playerScore) {
        this.playerScore = playerScore;
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

    public String getBotMove() {
        return botMove;
    }

    public void setBotMove(String botMove) {
        this.botMove = botMove;
    }

    public String getPlayerMove() {
        return playerMove;
    }

    public void setPlayerMove(String playerMove) {
        this.playerMove = playerMove;
    }

    public String getGameResult() {
        return gameResult;
    }

    public void setGameResult(String gameResult) {
        this.gameResult = gameResult;
    }
}
