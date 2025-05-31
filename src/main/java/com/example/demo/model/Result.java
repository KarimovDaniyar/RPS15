package com.example.demo.model;

public enum Result {
    WIN("+"), LOSSES("-"), DRAW("");
    private final String symbol;

    Result(String symbol) {
        this.symbol = symbol;
    }

    public String getSymbol(){
        return symbol;
    }
}