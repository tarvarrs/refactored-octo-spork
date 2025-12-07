package handlers

import (
	"net/http"
	"oralo/internal/models"
	"oralo/internal/usecase"

	"github.com/gin-gonic/gin"
	"strconv"
)

type PostHandler struct {
	uc usecase.PostUseCase
}

func NewPostHandler(uc usecase.PostUseCase) *PostHandler {
	return &PostHandler{uc: uc}
}

func (h *PostHandler) CreatePost(c *gin.Context) {
	var req models.Req
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// TODO: UserID пока хардкодим = 1, потом возьмем из JWT
	post, err := h.uc.CreatePost(c.Request.Context(), req.Description, req.Title, req.InitialVolume, 1)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, post)
}

func (h *PostHandler) GetFeed(c *gin.Context) {
	posts, err := h.uc.GetFeed(c.Request.Context())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, posts)
}

func (h *PostHandler) GetPostByID(c *gin.Context) {
    idStr := c.Param("id")
    id64, err := strconv.ParseUint(idStr, 10, 32)
    if err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID"})
        return
    }

    post, err := h.uc.GetPostByID(c.Request.Context(), uint(id64))
    if err != nil {
        c.JSON(http.StatusNotFound, gin.H{"error": "Post not found"})
        return
    }

    c.JSON(http.StatusOK, post)
}
