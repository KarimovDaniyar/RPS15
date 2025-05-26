package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.GameResult;
import com.example.demo.model.Move;
import com.example.demo.service.GameService;

import jakarta.servlet.http.HttpSession;


@RestController
@RequestMapping("api/game")
public class GameController {
    private final GameService gameService;

    @Autowired
    public GameController(GameService gameService) {
        this.gameService = gameService;
    }

    @GetMapping("/moves")
    public ResponseEntity<List<Move>> getAvailableMoves() {
        return ResponseEntity.ok(gameService.getAvailableMoves());
    }

    /**
     * Обработать ход игрока
     * @param move Ход игрока (rock, paper, scissors)
     * @param session HTTP сессия
     * @return Результат хода
     */

     @PostMapping("/play")
     public ResponseEntity<GameResult> playMove(@RequestParam String move, HttpSession session) {
        String sessionId = session.getId();
        return ResponseEntity.ok(gameService.playMove(sessionId, move));
     }

     @PostMapping("/reset")
     public ResponseEntity<String> resetGame(HttpSession session) {
        String sessionId = session.getId();
        gameService.resetGame(sessionId);
        return ResponseEntity.ok("Game reset");
     }


}
