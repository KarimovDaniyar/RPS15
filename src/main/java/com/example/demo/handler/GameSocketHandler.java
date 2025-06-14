package com.example.demo.handler;

import java.util.List;
import java.util.Map;
import java.util.Timer;
import java.util.TimerTask;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.example.demo.model.Game;
import com.example.demo.model.Result;
import com.example.demo.service.GameService;
import com.fasterxml.jackson.databind.ObjectMapper;

@Component
public class GameSocketHandler extends TextWebSocketHandler {
    private static class Player {
        public String name;
        public WebSocketSession session;
        public String move;
        public int score = 0;
    }

    private static class Room {
        public String roomId;
        public Player player1;
        public Player player2;
        public boolean gameOver = false;
        public Timer timer;
    }

    private final Map<String, Room> rooms = new ConcurrentHashMap<>();
    private final Map<String, String> sessionToRoom = new ConcurrentHashMap<>();
    private final ObjectMapper mapper = new ObjectMapper();
    
    private final GameService gameService;
    private final Game game;
    
    @Autowired
    public GameSocketHandler(GameService gameService) {
        this.gameService = gameService;
        this.game = new Game(gameService.getAvailableMoves());
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String sessionId = session.getId();
        String roomId = sessionToRoom.get(sessionId);
        if (roomId != null) {
            Room room = rooms.get(roomId);
            if (room != null) {
                if (room.player1 != null && room.player1.session.getId().equals(sessionId)) {
                    room.player1 = null;
                }
                if (room.player2 != null && room.player2.session.getId().equals(sessionId)) {
                    room.player2 = null;
                }
                if (room.player1 == null && room.player2 == null) {
                    rooms.remove(roomId);
                }
            
                if (room.timer != null) {
                    room.timer.cancel();
                    room.timer = null;
                }
            }
            sessionToRoom.remove(sessionId);
        }
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        Map<String, Object> msg = mapper.readValue(message.getPayload(), Map.class);
        String action = (String) msg.get("action");

        if ("create_room".equals(action)) {
            String playerName = (String) msg.get("playerName");
            String roomId = UUID.randomUUID().toString().substring(0, 6).toUpperCase();
            Player player = new Player();
            player.name = playerName;
            player.session = session;
            Room room = new Room();
            room.roomId = roomId;
            room.player1 = player;
            rooms.put(roomId, room);
            sessionToRoom.put(session.getId(), roomId);

            session.sendMessage(new TextMessage(mapper.writeValueAsString(Map.of(
                "type", "room_created",
                "roomId", roomId
            ))));
        }

        if ("join_room".equals(action)) {
            String playerName = (String) msg.get("playerName");
            String roomId = (String) msg.get("roomId");
            Room room = rooms.get(roomId);
            if (room == null || room.player2 != null) {
                session.sendMessage(new TextMessage(mapper.writeValueAsString(Map.of(
                    "type", "error",
                    "message", "Room not found or full"
                ))));
                return;
            }
            Player player = new Player();
            player.name = playerName;
            player.session = session;
            room.player2 = player;
            sessionToRoom.put(session.getId(), roomId);

            // Оповестить обоих игроков
            broadcast(room, Map.of(
                "type", "player_joined",
                "roomId", roomId,
                "players", List.of(room.player1.name, room.player2.name)
            ));
        }

        if ("move".equals(action)) {
            String roomId = (String) msg.get("roomId");
            String move = (String) msg.get("move");
            Room room = rooms.get(roomId);
            if (room == null || room.player1 == null || room.player2 == null) return;

            Player player = room.player1.session.getId().equals(session.getId()) ? room.player1 : room.player2;
            player.move = move;

            if (room.timer == null) {
                room.timer = new Timer();
                room.timer.schedule(new TimerTask() {
                    @Override
                    public void run() {
                        try {
                          
                            if (room.player1.move == null) room.player1.move = "sponge";
                            if (room.player2.move == null) room.player2.move = "sponge";
                            
                            finishRound(roomId);
                        } catch (Exception e) {
                            e.printStackTrace();
                        }
                    }
                }, 7000);
            }


            if (room.player1.move != null && room.player2.move != null) {
                if (room.timer != null) {
                    room.timer.cancel();
                    room.timer = null;
                }
                finishRound(roomId);
            }
        }

        if ("reset".equals(action)) {
            String roomId = (String) msg.get("roomId");
            Room room = rooms.get(roomId);
            if (room != null) {
                room.player1.score = 0;
                room.player2.score = 0;
                room.gameOver = false;
                if (room.timer != null) {
                    room.timer.cancel();
                    room.timer = null;
                }
                broadcast(room, Map.of(
                    "type", "reset",
                    "roomId", roomId
                ));
            }
        }
    }

    private void finishRound(String roomId) throws Exception {
        Room room = rooms.get(roomId);
        if (room == null || room.player1 == null || room.player2 == null) return;


        String symbol = game.playWithOpponent(room.player1.move, room.player2.move);
        String resultType;
        
        if (symbol.equals(Result.DRAW.getSymbol())) {
            resultType = "DRAW";

        } else if (symbol.equals(Result.WIN.getSymbol())) {
            resultType = "WIN";
            room.player1.score++;
        } else {
            resultType = "LOSSES";
            room.player2.score++;
        }

        boolean gameOver = room.player1.score >= 3 || room.player2.score >= 3;
        room.gameOver = gameOver;

        if (room.player1 != null && room.player1.session.isOpen()) {
            String player1Json = mapper.writeValueAsString(Map.of(
                "type", "game_update",
                "roomId", roomId,
                "myMove", room.player1.move,
                "opponentMove", room.player2.move,
                "myScore", room.player1.score,
                "opponentScore", room.player2.score,
                "result", resultType,
                "gameOver", gameOver,
                "myName", room.player1.name,
                "opponentName", room.player2.name
            ));
            room.player1.session.sendMessage(new TextMessage(player1Json));
        }
        

        if (room.player2 != null && room.player2.session.isOpen()) {
            String player2ResultType = resultType;
            if (resultType.equals("WIN")) {
                player2ResultType = "LOSSES";
            } else if (resultType.equals("LOSSES")) {
                player2ResultType = "WIN";
            }
            
            String player2Json = mapper.writeValueAsString(Map.of(
                "type", "game_update",
                "roomId", roomId,
                "myMove", room.player2.move,
                "opponentMove", room.player1.move,
                "myScore", room.player2.score,
                "opponentScore", room.player1.score,
                "result", player2ResultType,
                "gameOver", gameOver,
                "myName", room.player2.name,
                "opponentName", room.player1.name
            ));
            room.player2.session.sendMessage(new TextMessage(player2Json));
        }

        room.player1.move = null;
        room.player2.move = null;
        if (room.timer != null) {
            room.timer.cancel();
            room.timer = null;
        }
    }

    private void broadcast(Room room, Map<String, Object> msg) throws Exception {
        String json = mapper.writeValueAsString(msg);
        if (room.player1 != null && room.player1.session.isOpen()) {
            room.player1.session.sendMessage(new TextMessage(json));
        }
        if (room.player2 != null && room.player2.session.isOpen()) {
            room.player2.session.sendMessage(new TextMessage(json));
        }
    }
}
