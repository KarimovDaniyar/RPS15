package com.example.demo.model;
import java.util.List;

public class Move {
    private String name;
    private List<String> beats;

    public Move(String name, List<String> beats) {
        this.name = name;
        this.beats = beats;
    }

    public Move () {}

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getBeats() {
        return beats;
    }

    public void setBeats(List<String> beats) {
        this.beats = beats;
    }
}