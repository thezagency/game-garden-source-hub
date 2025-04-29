
import React from "react";
import { Game } from "../../types";

export const getSnakeGame = (): Game => {
  return {
    id: "snake-csharp",
    title: "Snake Game (C#)",
    description: "Classic Snake game implemented in C# with Unity WebGL export",
    imageUrl: "https://images.unsplash.com/photo-1615751072497-5f5169febe17?q=80&w=1335&fm=jpg",
    category: "arcade",
    sourceCode: {
      html: `<div id="unity-container">
  <p>Loading Unity WebGL Snake Game...</p>
  <div id="game-container"></div>
</div>`,
      css: `#unity-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}`,
      csharp: `
using UnityEngine;
using System.Collections.Generic;

public class Snake : MonoBehaviour {
    // Snake movement speed
    public float speed = 5;
    // Snake body prefab
    public GameObject bodyPrefab;
    
    // Direction of movement
    private Vector2 direction = Vector2.right;
    // List of body parts
    private List<Transform> body = new List<Transform>();
    
    void Start() {
        // Initialize the snake
        Reset();
    }
    
    void Update() {
        // Change direction based on input
        if (Input.GetKeyDown(KeyCode.UpArrow) && direction != Vector2.down)
            direction = Vector2.up;
        else if (Input.GetKeyDown(KeyCode.DownArrow) && direction != Vector2.up)
            direction = Vector2.down;
        else if (Input.GetKeyDown(KeyCode.LeftArrow) && direction != Vector2.right)
            direction = Vector2.left;
        else if (Input.GetKeyDown(KeyCode.RightArrow) && direction != Vector2.left)
            direction = Vector2.right;
    }
    
    void FixedUpdate() {
        // Move body parts
        for (int i = body.Count - 1; i > 0; i--) {
            body[i].position = body[i-1].position;
        }
        
        // Move head
        transform.Translate(direction * speed * Time.deltaTime);
    }
    
    void OnTriggerEnter2D(Collider2D other) {
        if (other.CompareTag("Food")) {
            // Grow when eating food
            GrowSnake();
            // Destroy the food
            Destroy(other.gameObject);
        } else if (other.CompareTag("Obstacle")) {
            // Game over when hitting obstacle or self
            Reset();
        }
    }
    
    void GrowSnake() {
        // Add new body part
        Transform segment = Instantiate(bodyPrefab, transform.position, Quaternion.identity).transform;
        body.Add(segment);
    }
    
    void Reset() {
        // Clear body parts
        for (int i = 1; i < body.Count; i++) {
            Destroy(body[i].gameObject);
        }
        
        // Reset position
        transform.position = Vector3.zero;
        
        // Clear body list
        body.Clear();
        body.Add(transform);
        
        // Add initial body parts
        for (int i = 0; i < 3; i++) {
            GrowSnake();
        }
        
        // Reset direction
        direction = Vector2.right;
    }
}
`
    },
    difficulty: "intermediate",
    featured: true,
    playUrl: "/play/snake-csharp"
  };
};
