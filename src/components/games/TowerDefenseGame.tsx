import React from "react";
import { Game } from "../../types";

export const getTowerDefenseGame = (): Game => {
  return {
    id: "tower-defense",
    title: "Tower Defense",
    description: "Build towers to defend against waves of enemies in this strategic tower defense game.",
    imageUrl: "https://images.unsplash.com/photo-1599933310642-8f07bdea325a?q=80&w=1171&fm=jpg",
    category: "strategy",
    sourceCode: {
      html: `<div id="tower-defense-container">
  <canvas id="gameCanvas" width="800" height="500"></canvas>
  <div id="game-ui">
    <div id="resources">Gold: <span id="gold">100</span></div>
    <div id="wave-info">Wave: <span id="wave">1</span></div>
    <div id="tower-selection">
      <button id="basic-tower" class="tower-btn">Basic Tower ($25)</button>
      <button id="sniper-tower" class="tower-btn">Sniper Tower ($60)</button>
      <button id="splash-tower" class="tower-btn">Splash Tower ($80)</button>
    </div>
    <button id="start-wave">Start Wave</button>
  </div>
</div>`,
      css: `#tower-defense-container {
  font-family: Arial, sans-serif;
  margin: 0 auto;
  width: 800px;
}

#gameCanvas {
  border: 1px solid #333;
  background: #1a1a1a;
}

#game-ui {
  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #333;
  padding: 10px;
  border-radius: 5px;
  color: white;
}

.tower-btn {
  margin-right: 8px;
  padding: 6px 10px;
  background-color: #6c5ce7;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
}

.tower-btn:hover {
  background-color: #5b4cc4;
}

.tower-btn.selected {
  background-color: #fd79a8;
}

#start-wave {
  padding: 8px 15px;
  background-color: #00b894;
  border: none;
  color: white;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

#start-wave:hover {
  background-color: #00a285;
}

#resources, #wave-info {
  font-weight: bold;
  font-size: 16px;
}`,
      csharp: `
using System;
using System.Collections.Generic;
using UnityEngine;

namespace TowerDefense
{
    // Manages the game state
    public class GameManager : MonoBehaviour
    {
        // Game properties
        public int Gold { get; private set; }
        public int CurrentWave { get; private set; }
        public bool WaveInProgress { get; private set; }
        
        // Game objects
        private List<Tower> towers;
        private List<Enemy> activeEnemies;
        private List<Projectile> activeProjectiles;
        private Path enemyPath;
        
        // Tower costs
        private static readonly Dictionary<TowerType, int> TowerCosts = new Dictionary<TowerType, int>
        {
            { TowerType.Basic, 25 },
            { TowerType.Sniper, 60 },
            { TowerType.Splash, 80 }
        };
        
        // Wave configuration
        private struct WaveConfig
        {
            public int EnemyCount;
            public float SpawnInterval;
            public float EnemyHealth;
            public float EnemySpeed;
        }
        
        private void Start()
        {
            // Initialize game
            Gold = 100;
            CurrentWave = 0;
            WaveInProgress = false;
            
            towers = new List<Tower>();
            activeEnemies = new List<Enemy>();
            activeProjectiles = new List<Projectile>();
            
            // Create path for enemies to follow
            enemyPath = new Path();
            enemyPath.AddPoint(new Vector2(-50, 250));
            enemyPath.AddPoint(new Vector2(150, 250));
            enemyPath.AddPoint(new Vector2(150, 100));
            enemyPath.AddPoint(new Vector2(400, 100));
            enemyPath.AddPoint(new Vector2(400, 350));
            enemyPath.AddPoint(new Vector2(650, 350));
            enemyPath.AddPoint(new Vector2(650, 200));
            enemyPath.AddPoint(new Vector2(850, 200));
        }
        
        private void Update()
        {
            if (WaveInProgress)
            {
                // Update towers (find targets and shoot)
                foreach (Tower tower in towers)
                {
                    tower.UpdateTower(Time.deltaTime, activeEnemies, activeProjectiles);
                }
                
                // Update projectiles (move and check collisions)
                for (int i = activeProjectiles.Count - 1; i >= 0; i--)
                {
                    Projectile projectile = activeProjectiles[i];
                    projectile.Update(Time.deltaTime);
                    
                    // Check for collisions with enemies
                    for (int j = activeEnemies.Count - 1; j >= 0; j--)
                    {
                        Enemy enemy = activeEnemies[j];
                        if (Vector2.Distance(projectile.Position, enemy.Position) < enemy.Radius + projectile.Radius)
                        {
                            // Apply damage
                            enemy.TakeDamage(projectile.Damage);
                            
                            // Handle splash damage
                            if (projectile.SplashRadius > 0)
                            {
                                ApplySplashDamage(projectile, enemy);
                            }
                            
                            // Remove projectile
                            activeProjectiles.RemoveAt(i);
                            
                            // Check if enemy is dead
                            if (enemy.Health <= 0)
                            {
                                Gold += enemy.GoldReward;
                                activeEnemies.RemoveAt(j);
                            }
                            
                            break;
                        }
                    }
                    
                    // Remove projectile if it's too far
                    if (projectile.DistanceTraveled > projectile.MaxRange)
                    {
                        activeProjectiles.RemoveAt(i);
                    }
                }
                
                // Update enemies (move along path)
                for (int i = activeEnemies.Count - 1; i >= 0; i--)
                {
                    Enemy enemy = activeEnemies[i];
                    enemy.Update(Time.deltaTime);
                    
                    // Check if enemy reached the end
                    if (enemy.ReachedEnd)
                    {
                        // Player loses life or game over logic here
                        activeEnemies.RemoveAt(i);
                    }
                }
                
                // Check if wave is complete
                if (activeEnemies.Count == 0 && !AreEnemiesSpawning)
                {
                    WaveInProgress = false;
                    CurrentWave++;
                }
            }
        }
        
        private void ApplySplashDamage(Projectile projectile, Enemy centerEnemy)
        {
            foreach (Enemy enemy in activeEnemies)
            {
                if (enemy != centerEnemy)
                {
                    float distance = Vector2.Distance(centerEnemy.Position, enemy.Position);
                    if (distance <= projectile.SplashRadius)
                    {
                        // Calculate damage falloff based on distance
                        float damageFactor = 1.0f - (distance / projectile.SplashRadius);
                        enemy.TakeDamage(projectile.Damage * damageFactor);
                    }
                }
            }
        }
        
        public void StartWave()
        {
            if (WaveInProgress)
                return;
                
            WaveInProgress = true;
            StartCoroutine(SpawnWave(GetWaveConfig()));
        }
        
        private bool AreEnemiesSpawning { get; set; }
        
        private System.Collections.IEnumerator SpawnWave(WaveConfig config)
        {
            AreEnemiesSpawning = true;
            
            for (int i = 0; i < config.EnemyCount; i++)
            {
                Enemy enemy = new Enemy(enemyPath, config.EnemyHealth, config.EnemySpeed);
                activeEnemies.Add(enemy);
                
                yield return new WaitForSeconds(config.SpawnInterval);
            }
            
            AreEnemiesSpawning = false;
        }
        
        private WaveConfig GetWaveConfig()
        {
            // Waves get progressively harder
            float waveFactor = 1.0f + (CurrentWave * 0.2f);
            
            return new WaveConfig
            {
                EnemyCount = 10 + (CurrentWave * 2),
                SpawnInterval = Mathf.Max(0.5f, 1.2f - (CurrentWave * 0.05f)),
                EnemyHealth = 50 * waveFactor,
                EnemySpeed = 50 + (CurrentWave * 5)
            };
        }
        
        public bool TryPlaceTower(TowerType type, Vector2 position)
        {
            // Check if position is valid (not on path, not overlapping other towers)
            if (IsTowerPlacementValid(position) && Gold >= TowerCosts[type])
            {
                Tower tower = CreateTower(type, position);
                towers.Add(tower);
                Gold -= TowerCosts[type];
                return true;
            }
            
            return false;
        }
        
        private bool IsTowerPlacementValid(Vector2 position)
        {
            const float minDistanceToPath = 30.0f;
            const float minDistanceToTower = 40.0f;
            
            // Check distance to path
            for (int i = 0; i < enemyPath.Points.Count - 1; i++)
            {
                Vector2 start = enemyPath.Points[i];
                Vector2 end = enemyPath.Points[i + 1];
                
                if (DistanceToLineSegment(position, start, end) < minDistanceToPath)
                {
                    return false;
                }
            }
            
            // Check distance to other towers
            foreach (Tower tower in towers)
            {
                if (Vector2.Distance(position, tower.Position) < minDistanceToTower)
                {
                    return false;
                }
            }
            
            return true;
        }
        
        private float DistanceToLineSegment(Vector2 point, Vector2 lineStart, Vector2 lineEnd)
        {
            // Calculate distance from point to line segment
            Vector2 line = lineEnd - lineStart;
            float lineLengthSquared = line.sqrMagnitude;
            
            if (lineLengthSquared == 0)
                return Vector2.Distance(point, lineStart);
                
            float t = Mathf.Clamp01(Vector2.Dot(point - lineStart, line) / lineLengthSquared);
            Vector2 projection = lineStart + t * line;
            
            return Vector2.Distance(point, projection);
        }
        
        private Tower CreateTower(TowerType type, Vector2 position)
        {
            switch (type)
            {
                case TowerType.Basic:
                    return new BasicTower(position);
                case TowerType.Sniper:
                    return new SniperTower(position);
                case TowerType.Splash:
                    return new SplashTower(position);
                default:
                    throw new ArgumentException("Unknown tower type");
            }
        }
    }
    
    // Enemy path
    public class Path
    {
        public List<Vector2> Points { get; private set; }
        
        public Path()
        {
            Points = new List<Vector2>();
        }
        
        public void AddPoint(Vector2 point)
        {
            Points.Add(point);
        }
        
        public Vector2 GetPointAtDistance(float distance)
        {
            if (Points.Count < 2)
                return Vector2.zero;
                
            float currentDistance = 0;
            
            // Find the segment containing the distance
            for (int i = 0; i < Points.Count - 1; i++)
            {
                Vector2 start = Points[i];
                Vector2 end = Points[i + 1];
                float segmentLength = Vector2.Distance(start, end);
                
                if (currentDistance + segmentLength >= distance)
                {
                    // Calculate position within segment
                    float t = (distance - currentDistance) / segmentLength;
                    return Vector2.Lerp(start, end, t);
                }
                
                currentDistance += segmentLength;
            }
            
            // If beyond the path, return the last point
            return Points[Points.Count - 1];
        }
        
        public float GetTotalLength()
        {
            float length = 0;
            
            for (int i = 0; i < Points.Count - 1; i++)
            {
                length += Vector2.Distance(Points[i], Points[i + 1]);
            }
            
            return length;
        }
    }
    
    // Base enemy class
    public class Enemy
    {
        public Vector2 Position { get; private set; }
        public float Health { get; private set; }
        public float MaxHealth { get; private set; }
        public bool ReachedEnd { get; private set; }
        public float Radius { get; private set; }
        public int GoldReward { get; private set; }
        
        private Path path;
        private float distanceTraveled;
        private float speed;
        
        public Enemy(Path path, float health, float speed)
        {
            this.path = path;
            this.Health = health;
            this.MaxHealth = health;
            this.speed = speed;
            this.distanceTraveled = 0;
            this.ReachedEnd = false;
            this.Radius = 15.0f;
            this.GoldReward = 10;
            
            // Start at beginning of path
            Position = path.Points[0];
        }
        
        public void Update(float deltaTime)
        {
            // Move along path
            distanceTraveled += speed * deltaTime;
            
            // Update position
            Position = path.GetPointAtDistance(distanceTraveled);
            
            // Check if reached end of path
            if (distanceTraveled >= path.GetTotalLength())
            {
                ReachedEnd = true;
            }
        }
        
        public void TakeDamage(float damage)
        {
            Health -= damage;
        }
    }
    
    // Tower types
    public enum TowerType
    {
        Basic,
        Sniper,
        Splash
    }
    
    // Base tower class
    public abstract class Tower
    {
        public Vector2 Position { get; private set; }
        public float Range { get; protected set; }
        public float Damage { get; protected set; }
        public float FireRate { get; protected set; }
        public float ProjectileSpeed { get; protected set; }
        
        private float cooldown;
        
        public Tower(Vector2 position)
        {
            Position = position;
            cooldown = 0;
        }
        
        public void UpdateTower(float deltaTime, List<Enemy> enemies, List<Projectile> projectiles)
        {
            cooldown -= deltaTime;
            
            if (cooldown <= 0)
            {
                Enemy target = FindTarget(enemies);
                
                if (target != null)
                {
                    Fire(target, projectiles);
                    cooldown = 1.0f / FireRate;
                }
            }
        }
        
        protected virtual Enemy FindTarget(List<Enemy> enemies)
        {
            // Find the closest enemy in range
            Enemy closestEnemy = null;
            float closestDistance = float.MaxValue;
            
            foreach (Enemy enemy in enemies)
            {
                float distance = Vector2.Distance(Position, enemy.Position);
                
                if (distance <= Range && distance < closestDistance)
                {
                    closestEnemy = enemy;
                    closestDistance = distance;
                }
            }
            
            return closestEnemy;
        }
        
        protected virtual void Fire(Enemy target, List<Projectile> projectiles)
        {
            Projectile projectile = CreateProjectile(target);
            projectiles.Add(projectile);
        }
        
        protected abstract Projectile CreateProjectile(Enemy target);
    }
    
    // Basic tower
    public class BasicTower : Tower
    {
        public BasicTower(Vector2 position) : base(position)
        {
            Range = 150.0f;
            Damage = 20.0f;
            FireRate = 1.0f;
            ProjectileSpeed = 300.0f;
        }
        
        protected override Projectile CreateProjectile(Enemy target)
        {
            return new Projectile(Position, target.Position, ProjectileSpeed, Damage, 0.0f);
        }
    }
    
    // Sniper tower
    public class SniperTower : Tower
    {
        public SniperTower(Vector2 position) : base(position)
        {
            Range = 300.0f;
            Damage = 80.0f;
            FireRate = 0.3f;
            ProjectileSpeed = 600.0f;
        }
        
        protected override Enemy FindTarget(List<Enemy> enemies)
        {
            // Find the enemy with the most progress along the path
            Enemy mostProgressedEnemy = null;
            float maxProgress = -1.0f;
            
            foreach (Enemy enemy in enemies)
            {
                float distance = Vector2.Distance(Position, enemy.Position);
                
                if (distance <= Range)
                {
                    float progress = enemy.distanceTraveled / enemy.path.GetTotalLength();
                    
                    if (progress > maxProgress)
                    {
                        mostProgressedEnemy = enemy;
                        maxProgress = progress;
                    }
                }
            }
            
            return mostProgressedEnemy;
        }
        
        protected override Projectile CreateProjectile(Enemy target)
        {
            return new Projectile(Position, target.Position, ProjectileSpeed, Damage, 0.0f);
        }
    }
    
    // Splash tower
    public class SplashTower : Tower
    {
        public SplashTower(Vector2 position) : base(position)
        {
            Range = 120.0f;
            Damage = 30.0f;
            FireRate = 0.5f;
            ProjectileSpeed = 200.0f;
        }
        
        protected override Projectile CreateProjectile(Enemy target)
        {
            return new Projectile(Position, target.Position, ProjectileSpeed, Damage, 60.0f);
        }
    }
    
    // Projectile class
    public class Projectile
    {
        public Vector2 Position { get; private set; }
        public float Damage { get; private set; }
        public float SplashRadius { get; private set; }
        public float Radius { get; private set; }
        public float MaxRange { get; private set; }
        public float DistanceTraveled { get; private set; }
        
        private Vector2 direction;
        private float speed;
        
        public Projectile(Vector2 startPosition, Vector2 targetPosition, float speed, float damage, float splashRadius)
        {
            Position = startPosition;
            this.speed = speed;
            this.Damage = damage;
            this.SplashRadius = splashRadius;
            this.Radius = 5.0f;
            this.MaxRange = 800.0f;
            this.DistanceTraveled = 0.0f;
            
            // Calculate direction to target
            direction = (targetPosition - startPosition).normalized;
        }
        
        public void Update(float deltaTime)
        {
            Vector2 movement = direction * speed * deltaTime;
            Position += movement;
            DistanceTraveled += movement.magnitude;
        }
    }
}`,
      js: `document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');
  
  // Game elements
  let towers = [];
  let enemies = [];
  let projectiles = [];
  let gold = 100;
  let currentWave = 1;
  let waveInProgress = false;
  let selectedTowerType = null;
  
  // Tower costs
  const TOWER_COSTS = {
    'basic': 25,
    'sniper': 60,
    'splash': 80
  };
  
  // Tower properties
  const TOWER_PROPERTIES = {
    'basic': {
      range: 150,
      damage: 20,
      fireRate: 1,
      projectileSpeed: 300,
      color: '#3498db'
    },
    'sniper': {
      range: 300,
      damage: 80,
      fireRate: 0.3,
      projectileSpeed: 600,
      color: '#e74c3c'
    },
    'splash': {
      range: 120,
      damage: 30,
      fireRate: 0.5,
      projectileSpeed: 200,
      splashRadius: 60,
      color: '#f39c12'
    }
  };
  
  // Enemy path
  const path = [
    { x: -50, y: 250 },
    { x: 150, y: 250 },
    { x: 150, y: 100 },
    { x: 400, y: 100 },
    { x: 400, y: 350 },
    { x: 650, y: 350 },
    { x: 650, y: 200 },
    { x: 850, y: 200 }
  ];
  
  // Update UI elements
  function updateUI() {
    document.getElementById('gold').textContent = gold;
    document.getElementById('wave').textContent = currentWave;
  }
  
  // Path utilities
  function getPathLength() {
    let length = 0;
    for (let i = 0; i < path.length - 1; i++) {
      length += distance(path[i], path[i+1]);
    }
    return length;
  }
  
  function getPointAtDistance(dist) {
    let currentDist = 0;
    
    for (let i = 0; i < path.length - 1; i++) {
      const segmentLength = distance(path[i], path[i+1]);
      
      if (currentDist + segmentLength >= dist) {
        const t = (dist - currentDist) / segmentLength;
        return {
          x: path[i].x + t * (path[i+1].x - path[i].x),
          y: path[i].y + t * (path[i+1].y - path[i].y)
        };
      }
      
      currentDist += segmentLength;
    }
    
    return path[path.length - 1];
  }
  
  // Utility functions
  function distance(a, b) {
    return Math.sqrt((b.x - a.x) ** 2 + (b.y - a.y) ** 2);
  }
  
  function distanceToLineSegment(point, lineStart, lineEnd) {
    const lineLength = distance(lineStart, lineEnd);
    
    if (lineLength === 0) return distance(point, lineStart);
    
    const t = ((point.x - lineStart.x) * (lineEnd.x - lineStart.x) + 
              (point.y - lineStart.y) * (lineEnd.y - lineStart.y)) / (lineLength ** 2);
    
    const clampedT = Math.max(0, Math.min(1, t));
    
    const projection = {
      x: lineStart.x + clampedT * (lineEnd.x - lineStart.x),
      y: lineStart.y + clampedT * (lineEnd.y - lineStart.y)
    };
    
    return distance(point, projection);
  }
  
  // Tower placement validation
  function isTowerPlacementValid(pos) {
    const MIN_DISTANCE_TO_PATH = 30;
    const MIN_DISTANCE_TO_TOWER = 40;
    
    // Check distance to path
    for (let i = 0; i < path.length - 1; i++) {
      if (distanceToLineSegment(pos, path[i], path[i+1]) < MIN_DISTANCE_TO_PATH) {
        return false;
      }
    }
    
    // Check distance to other towers
    for (let tower of towers) {
      if (distance(pos, tower) < MIN_DISTANCE_TO_TOWER) {
        return false;
      }
    }
    
    return true;
  }
  
  // Enemy constructor
  function createEnemy(health, speed) {
    return {
      position: { x: path[0].x, y: path[0].y },
      health: health,
      maxHealth: health,
      speed: speed,
      distanceTraveled: 0,
      reachedEnd: false,
      radius: 15,
      goldReward: 10,
      
      update(deltaTime) {
        this.distanceTraveled += this.speed * deltaTime;
        const newPos = getPointAtDistance(this.distanceTraveled);
        this.position.x = newPos.x;
        this.position.y = newPos.y;
        
        if (this.distanceTraveled >= getPathLength()) {
          this.reachedEnd = true;
        }
      },
      
      takeDamage(damage) {
        this.health -= damage;
      },
      
      draw() {
        // Draw enemy
        ctx.fillStyle = '#e74c3c';
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw health bar
        const healthPercentage = this.health / this.maxHealth;
        ctx.fillStyle = healthPercentage > 0.5 ? '#2ecc71' : 
                       (healthPercentage > 0.25 ? '#f39c12' : '#e74c3c');
        ctx.fillRect(
          this.position.x - this.radius, 
          this.position.y - this.radius - 10,
          this.radius * 2 * healthPercentage,
          5
        );
        
        ctx.strokeStyle = '#333';
        ctx.strokeRect(
          this.position.x - this.radius, 
          this.position.y - this.radius - 10,
          this.radius * 2,
          5
        );
      }
    };
  }
  
  // Tower constructor
  function createTower(type, position) {
    const props = TOWER_PROPERTIES[type];
    
    return {
      position: { x: position.x, y: position.y },
      type: type,
      range: props.range,
      damage: props.damage,
      fireRate: props.fireRate,
      projectileSpeed: props.projectileSpeed,
      splashRadius: props.splashRadius || 0,
      color: props.color,
      cooldown: 0,
      
      update(deltaTime, enemies) {
        this.cooldown -= deltaTime;
        
        if (this.cooldown <= 0) {
          const target = this.findTarget(enemies);
          
          if (target) {
            this.fire(target);
            this.cooldown = 1 / this.fireRate;
          }
        }
      },
      
      findTarget(enemies) {
        let target = null;
        
        if (this.type === 'sniper') {
          // Sniper targets most progressed enemy
          let maxProgress = -1;
          
          for (let enemy of enemies) {
            if (distance(this.position, enemy.position) <= this.range) {
              const progress = enemy.distanceTraveled / getPathLength();
              
              if (progress > maxProgress) {
                target = enemy;
                maxProgress = progress;
              }
            }
          }
        } else {
          // Other towers target closest enemy
          let closestDistance = Infinity;
          
          for (let enemy of enemies) {
            const dist = distance(this.position, enemy.position);
            
            if (dist <= this.range && dist < closestDistance) {
              target = enemy;
              closestDistance = dist;
            }
          }
        }
        
        return target;
      },
      
      fire(target) {
        projectiles.push({
          position: { x: this.position.x, y: this.position.y },
          target: { x: target.position.x, y: target.position.y },
          speed: this.projectileSpeed,
          damage: this.damage,
          splashRadius: this.splashRadius,
          radius: 5,
          maxRange: 800,
          distanceTraveled: 0,
          color: this.color,
          
          update(deltaTime) {
            // Calculate direction
            const dx = this.target.x - this.position.x;
            const dy = this.target.y - this.position.y;
            const length = Math.sqrt(dx * dx + dy * dy);
            
            // Normalize and scale by speed
            const vx = length > 0 ? (dx / length) * this.speed * deltaTime : 0;
            const vy = length > 0 ? (dy / length) * this.speed * deltaTime : 0;
            
            // Move projectile
            this.position.x += vx;
            this.position.y += vy;
            
            // Update distance traveled
            this.distanceTraveled += Math.sqrt(vx * vx + vy * vy);
          },
          
          draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
            ctx.fill();
          }
        });
      },
      
      draw() {
        // Draw tower range indicator when selected
        if (selectedTowerType === this.type + '-selected') {
          ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
          ctx.beginPath();
          ctx.arc(this.position.x, this.position.y, this.range, 0, Math.PI * 2);
          ctx.fill();
          
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
          ctx.beginPath();
          ctx.arc(this.position.x, this.position.y, this.range, 0, Math.PI * 2);
          ctx.stroke();
        }
        
        // Draw tower
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 20, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, 20, 0, Math.PI * 2);
        ctx.stroke();
      }
    };
  }
  
  // Wave spawning
  function startWave() {
    if (waveInProgress) return;
    
    waveInProgress = true;
    const config = getWaveConfig();
    
    let enemiesSpawned = 0;
    const spawnInterval = setInterval(() => {
      enemies.push(createEnemy(config.enemyHealth, config.enemySpeed));
      enemiesSpawned++;
      
      if (enemiesSpawned >= config.enemyCount) {
        clearInterval(spawnInterval);
      }
    }, config.spawnInterval * 1000);
  }
  
  function getWaveConfig() {
    const waveFactor = 1.0 + (currentWave * 0.2);
    
    return {
      enemyCount: 10 + (currentWave * 2),
      spawnInterval: Math.max(0.5, 1.2 - (currentWave * 0.05)),
      enemyHealth: 50 * waveFactor,
      enemySpeed: 50 + (currentWave * 5)
    };
  }
  
  function applySplashDamage(projectile, centerEnemy) {
    for (let enemy of enemies) {
      if (enemy !== centerEnemy) {
        const dist = distance(centerEnemy.position, enemy.position);
        if (dist <= projectile.splashRadius) {
          const damageFactor = 1.0 - (dist / projectile.splashRadius);
          enemy.takeDamage(projectile.damage * damageFactor);
        }
      }
    }
  }
  
  // Drawing functions
  function drawPath() {
    ctx.strokeStyle = '#555';
    ctx.lineWidth = 30;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    
    ctx.stroke();
    
    // Draw path border
    ctx.strokeStyle = '#777';
    ctx.lineWidth = 32;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    ctx.beginPath();
    ctx.moveTo(path[0].x, path[0].y);
    
    for (let i = 1; i < path.length; i++) {
      ctx.lineTo(path[i].x, path[i].y);
    }
    
    ctx.stroke();
  }
  
  // Game loop
  let lastTime = 0;
  
  function gameLoop(timestamp) {
    const deltaTime = (timestamp - lastTime) / 1000;
    lastTime = timestamp;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw path
    drawPath();
    
    // Update towers
    for (let tower of towers) {
      tower.update(deltaTime, enemies);
      tower.draw();
    }
    
    // Update projectiles
    for (let i = projectiles.length - 1; i >= 0; i--) {
      const projectile = projectiles[i];
      projectile.update(deltaTime);
      projectile.draw();
      
      // Check for collisions with enemies
      for (let j = enemies.length - 1; j >= 0; j--) {
        const enemy = enemies[j];
        
        if (distance(projectile.position, enemy.position) < enemy.radius + projectile.radius) {
          // Apply damage
          enemy.takeDamage(projectile.damage);
          
          // Handle splash damage
          if (projectile.splashRadius > 0) {
            applySplashDamage(projectile, enemy);
          }
          
          // Remove projectile
          projectiles.splice(i, 1);
          
          // Check if enemy is dead
          if (enemy.health <= 0) {
            gold += enemy.goldReward;
            enemies.splice(j, 1);
            updateUI();
          }
          
          break;
        }
      }
      
      // Remove projectile if it's too far
      if (projectile.distanceTraveled > projectile.maxRange) {
        projectiles.splice(i, 1);
      }
    }
    
    // Update enemies
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      enemy.update(deltaTime);
      enemy.draw();
      
      // Check if enemy reached the end
      if (enemy.reachedEnd) {
        // Player loses life or game over logic here
        enemies.splice(i, 1);
      }
    }
    
    // Check if wave is complete
    if (waveInProgress && enemies.length === 0) {
      waveInProgress = false;
      currentWave++;
      updateUI();
    }
    
    // Preview tower placement
    if (selectedTowerType && selectedTowerType !== 'basic-selected' && 
        selectedTowerType !== 'sniper-selected' && selectedTowerType !== 'splash-selected') {
      const mousePos = { x: mouseX, y: mouseY };
      
      ctx.globalAlpha = 0.6;
      
      if (isTowerPlacementValid(mousePos) && gold >= TOWER_COSTS[selectedTowerType]) {
        ctx.fillStyle = TOWER_PROPERTIES[selectedTowerType].color;
      } else {
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
      }
      
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, 20, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, 20, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, TOWER_PROPERTIES[selectedTowerType].range, 0, Math.PI * 2);
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(mousePos.x, mousePos.y, TOWER_PROPERTIES[selectedTowerType].range, 0, Math.PI * 2);
      ctx.stroke();
      
      ctx.globalAlpha = 1.0;
    }
    
    requestAnimationFrame(gameLoop);
  }
  
  // Mouse tracking
  let mouseX = 0;
  let mouseY = 0;
  
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  });
  
  canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;
    
    // Place tower if one is selected
    if (selectedTowerType && selectedTowerType !== 'basic-selected' &&
        selectedTowerType !== 'sniper-selected' && selectedTowerType !== 'splash-selected') {
      const position = { x: clickX, y: clickY };
      
      if (isTowerPlacementValid(position) && gold >= TOWER_COSTS[selectedTowerType]) {
        towers.push(createTower(selectedTowerType, position));
        gold -= TOWER_COSTS[selectedTowerType];
        updateUI();
      }
    } else {
      // Check if clicked on a tower
      for (let tower of towers) {
        if (distance({ x: clickX, y: clickY }, tower.position) <= 20) {
          selectedTowerType = tower.type + '-selected';
          return;
        }
      }
      
      // Deselect if clicked on empty space
      if (selectedTowerType && selectedTowerType.includes('-selected')) {
        selectedTowerType = null;
      }
    }
  });
  
  // Set up tower buttons
  document.getElementById('basic-tower').addEventListener('click', () => {
    selectedTowerType = 'basic';
  });
  
  document.getElementById('sniper-tower').addEventListener('click', () => {
    selectedTowerType = 'sniper';
  });
  
  document.getElementById('splash-tower').addEventListener('click', () => {
    selectedTowerType = 'splash';
  });
  
  // Start wave button
  document.getElementById('start-wave').addEventListener('click', () => {
    startWave();
  });
  
  // Highlight selected tower button
  const towerButtons = document.querySelectorAll('.tower-btn');
  towerButtons.forEach(button => {
    button.addEventListener('click', () => {
      towerButtons.forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
    });
  });
  
  // Initial UI update
  updateUI();
  
  // Start game loop
  requestAnimationFrame(gameLoop);
});`
    },
    difficulty: "intermediate",
    featured: true,
    playUrl: "/play/tower-defense"
  };
};
