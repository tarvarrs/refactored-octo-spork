package websocket

import (
	"encoding/json"
	"log"
	"net/http"
	"context"
	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
	"oralo/internal/usecase"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type WsHandler struct {
	postUC usecase.PostUseCase
	clients map[*websocket.Conn]bool
	broadcast chan []byte 
}

func NewWsHandler(postUC usecase.PostUseCase) *WsHandler {
	h := &WsHandler{
		postUC:    postUC,
		clients:   make(map[*websocket.Conn]bool),
		broadcast: make(chan []byte),
	}
	go h.run()
	return h
}

// GET /ws
func (h *WsHandler) HandleConnection(c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Println("WS Upgrade error:", err)
		return
	}
	defer conn.Close()

	h.clients[conn] = true
	defer delete(h.clients, conn)

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			break
		}
		h.handleMessage(message)
	}
}

// GET /ws
func (h *WsHandler) handleMessage(msg []byte) {
	var event struct {
		Action string `json:"action"` // "scream_support"
		PostID uint   `json:"post_id"`
		Volume int    `json:"volume"`
	}

	if err := json.Unmarshal(msg, &event); err != nil {
		return
	}

	if event.Action == "scream_support" {
		updatedPost, err := h.postUC.ScreamAtPost(context.Background(), event.PostID, event.Volume)
		if err != nil {
			log.Println("Error updating post:", err)
			return
		}

		response := map[string]interface{}{
			"event":             "support_update",
			"post_id":           updatedPost.ID,
			"new_support_score": updatedPost.SupportScore,
			"is_shaking":        true, 
		}
		
		respBytes, _ := json.Marshal(response)
		
		h.broadcast <- respBytes
	}
}

func (h *WsHandler) run() {
	for {
		msg := <-h.broadcast
		for client := range h.clients {
			err := client.WriteMessage(websocket.TextMessage, msg)
			if err != nil {
				client.Close()
				delete(h.clients, client)
			}
		}
	}
}
